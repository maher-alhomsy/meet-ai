import { useState, useEffect } from 'react';

import {
  Chat,
  Thread,
  Window,
  Channel,
  MessageList,
  MessageInput,
  useCreateChatClient,
} from 'stream-chat-react';
import { useMutation } from '@tanstack/react-query';
import type { Channel as StreamChannel } from 'stream-chat';

import { useTRPC } from '@/trpc/client';
import LoadingState from '@/components/loading-state';

import 'stream-chat-react/dist/css/v2/index.css';

interface Props {
  userId: string;
  userName: string;
  meetingId: string;
  meetingName: string;
  userImage: string | undefined;
}

const ChatUI = ({
  userId,
  userName,
  userImage,
  meetingId,
  meetingName,
}: Props) => {
  const trpc = useTRPC();
  const [channel, setChannel] = useState<StreamChannel>();

  const { mutateAsync: generateChatToken } = useMutation(
    trpc.meetings.generateChatToken.mutationOptions()
  );

  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KET!,
    tokenOrProvider: generateChatToken,
    userData: {
      id: userId,
      name: userName,
      image: userImage,
    },
  });

  useEffect(() => {
    if (!client) return;

    const channel = client.channel('messaging', meetingId, {
      members: [userId],
    });

    setChannel(channel);
  }, [client, meetingId, meetingName, userId]);

  if (!client) {
    return (
      <LoadingState
        title="Loading State"
        description="This may take a few seconds"
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Chat client={client}>
        <Channel channel={channel}>
          <Window>
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
              <MessageList />
            </div>

            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatUI;
