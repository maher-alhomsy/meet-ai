import { useState, JSX } from 'react';

import { Button } from '@/components/ui/button';
import ResponsiveDialog from '@/components/responsive-dialig';

interface IPromise {
  resolve: (value: boolean) => void;
}
type Return = [() => JSX.Element, () => Promise<unknown>];

export const useConfirm = (title: string, description: string): Return => {
  const [promise, setPromise] = useState<IPromise | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const hanldeCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ResponsiveDialog
      title={title}
      open={promise !== null}
      description={description}
      onOpenChange={handleClose}
    >
      <div className="pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
        <Button
          onClick={hanldeCancel}
          variant="outline"
          className="w-full lg:w-auto"
        >
          Cancel
        </Button>

        <Button onClick={handleConfirm} className="w-full lg:w-auto">
          Confirm
        </Button>
      </div>
    </ResponsiveDialog>
  );

  return [ConfirmationDialog, confirm];
};
