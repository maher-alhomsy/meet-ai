'use client';

import { useState } from 'react';

import { PlusIcon, XCircleIcon } from 'lucide-react';

import StatusFilter from './status-filter';
import { DEFAULT_PAGE } from '@/constants';
import AgentIdFilter from './agent-id-filter';
import { Button } from '@/components/ui/button';
import NewMeetingDialog from './new-meeting-dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import MeetingsSearchFilter from './meetings-search-filter';
import useMeetingsFilters from '../../hooks/use-meetings-filters';

const MeetingsListHeader = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModifies =
    !!filters.status || !!filters.search || !!filters.agentId;

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      agentId: '',
      status: null,
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Meetings</h5>

          <Button onClick={handleOpenDialog}>
            <PlusIcon /> New Meeting
          </Button>
        </div>

        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />

            {isAnyFilterModifies && (
              <Button variant="outline" onClick={handleClearFilters}>
                <XCircleIcon /> Clear
              </Button>
            )}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};

export default MeetingsListHeader;
