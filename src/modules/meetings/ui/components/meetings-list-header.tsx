'use client';

import { useState } from 'react';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import NewMeetingDialog from './new-meeting-dialog';

const MeetingsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
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

        <div className="flex items-center gap-x-2 p-1">TODO: Filters</div>
      </div>
    </>
  );
};

export default MeetingsListHeader;
