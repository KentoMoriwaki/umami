import type { Lane, LaneKey, LaneScope } from 'use-lane';

function first(key: LaneKey) {
  return key[0];
}

function objectSegment(key: LaneKey): Record<string, any> {
  return typeof key[1] === 'object' && key[1] !== null && !Array.isArray(key[1])
    ? (key[1] as Record<string, any>)
    : {};
}

function startsWith(value: unknown, prefix: string) {
  return typeof value === 'string' && value.startsWith(prefix);
}

function includes(value: unknown, text: string) {
  return typeof value === 'string' && value.includes(text);
}

export function laneScopeForModifiedKey(key?: string): LaneScope {
  if (!key) {
    return () => true;
  }

  if (key.startsWith('board:')) {
    const boardId = key.slice('board:'.length);
    return entry => {
      const segment = objectSegment(entry.key);
      return first(entry.key) === 'boards' && segment.boardId === boardId;
    };
  }

  if (key.startsWith('link:')) {
    const linkId = key.slice('link:'.length);
    return entry => {
      const segment = objectSegment(entry.key);
      return first(entry.key) === 'link' && segment.linkId === linkId;
    };
  }

  if (key.startsWith('pixel:')) {
    const pixelId = key.slice('pixel:'.length);
    return entry => {
      const segment = objectSegment(entry.key);
      return first(entry.key) === 'pixel' && segment.pixelId === pixelId;
    };
  }

  if (key.startsWith('report:')) {
    const reportId = key.slice('report:'.length);
    return entry => {
      const segment = objectSegment(entry.key);
      return first(entry.key) === 'report' && segment.reportId === reportId;
    };
  }

  if (key.startsWith('reports:')) {
    const type = key.slice('reports:'.length);
    return entry => {
      const segment = objectSegment(entry.key);
      return first(entry.key) === 'reports' && segment.type === type;
    };
  }

  if (key.startsWith('team:') || key.startsWith('teams:')) {
    const teamId = key.includes(':') ? key.slice(key.indexOf(':') + 1) : undefined;

    if (teamId && teamId !== 'members') {
      return entry => {
        const segment = objectSegment(entry.key);
        return startsWith(first(entry.key), 'teams') && segment.teamId === teamId;
      };
    }
  }

  if (key.startsWith('user:') || key.startsWith('users:')) {
    const userId = key.includes(':') ? key.slice(key.indexOf(':') + 1) : undefined;

    if (userId) {
      return entry => {
        const segment = objectSegment(entry.key);
        return startsWith(first(entry.key), 'users') && segment.userId === userId;
      };
    }
  }

  if (key.startsWith('website:') || key.startsWith('websites:')) {
    const websiteId = key.includes(':') ? key.slice(key.indexOf(':') + 1) : undefined;

    if (websiteId && !['segments', 'cohorts', 'stats', 'events', 'metrics'].includes(websiteId)) {
      return entry => {
        const segment = objectSegment(entry.key);
        return startsWith(first(entry.key), 'website') && segment.websiteId === websiteId;
      };
    }
  }

  switch (key) {
    case 'boards':
      return entry => first(entry.key) === 'boards';
    case 'dashboard':
      return ['dashboard'];
    case 'links':
      return entry => first(entry.key) === 'links' || first(entry.key) === 'link';
    case 'pixels':
      return entry => first(entry.key) === 'pixels' || first(entry.key) === 'pixel';
    case 'shares':
      return entry => includes(first(entry.key), 'Shares') || first(entry.key) === 'share';
    case 'teams':
      return entry => startsWith(first(entry.key), 'teams') || first(entry.key) === 'team';
    case 'teams:members':
      return entry => first(entry.key) === 'teams:members';
    case 'users':
      return entry => startsWith(first(entry.key), 'users');
    case 'websites':
      return entry => startsWith(first(entry.key), 'website');
    case 'segments':
      return entry => first(entry.key) === 'website:segments';
    case 'cohorts':
      return entry => first(entry.key) === 'website:cohorts';
    case 'sessions':
      return entry =>
        startsWith(first(entry.key), 'sessions') || includes(first(entry.key), 'session');
    case 'replays':
      return entry => includes(first(entry.key), 'replay');
    case 'revenue-sessions':
      return entry => first(entry.key) === 'revenue:sessions';
    default:
      return [key];
  }
}

export function invalidateModifiedKey(lane: Lane, key?: string) {
  lane.invalidateAll(laneScopeForModifiedKey(key));
}
