import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import type { SearchParams } from 'nuqs';
import { ErrorBoundary } from 'react-error-boundary';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { auth } from '@/lib/auth';
import AgentsView, {
  AgentsViewError,
  AgentsViewLoading,
} from '@/modules/agents/ui/views/agents-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { loadSearchParams } from '@/modules/agents/params';
import AgentsListHeader from '@/modules/agents/ui/components/agents-list-header';

interface Props {
  searchParams: Promise<SearchParams>;
}

const page = async ({ searchParams }: Props) => {
  const params = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({ ...params })
  );
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  return (
    <>
      <AgentsListHeader />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsViewLoading />}>
          <ErrorBoundary fallback={<AgentsViewError />}>
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default page;
