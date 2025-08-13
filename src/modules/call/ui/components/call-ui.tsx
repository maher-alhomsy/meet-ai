import { useState } from 'react';

import { StreamTheme, useCall } from '@stream-io/video-react-sdk';

import CallLobby from './call-lobby';
import CallEnded from './call-ended';
import CallActive from './call-active';

interface Props {
  meetingName: string;
}

type Show = 'lobby' | 'call' | 'ended';

const CallUI = ({ meetingName }: Props) => {
  const call = useCall();
  const [show, setShow] = useState<Show>('lobby');

  const handleJoin = async () => {
    if (!call) return;

    await call.join();
    setShow('call');
  };

  const handleLeave = () => {
    if (!call) return;

    call.endCall();
    setShow('ended');
  };

  return (
    <StreamTheme className="h-full">
      {show === 'ended' && <CallEnded />}
      {show === 'lobby' && <CallLobby onJoin={handleJoin} />}

      {show === 'call' && (
        <CallActive meetingName={meetingName} onLeave={handleLeave} />
      )}
    </StreamTheme>
  );
};

export default CallUI;
