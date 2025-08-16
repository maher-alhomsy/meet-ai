'use client';

import {
  LoaderIcon,
  CircleXIcon,
  ClockFadingIcon,
  CircleCheckIcon,
  ClockArrowUpIcon,
  CornerDownRightIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { cn, formatDuration } from '@/lib/utils';
import type { MeetingsGetMany } from '../../types';
import GeneratedAvatar from '@/components/generated-avatar';

const statusIconMap = {
  active: LoaderIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
  upcoming: ClockArrowUpIcon,
  completed: CircleCheckIcon,
};

const statusColorMap = {
  active: 'bg-blue-500/20 text-blue-800 border-blue-800/5',
  cancelled: 'bg-rose-500/20 text-rose-800 border-rose-800/5',
  processing: 'bg-gray-300/20 text-gray-800 border-gray-800/5',
  upcoming: 'bg-yellow-500/20 text-yellow-800 border-yellow-800/5',
  completed: 'bg-emerald-500/20 text-emerald-800 border-emerald-800/5',
};

export const columns: ColumnDef<MeetingsGetMany[number]>[] = [
  {
    accessorKey: 'name',
    header: 'Meeting Name',
    cell: ({ row: { original } }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-semibold capitalize">{original.name}</span>

        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
            <CornerDownRightIcon className="size-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
              {original.agent.name}
            </span>
          </div>

          <GeneratedAvatar
            className="size-4"
            variant="botttsNeutral"
            seed={original.agent.name}
          />

          <span className="text-sm text-muted-foreground">
            {original.startedAt ? format(original.startedAt, 'MMM d') : ''}
          </span>
        </div>
      </div>
    ),
  },

  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row: { original } }) => {
      const Icon = statusIconMap[original.status as keyof typeof statusIconMap];

      return (
        <Badge
          variant="outline"
          className={cn(
            'capitalize [&>svg]:size-4 text-muted-foreground',
            statusColorMap[original.status as keyof typeof statusColorMap]
          )}
        >
          <Icon
            className={cn(original.status === 'processing' && 'animate-spin')}
          />

          {original.status}
        </Badge>
      );
    },
  },

  {
    header: 'duration',
    accessorKey: 'duration',
    cell: ({ row: { original } }) => (
      <Badge
        variant="outline"
        className="capitalize [&>svg]:size-4 flex items-center gap-x-2"
      >
        <ClockFadingIcon className="text-blue-700" />
        {original.duration ? formatDuration(original.duration) : 'No duration'}
      </Badge>
    ),
  },
];
