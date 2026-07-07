# use-lane Migration Plan

作成日: 2026-07-06

## 目的

このリポジトリの TanStack Query 依存を use-lane に置き換える。

最終状態では `@tanstack/react-query` の import、`QueryClientProvider`、`useQuery`、`useMutation`、`UseQueryOptions`、`UseQueryResult` をなくし、読み取りは `useLane` と `use()`、初期 loading は読み取り箇所の外側に置いた `Suspense fallback`、初期 error は Error Boundary、再読込中の pending は `isTransitionPending` / `isBackgroundPending` で表現する。

## 前提

use-lane はすでに導入済み。

- `package.json` に `use-lane`
- `src/app/Providers.tsx` に `LaneProvider`
- `AGENTS.md` に `node_modules/use-lane/skills/use-lane/SKILL.md` の参照

実装前には必ず `node_modules/use-lane/skills/use-lane/SKILL.md` を読み、必要に応じて同梱 reference を読む。

## 現状把握

React Query の入口は主に以下。

- `src/app/Providers.tsx`: `QueryClient` と `QueryClientProvider`
- `src/components/hooks/useApi.ts`: `get` / `post` / `put` / `del` と一緒に `useQuery` / `useMutation` を再 export
- `src/components/hooks/queries/*.ts`: query hook が 72 ファイル
- `src/components/hooks/usePagedQuery.ts`: `UseQueryOptions` / `UseQueryResult` ベースのページング query
- `src/components/common/DataGrid.tsx`: `UseQueryResult<PageResult>` を props として受ける
- `src/test/render.tsx`: test wrapper で `QueryClientProvider`
- `src/lib/types.ts`: `ReactQueryOptions`

React Query 固有のパターン。

- `enabled` は多くの hook で使われている。use-lane では `loader: undefined` に置き換える。
- `placeholderData: keepPreviousData` は 14 hook で使われている。use-lane では transition または `useDeferredValue` で key change を非 blocking にする。
- `refetchInterval` は `useRealtimeQuery` にある。use-lane では timer から `lane.invalidate(key, { background: true, onlyIf: "settled" })` を呼ぶ。
- `select` は `useEventStatsQuery` にある。use-lane では `use(promise).data` のあと render 内で変換するか、loader 内で API response を正規化する。
- `useModified` は mutation 後に timestamp を query key に混ぜるために使われている。use-lane では key を汚さず、`lane.invalidate` / `lane.invalidateAll` に置き換える。
- `useUpdateQuery` / `useDeleteQuery` / `DashboardProvider` / `BoardProvider` は `useMutation` を使う。use-lane には mutation helper がないため、mutation pending/error は React local state または `useActionState` / `useTransition` で扱い、成功後に Lane を invalidate / set / update する。

## 移行方針

Big bang ではなく、TanStack Query と use-lane を一時的に併用しながら vertical slice ごとに移行する。

互換 wrapper で React Query の `data` / `isLoading` / `error` / `status` モデルを再実装しない。use-lane の基本形を守る。

```tsx
const { promise, isBackgroundPending, isTransitionPending } = useLane(
  key,
  ({ signal }) => load(signal),
  options,
);
const { data, refreshError } = use(promise);
```

親の `<Suspense fallback={...}>` は安全網として置く。実際の初期 loading は `Panel`、`PageBody`、provider/page wrapper など、読み取り単位に近い境界の `fallback` で表示する。初期 error は既存 `ErrorBoundary`、refresh 失敗は `refreshError` を非 fatal な inline 表示として扱う。

既存の `LoadingPanel` は `isLoading` / `isFetching` を前提にしているため、移行中に以下へ分解する。

- 初期ロード用: Suspense fallback として使える loading surface
- refresh pending 用: 既存 data を隠さない小さな pending 表示
- refresh error 用: stale data を表示したまま出す non-blocking error 表示

## Target Architecture

読み取り。

- `useApi` は HTTP helper のみにする。
- `httpGet` / `request` は use-lane loader の `AbortSignal` を受け取れるようにする。
- query key は `modified` を含めない安定した構造配列にする。
- key factory を作る。例: `src/lib/lane-keys.ts`
- hook は `useLane` の結果を返すか、呼び出し元で `use()` できる promise を返す。
- `enabled` は loader gating で表現する。
- `keepPreviousData` は state 更新元の transition、または `useDeferredValue` で表現する。
- polling は component effect から background invalidation で表現する。

mutation。

- `useMutation` は使わない。
- form pending/error は component local state、`useActionState`、または薄い local action hook で扱う。
- 成功後は `lane.invalidate(key)`、`lane.invalidateAll(scope)`、または server-confirmed response を `lane.set(key, value)` で反映する。
- optimistic UI は必要な component に閉じて `useOptimistic` で扱う。

test。

- `src/test/render.tsx` は `LaneProvider` を含む wrapper に更新する。
- TanStack Query client は最後に削除する。

## Key Strategy

key は prefix invalidation しやすい名前にそろえる。

候補。

```ts
["login"]
["dashboard"]
["board", boardId]
["boards", { teamId, page, search, orderBy, sortDescending }]
["website", websiteId]
["websites", { teamId, userId, page, search }]
["team", teamId]
["teams", { userId, page, search }]
["link", linkId]
["links", { teamId, page, search }]
["pixel", pixelId]
["pixels", { teamId, page, search }]
["report", reportId]
["reports", { websiteId, type }]
["website-stats", { websiteId, dateRange, filters }]
["website-pageviews", { websiteId, dateRange, filters }]
["realtime", websiteId]
```

注意点。

- `Date` は use-lane の key segment として利用可能だが、API params と key の値がずれないように同じ正規化済み値から作る。
- object segment は serializable な plain object に限定する。
- `modified` は key に入れない。
- loader は inline closure でよい。dedupe は loader identity ではなく key で行われる。

## Execution Phases

### Phase 0: Safety Net

- `pnpm exec tsc --noEmit --pretty false` を baseline として通す。
- `pnpm exec biome check .` の現状を確認する。
- 主要 query import の一覧を保存する。
- migration 中は各 phase の最後に `rg "@tanstack/react-query|useQuery|useMutation|UseQueryOptions|UseQueryResult"` を確認する。

### Phase 1: Lane Infrastructure

- `src/lib/fetch.ts` の `request` / `httpGet` / `httpDelete` / `httpPost` / `httpPut` に `AbortSignal` を渡せる options を追加する。
- `src/components/hooks/useApi.ts` から TanStack Query の再 export を外す準備をする。
- `src/lib/lane-keys.ts` を追加し、既存 query key を Lane key へ寄せる。
- `src/test/render.tsx` に `LaneProvider` を追加する。
- Suspense fallback と refresh pending を扱う小さな UI helper を追加する。

### Phase 2: Pilot Slice

小さくても use-lane の主要パターンを確認できる slice を選ぶ。

- gated read: `useActiveUsersQuery` または `useDateRangeQuery`
- filter/date key change: `useWebsiteStatsQuery` または `useWebsiteMetricsQuery`
- polling: `useRealtimeQuery`
- simple mutation convergence: website / board / link のどれか 1 つの edit/delete

この phase で確認すること。

- `loader: undefined` による gating が機能する。
- `use(promise)` を呼ぶ component の上に Suspense boundary がある。
- filter / date / route 変更時に fallback flash しない。
- refresh 中に既存 data を隠さない。
- refresh 失敗時に stale data が残る。
- mutation 成功後に `lane.invalidate` / `lane.set` で画面が収束する。

### Phase 3: Common Surfaces

- `DataGrid` を `UseQueryResult` 前提から外す。
- `usePagedQuery` を use-lane 用に作り直すか、paged query hook 側へ責務を戻す。
- `PageBody` / `LoadingPanel` / metric panels の loading/error contract を Suspense 前提に整理する。
- context providers の「loaded data を draft state にコピーする」箇所を見直す。
- `useLoginQuery` と `useShareTokenQuery` の side effect を、`use()` 後の data と local effect の責務に分離する。

### Phase 4: Bulk Read Migration

カテゴリごとに移行し、各カテゴリごとに typecheck とブラウザ確認を行う。

1. Entity/detail hooks: user, team, website, board, pixel, link, report
2. Paged list hooks: users, teams, websites, boards, pixels, links, shares, sessions, events, replays
3. Dashboard and website overview hooks: stats, metrics, pageviews, active users, weekly traffic
4. Property/session/event data hooks
5. Reports: breakdown, funnel, goal, retention, revenue, attribution, journey, performance, UTM, heatmap
6. Realtime and replay-specific flows

各 hook の変換ルール。

- `enabled: cond` -> `cond ? loader : undefined`
- `queryFn: () => get(path, params)` -> `({ signal }) => get(path, params, {}, { signal })` のように signal を通す
- `placeholderData: keepPreviousData` -> caller の state transition または `useDeferredValue`
- `select` -> loader 内で返り値を正規化するか、`use(promise).data` 後に render 内で導出
- `isLoading` -> `Suspense fallback`。`useLaneQuery` は `use(promise)` で直接読む。
- `isFetching` -> `isBackgroundPending` / `isTransitionPending`
- `error` -> Error Boundary、ただし refresh error は `refreshError`

### Phase 5: Mutation And Invalidation

- `useUpdateQuery` / `useDeleteQuery` を TanStack Query から切り離す。
- `useModified.touch` 呼び出しを Lane invalidation に置き換える。
- scope mapping を作る。

例。

```ts
touch("boards") -> lane.invalidateAll(["boards"])
touch(`board:${id}`) -> lane.invalidate(["board", id])
touch("websites") -> lane.invalidateAll(["websites"])
touch(`website:${id}`) -> lane.invalidate(["website", id])
touch("shares") -> lane.invalidateAll((entry) => String(entry.key[0]).includes("shares"))
```

移行後、`useModified` は削除候補にする。

### Phase 6: Remove TanStack Query

- `src/app/Providers.tsx` から `QueryClientProvider` と `QueryClient` を削除する。
- `src/test/render.tsx` から QueryClient wrapper を削除する。
- `src/lib/types.ts` の `ReactQueryOptions` を削除または Lane 用 type に置き換える。
- `package.json` から `@tanstack/react-query` を削除する。
- `pnpm install` で lockfile を更新する。
- `rg "@tanstack/react-query|QueryClient|useQuery|useMutation|UseQueryOptions|UseQueryResult|keepPreviousData"` が 0 件になることを確認する。

## Verification Plan

軽量検証。

```sh
pnpm exec tsc --noEmit --pretty false
pnpm exec biome check .
pnpm test
```

production standalone 検証。

```sh
pnpm install
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db
pnpm run build
pnpm run seed-data -- --days 30 --clear
cp -R .next/static .next/standalone/.next/static
cp -R public .next/standalone/public
HOSTNAME=127.0.0.1 PORT=3000 node .next/standalone/server.js
```

background 起動する場合。

```sh
setsid sh -c 'cd /home/kentomoriwaki/ghq/github.com/umami-software/umami && HOSTNAME=127.0.0.1 PORT=3000 node .next/standalone/server.js > /tmp/umami-standalone.log 2>&1' >/dev/null 2>&1 &
```

API health check。

```sh
curl http://127.0.0.1:3000/api/heartbeat
```

期待値。

```json
{"ok":true}
```

DB 件数確認。

```sh
docker exec umami-db-1 psql -U umami -d umami \
  -c "select name, domain from website order by created_at desc;" \
  -c "select count(*) as sessions from session;" \
  -c "select count(*) as events from website_event;"
```

browser smoke。

```sh
agent-browser open http://127.0.0.1:3000/login
agent-browser wait 1000
agent-browser snapshot -i
```

ログイン確認。

- URL: `http://127.0.0.1:3000`
- user: `admin`
- password: `umami`
- ログイン後に `/websites` へ遷移する
- `Demo Blog` と `Demo SaaS` が表示される
- Website overview, sessions, events, realtime, reports, dashboard, boards, settings を smoke test する
- date range / filters / pagination / search の切り替えで fallback flash や stale UI がないことを確認する

停止。

```sh
pkill -f ".next/standalone/server.js"
docker compose -f docker-compose.yml -f docker-compose.dev.yml stop db
```

DB を消して最初からやり直す場合だけ。

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

## Risks

- `use()` の導入により、hook だけで完結せず caller 側の component 分割と Suspense boundary が必要になる。
- 既存 `LoadingPanel` は `isFetching` 中に data を隠すため、Lane の stale-while-refresh と相性が悪い。
- `useModified` は広く使われているため、invalidation mapping を雑に移すと refresh 漏れか過剰 refresh が起きる。
- `httpGet` が AbortSignal をまだ受け取れないため、Phase 1 で必ず対応する。
- `keepPreviousData` を単純削除すると filter / pagination / route change で fallback flash する。
- `useShareTokenQuery` や `useLoginQuery` は読み取りと global store side effect が混ざっているため、単純変換では無限 effect や二重 set に注意する。
- report / analytics 系は key object が大きく、Date や filter object の正規化がずれると cache miss が増える。

## Definition Of Done

- `rg "@tanstack/react-query|QueryClient|useQuery|useMutation|UseQueryOptions|UseQueryResult|keepPreviousData"` が 0 件
- `@tanstack/react-query` が `package.json` と `pnpm-lock.yaml` から削除済み
- `QueryClientProvider` が app/test wrapper から削除済み
- すべての use-lane loader が必要な場所で `AbortSignal` を HTTP layer に渡している
- mutation 後の収束が `lane.invalidate` / `lane.invalidateAll` / `lane.set` / `lane.update` で表現されている
- `useModified` が削除済み、または TanStack Query 由来の timestamp key invalidation としては使われていない
- `pnpm exec tsc --noEmit --pretty false` が通る
- `pnpm exec biome check .` が通る
- production standalone server で login、demo websites、主要 analytics 画面の smoke test が通る

## Completion Status

完了日: 2026-07-06

- `@tanstack/react-query` を `package.json` / `pnpm-lock.yaml` から削除済み
- `QueryClientProvider` / `QueryClient` を app/test wrapper から削除済み
- query hooks は `useLaneQuery` / `usePagedQuery` 経由の use-lane read に移行済み
- `useLaneQuery` は `use(promise)` で直接 read し、初期 loading は `Panel` / `PageBody` / provider wrapper / page wrapper の `Suspense fallback` に移行済み
- mutation hooks と provider mutation は local pending/error state + Lane invalidation に移行済み
- `useModified` は timestamp を query key に混ぜる用途ではなく、Lane invalidation の互換入口として残している
- production standalone server で login、demo websites、search、sessions、events、realtime、revenue、dashboard、boards、settings smoke を確認済み
- `/api/users/{userId}/websites` と `/api/websites/{websiteId}/events*` を 3 秒遅延させ、app shell と該当データ領域の fallback が機能することを確認済み
- `src/components/hooks/useLaneQuery.test.tsx` で初期 read が最寄りの `Suspense fallback` に suspend することと disabled gating を回帰テスト化済み

最終検証。

```sh
pnpm exec tsc --noEmit --pretty false
pnpm exec biome check . --max-diagnostics=200
pnpm test
pnpm run build
rg "@tanstack/react-query|QueryClient|useQuery|useMutation|UseQueryOptions|UseQueryResult|keepPreviousData" src package.json pnpm-lock.yaml
```
