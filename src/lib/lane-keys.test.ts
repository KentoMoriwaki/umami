import type { LaneScope } from 'use-lane';
import { describe, expect, it } from 'vitest';
import { laneScopeForModifiedKey } from './lane-keys';

function entry(key: readonly unknown[]) {
  return { key } as any;
}

function expectMatches(scope: LaneScope, key: readonly unknown[]) {
  expect(typeof scope).toBe('function');
  expect((scope as (value: any) => boolean)(entry(key))).toBe(true);
}

function expectMisses(scope: LaneScope, key: readonly unknown[]) {
  expect(typeof scope).toBe('function');
  expect((scope as (value: any) => boolean)(entry(key))).toBe(false);
}

describe('laneScopeForModifiedKey', () => {
  it('matches every entry when no modified key is provided', () => {
    const scope = laneScopeForModifiedKey();

    expectMatches(scope, ['websites', { websiteId: 'website-1' }]);
  });

  it.each([
    ['board:board-1', ['boards', { boardId: 'board-1' }], ['boards', { boardId: 'board-2' }]],
    ['link:link-1', ['link', { linkId: 'link-1' }], ['links', { linkId: 'link-1' }]],
    ['pixel:pixel-1', ['pixel', { pixelId: 'pixel-1' }], ['pixels', { pixelId: 'pixel-1' }]],
    [
      'report:report-1',
      ['report', { reportId: 'report-1' }],
      ['reports', { reportId: 'report-1' }],
    ],
    ['reports:funnel', ['reports', { type: 'funnel' }], ['reports', { type: 'goal' }]],
    ['team:team-1', ['teams', { teamId: 'team-1' }], ['teams', { teamId: 'team-2' }]],
    ['teams:team-1', ['teams:members', { teamId: 'team-1' }], ['team', { teamId: 'team-1' }]],
    ['user:user-1', ['users', { userId: 'user-1' }], ['users', { userId: 'user-2' }]],
    [
      'website:website-1',
      ['website:stats', { websiteId: 'website-1' }],
      ['website:stats', { websiteId: 'website-2' }],
    ],
  ] as const)('matches the %s prefix scope', (modifiedKey, matchingKey, missingKey) => {
    const scope = laneScopeForModifiedKey(modifiedKey);

    expectMatches(scope, matchingKey);
    expectMisses(scope, missingKey);
  });

  it.each([
    ['boards', ['boards', {}], ['board', {}]],
    ['links', ['link', {}], ['pixels', {}]],
    ['pixels', ['pixels', {}], ['links', {}]],
    ['shares', ['websiteShares', {}], ['websites', {}]],
    ['teams', ['teams:admin', {}], ['users', {}]],
    ['teams:members', ['teams:members', {}], ['teams', {}]],
    ['users', ['users:admin', {}], ['teams', {}]],
    ['websites', ['website:stats', {}], ['teams', {}]],
    ['segments', ['website:segments', {}], ['website:cohorts', {}]],
    ['cohorts', ['website:cohorts', {}], ['website:segments', {}]],
    ['sessions', ['session-replays', {}], ['replays', {}]],
    ['replays', ['replay', {}], ['sessions', {}]],
    ['revenue-sessions', ['revenue:sessions', {}], ['revenue:stats', {}]],
  ] as const)('matches the %s named scope', (modifiedKey, matchingKey, missingKey) => {
    const scope = laneScopeForModifiedKey(modifiedKey);

    expectMatches(scope, matchingKey);
    expectMisses(scope, missingKey);
  });

  it.each([
    ['dashboard', ['dashboard']],
    ['website:segments', ['website:segments']],
    ['unknown-key', ['unknown-key']],
  ] as const)('falls back to an exact Lane key for %s', (modifiedKey, laneKey) => {
    expect(laneScopeForModifiedKey(modifiedKey)).toEqual(laneKey);
  });
});
