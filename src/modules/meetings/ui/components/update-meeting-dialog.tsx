import MeetingForm from './meeting-form';
import type { MeetingGetOne } from '../../types';
import ResponsiveDialog from '@/components/responsive-dialig';

interface Props {
  open: boolean;
  initialValues: MeetingGetOne;
  onOpenChange: (open: boolean) => void;
}

const UpdateMeetingDialog = ({ onOpenChange, open, initialValues }: Props) => {
  function handleCloseDialog() {
    onOpenChange(false);
  }

  return (
    <ResponsiveDialog
      open={open}
      title="Edit Meeting"
      onOpenChange={onOpenChange}
      description="Edit the meeting details"
    >
      <MeetingForm
        onCancel={handleCloseDialog}
        onSuccess={handleCloseDialog}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
};

export default UpdateMeetingDialog;
