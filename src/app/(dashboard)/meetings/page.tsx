import { Suspense } from 'react';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { auth } from '@/lib/auth';
import { getQueryClient, trpc } from '@/trpc/server';
import MeetingsView, {
  MeetingsViewError,
  MeetingsViewLoading,
} from '@/modules/meetings/server/ui/view/meetings-view';

const Page = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}));

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingsViewLoading />}>
        <ErrorBoundary fallback={<MeetingsViewError />}>
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
