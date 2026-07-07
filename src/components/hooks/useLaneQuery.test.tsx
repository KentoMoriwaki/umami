import { act } from '@testing-library/react';
import { Suspense } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/render';
import { useLaneQuery } from './useLaneQuery';

function QueryReader({
  laneKey,
  loader,
  enabled = true,
  refetchInterval,
}: {
  laneKey: readonly unknown[];
  loader: () => Promise<string>;
  enabled?: boolean;
  refetchInterval?: number;
}) {
  const { data } = useLaneQuery({
    laneKey,
    loader,
    enabled,
    refetchInterval,
  });

  return <div>{enabled ? data : 'disabled'}</div>;
}

describe('useLaneQuery', () => {
  it('suspends to the nearest fallback before resolving the initial Lane read', async () => {
    let resolveLoad: (value: string) => void = () => undefined;
    const loadPromise = new Promise<string>(resolve => {
      resolveLoad = resolve;
    });
    const loader = vi.fn(() => loadPromise);

    await act(async () => {
      render(
        <Suspense fallback={<div>suspense fallback</div>}>
          <QueryReader laneKey={['deferred-read']} loader={loader} />
        </Suspense>,
      );
    });

    expect(screen.getByText('suspense fallback')).toBeInTheDocument();

    await waitFor(() => {
      expect(loader).toHaveBeenCalledTimes(1);
    });
    await act(async () => {
      resolveLoad('loaded');
      await loadPromise;
      await Promise.resolve();
      await Promise.resolve();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(screen.getByText('loaded')).toBeInTheDocument();
    });
    expect(screen.queryByText('suspense fallback')).not.toBeInTheDocument();
  });

  it('does not load when disabled', () => {
    const loader = vi.fn(async () => 'loaded');

    render(<QueryReader laneKey={['disabled-read']} loader={loader} enabled={false} />);

    expect(screen.getByText('disabled')).toBeInTheDocument();
    expect(loader).not.toHaveBeenCalled();
  });

  it('does not re-arm polling when an equivalent inline lane key is re-rendered', async () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const pollingIntervalCalls = () =>
      setIntervalSpy.mock.calls.filter(([, delay]) => delay === 5000);
    const loader = vi.fn(async () => 'loaded');

    const view = (id: string) => (
      <Suspense fallback={<div>suspense fallback</div>}>
        <QueryReader laneKey={['polling-read', { id }]} loader={loader} refetchInterval={5000} />
      </Suspense>
    );

    try {
      let rendered!: ReturnType<typeof render>;

      await act(async () => {
        rendered = render(view('same-key'));
      });

      await waitFor(() => {
        expect(screen.getByText('loaded')).toBeInTheDocument();
      });
      expect(pollingIntervalCalls()).toHaveLength(1);

      await act(async () => {
        rendered.rerender(view('same-key'));
      });

      await waitFor(() => {
        expect(screen.getByText('loaded')).toBeInTheDocument();
      });
      expect(pollingIntervalCalls()).toHaveLength(1);

      rendered.unmount();
    } finally {
      setIntervalSpy.mockRestore();
    }
  });
});
