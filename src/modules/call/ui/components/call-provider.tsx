'use client';

import { LoaderIcon } from 'lucide-react';

import CallConnect from './call-connect';
import { authClient } from '@/lib/auth-client';
import { generateAvatarUri } from '@/lib/avatar';

interface Props {
  meetingId: string;
  meetingName: string;
}

const CallProvider = ({ meetingId, meetingName }: Props) => {
  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 text-white animate-spin" />
      </div>
    );
  }

  return (
    <CallConnect
      meetingId={meetingId}
      userId={data.user.id}
      meetingName={meetingName}
      userName={data.user.name}
      userImage={
        data.user.image ??
        generateAvatarUri({ seed: data.user.name, variant: 'initials' })
      }
    />
  );
};

export default CallProvider;
