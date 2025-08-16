import { inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '@/trpc/routers/_app';

export type MeetingGetOne = inferRouterOutputs<AppRouter>['meetings']['getOne'];
export type MeetingsGetMany =
  inferRouterOutputs<AppRouter>['meetings']['getMany']['items'];

export enum MeetingStatus {
  Upcoming = 'upcoming',
  Active = 'active',
  Completed = 'completed',
  Processing = 'processing',
  Cancelled = 'cancelled',
}

export type StreamTranscriptItem = {
  type: string;
  text: string;
  stop_ts: number;
  start_ts: number;
  speaker_id: string;
};
