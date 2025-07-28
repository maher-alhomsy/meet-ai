'use client';

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerTitle,
  DrawerHeader,
  DrawerContent,
  DrawerDescription,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
  title: string;
  open: boolean;
  description: string;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
}

const ResponsiveDialog = ({
  children,
  description,
  onOpenChange,
  open,
  title,
}: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>

          <div className="p-4">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveDialog;
