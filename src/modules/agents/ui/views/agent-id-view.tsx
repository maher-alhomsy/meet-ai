'use client';

import { useState } from 'react';

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { VideoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useTRPC } from '@/trpc/client';
import { Badge } from '@/components/ui/badge';
import { useConfirm } from '@/hooks/use-confirm';
import ErrorState from '@/components/error-state';
import LoadingState from '@/components/loading-state';
import GeneratedAvatar from '@/components/generated-avatar';
import UpdateAgentDialog from '../components/update-agent-dialog';
import AgentIdViewHeader from '../components/agent-id-view-header';

interface Props {
  agentId: string;
}

const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );

        router.push('/agents');
      },

      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    'Are your sure?',
    `The following action will remove ${data.meetingCount} associated meetings`
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    removeAgent.mutate({ id: agentId });
  };

  const handleUpdateAgent = () => {
    setUpdateAgentDialogOpen(true);
  };

  return (
    <>
      <RemoveConfirmation />

      <UpdateAgentDialog
        initialValues={data}
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
      />

      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={handleUpdateAgent}
          onRemove={handleRemoveAgent}
        />

        <div className="bg-white rounded-lg border">
          <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
            <div className="flex items-center gap-x-3">
              <GeneratedAvatar
                seed={data.name}
                className="size-10"
                variant="botttsNeutral"
              />

              <h2 className="text-2xl font-medium">{data.name}</h2>
            </div>

            <Badge
              variant="outline"
              className="flex items-center gap-x-2 [&>svg]:size-4"
            >
              <VideoIcon className="text-blue-700" />
              {data.meetingCount}
              {data.meetingCount === 1 ? 'meeting' : 'mettings'}
            </Badge>

            <div className="flex flex-col gap-y-4">
              <p className="text-lg font-medium">Instructions</p>
              <p className="text-neutral-800">{data.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentIdView;

export const AgentIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agent"
      description="This may take a few seconds..."
    />
  );
};

export const AgentIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agent"
      description="Something went wrong"
    />
  );
};
