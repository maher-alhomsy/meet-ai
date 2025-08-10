import ResponsiveDialog from '@/components/responsive-dialig';
import MeetingForm from './meeting-form';
import { useRouter } from 'next/navigation';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewMeetingDialog = ({ onOpenChange, open }: Props) => {
  const router = useRouter();

  function handleSuccess(id?: string) {
    onOpenChange(false);
    router.push(`/meetings/${id}`);
  }

  function handleCancel() {
    onOpenChange(false);
  }

  return (
    <ResponsiveDialog
      open={open}
      title="New Meeting"
      onOpenChange={onOpenChange}
      description="Create a new meeting"
    >
      <MeetingForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </ResponsiveDialog>
  );
};

export default NewMeetingDialog;
