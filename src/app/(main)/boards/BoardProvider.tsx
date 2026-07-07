'use client';
import { useToast } from '@umami/react-zen';
import { createContext, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useApi, useMessages, useModified, useNavigation } from '@/components/hooks';
import { useBoardQuery } from '@/components/hooks/queries/useBoardQuery';
import { BOARD_TYPES, getBoardType } from '@/lib/boards';
import type { Board, BoardParameters } from '@/lib/types';
import { getComponentDefinition } from './boardComponentRegistry';

export type LayoutGetter = () => Partial<BoardParameters> | null;

export interface BoardContextValue {
  board: Partial<Board>;
  editing: boolean;
  updateBoard: (data: Partial<Board>) => void;
  saveBoard: () => Promise<Board>;
  isPending: boolean;
  registerLayoutGetter: (getter: LayoutGetter) => void;
}

export const BoardContext = createContext<BoardContextValue>(null);

const createDefaultBoard = (): Partial<Board> => ({
  type: BOARD_TYPES.mixed,
  name: '',
  description: '',
  parameters: {
    rows: [{ id: uuid(), columns: [{ id: uuid(), component: null }] }],
  },
});

function sanitizeBoardParameters(parameters?: BoardParameters): BoardParameters | undefined {
  if (!parameters?.rows) {
    return parameters;
  }

  return {
    ...parameters,
    rows: parameters.rows.map(row => ({
      ...row,
      columns: row.columns.map(column => {
        if (column.component && !getComponentDefinition(column.component.type)) {
          return {
            ...column,
            component: null,
          };
        }

        return column;
      }),
    })),
  };
}

export function BoardProvider({
  boardId,
  editing = false,
  children,
}: {
  boardId?: string;
  editing?: boolean;
  children: ReactNode;
}) {
  const { data } = useBoardQuery(boardId);
  const { post } = useApi();
  const { touch } = useModified();
  const { toast } = useToast();
  const { t, labels, messages } = useMessages();
  const { router, renderUrl, teamId } = useNavigation();

  const [board, setBoard] = useState<Partial<Board>>(data ?? createDefaultBoard());
  const [isPending, setIsPending] = useState(false);
  const boardRef = useRef<Partial<Board>>(data ?? createDefaultBoard());
  const layoutGetterRef = useRef<LayoutGetter | null>(null);

  const registerLayoutGetter = useCallback((getter: LayoutGetter) => {
    layoutGetterRef.current = getter;
  }, []);

  useEffect(() => {
    if (data) {
      const nextBoard = {
        ...data,
        type: getBoardType(data, { coerceDashboard: true }),
        parameters: sanitizeBoardParameters(data.parameters),
      };

      boardRef.current = nextBoard;
      setBoard(nextBoard);
    }
  }, [data]);

  const updateBoard = useCallback((data: Partial<Board>) => {
    setBoard(current => {
      const nextBoard = { ...current, ...data };
      boardRef.current = nextBoard;

      return nextBoard;
    });
  }, []);

  const saveBoard = useCallback(async () => {
    const currentBoard = boardRef.current;
    const defaultName = t(labels.untitled);

    // Get current layout sizes from BoardEditBody if registered
    const layoutData = layoutGetterRef.current?.();
    const parameters = sanitizeBoardParameters(
      layoutData ? { ...currentBoard.parameters, ...layoutData } : currentBoard.parameters,
    );

    const nextBoard = {
      ...currentBoard,
      name: currentBoard.name || defaultName,
      parameters,
    };

    setIsPending(true);

    const result = await (async () => {
      try {
        if (nextBoard.id) {
          return await post(`/boards/${nextBoard.id}`, nextBoard);
        }

        return await post('/boards', {
          ...nextBoard,
          type: nextBoard.type || BOARD_TYPES.mixed,
          slug: '',
          teamId,
        });
      } finally {
        setIsPending(false);
      }
    })();

    toast(t(messages.saved));
    touch('boards');

    if (currentBoard.id) {
      touch(`board:${currentBoard.id}`);
    } else if (result?.id) {
      router.push(renderUrl(`/boards/${result.id}`));
    }

    return result;
  }, [post, teamId, toast, t, labels.untitled, messages.saved, touch, router, renderUrl]);

  return (
    <BoardContext.Provider
      value={{ board, editing, updateBoard, saveBoard, isPending, registerLayoutGetter }}
    >
      {children}
    </BoardContext.Provider>
  );
}
