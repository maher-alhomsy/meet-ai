import AgentForm from './agent-form';
import type { AgentGetOne } from '../../types';
import ResponsiveDialog from '@/components/responsive-dialig';

interface Props {
  open: boolean;
  initialValues: AgentGetOne;
  onOpenChange: (open: boolean) => void;
}

const UpdateAgentDialog = ({ onOpenChange, open, initialValues }: Props) => {
  const handleCloseDialog = () => {
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      title="Edit Agent"
      onOpenChange={onOpenChange}
      description="Edit the agent details"
    >
      <AgentForm
        onCancle={handleCloseDialog}
        onSuccess={handleCloseDialog}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
};

export default UpdateAgentDialog;
