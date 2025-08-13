'use client';

import { useState } from 'react';

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { useTRPC } from '@/trpc/client';
import { useConfirm } from '@/hooks/use-confirm';
import ErrorState from '@/components/error-state';
import ActiveState from '../components/active-state';
import LoadingState from '@/components/loading-state';
import UpcomingState from '../components/upcoming-state';
import UpdateMeetingDialog from '../components/update-meeting-dialog';
import MeetingIdViewHeader from '../components/meeting-id-view-header';
import CancelledState from '../components/cancelled-state';
import ProcessingState from '../components/processing-state';

interface Props {
  meetingId: string;
}

const MeetingIdView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    'Are you sure?',
    'The following action will remove this meeting'
  );

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },

      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        router.push('/meetings');
      },
    })
  );

  function handleEdit() {
    setUpdateMeetingDialogOpen(true);
  }

  async function handleRemove() {
    const ok = await confirmRemove();

    if (!ok) return;

    await removeMeeting.mutateAsync({ id: meetingId });
  }

  const isActive = data.status === 'active';
  const isUpcoming = data.status === 'upcoming';
  const isCancelled = data.status === 'cancelled';
  const isCompleted = data.status === 'completed';
  const isProcessing = data.status === 'processing';

  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        initialValues={data}
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
      />

      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          onEdit={handleEdit}
          meetingId={meetingId}
          onRemove={handleRemove}
          meetingName={data.name}
        />

        {isCancelled && <CancelledState />}
        {isProcessing && <ProcessingState />}
        {isActive && <ActiveState meetingId={meetingId} />}

        {isUpcoming && (
          <UpcomingState
            isCancelling={false}
            meetingId={meetingId}
            onCancelMeeting={() => {}}
          />
        )}

        {isCompleted && <div>Completed</div>}
      </div>
    </>
  );
};

export default MeetingIdView;

export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a few seconds"
    />
  );
};

export const MeetingIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading Meeting"
      description="Please try again later"
    />
  );
};
