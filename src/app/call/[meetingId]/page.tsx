import { Suspense } from 'react';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ErrorBoundary } from 'react-error-boundary';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { auth } from '@/lib/auth';
import { getQueryClient, trpc } from '@/trpc/server';
import CallView from '@/modules/call/ui/views/call-view';

interface Props {
  params: Promise<{ meetingId: string }>;
}

const page = async ({ params }: Props) => {
  const { meetingId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <CallView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;
