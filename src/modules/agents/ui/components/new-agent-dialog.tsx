import AgentForm from './agent-form';
import ResponsiveDialog from '@/components/responsive-dialig';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewAgentDialog = ({ onOpenChange, open }: Props) => {
  const handleCloseDialog = () => {
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      title="New Agent"
      onOpenChange={onOpenChange}
      description="Create a new agent"
    >
      <AgentForm onSuccess={handleCloseDialog} onCancle={handleCloseDialog} />
    </ResponsiveDialog>
  );
};

export default NewAgentDialog;
