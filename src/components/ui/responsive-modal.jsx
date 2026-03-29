'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-media-query';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

const ResponsiveModalContext = React.createContext(null);

function useContext() {
  const context = React.useContext(ResponsiveModalContext);
  if (!context) {
    throw new Error('Trigger or Content must be used within <ResponsiveModal>');
  }
  return context;
}

function ResponsiveModal({ open, onOpenChange, defaultOpen, children, dialogProps, drawerProps }) {
  const isMobile = useIsMobile();
  const Component = isMobile ? Drawer : Dialog;
  const props = isMobile ? drawerProps : dialogProps;

  return (
    <ResponsiveModalContext.Provider value={{ isMobile }}>
      <Component open={open} onOpenChange={onOpenChange} {...props}>
        {children}
      </Component>
    </ResponsiveModalContext.Provider>
  );
}

function ResponsiveModalTrigger({ className, children, asChild, drawerProps, popoverProps }) {
  const { isMobile } = useContext();
  const Component = isMobile ? DrawerTrigger : DialogTrigger;
  const props = isMobile ? drawerProps : popoverProps;

  return (
    <Component className={className} asChild={asChild} {...props}>
      {children}
    </Component>
  );
}

function ResponsiveModalClose({ className, children, asChild, drawerProps, popoverProps }) {
  const { isMobile } = useContext();
  const Component = isMobile ? DrawerClose : DialogClose;
  const props = isMobile ? drawerProps : popoverProps;

  return (
    <Component className={className} asChild={asChild} {...props}>
      {children}
    </Component>
  );
}

function ResponsiveModalContent({ children, className, drawerProps, popoverProps }) {
  const { isMobile } = useContext();
  const Component = isMobile ? DrawerContent : DialogContent;
  const props = isMobile ? drawerProps : popoverProps;

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
}

function ResponsiveModalHeader({ className, ...props }) {
  const { isMobile } = useContext();
  const Component = isMobile ? DrawerHeader : DialogHeader;

  return <Component className={className} {...props} />;
}

function ResponsiveModalTitle({ className, children, drawerProps, popoverProps }) {
  const { isMobile } = useContext();
  const Component = isMobile ? DrawerTitle : DialogTitle;
  const props = isMobile ? drawerProps : popoverProps;

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
}

function ResponsiveModalDescription({ className, children, drawerProps, popoverProps }) {
  const { isMobile } = useContext();
  const Component = isMobile ? DrawerDescription : DialogDescription;
  const props = isMobile ? drawerProps : popoverProps;

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
}

function ResponsiveModalBody({ className, ...props }) {
  return <div className={cn('px-4 py-6', className)} {...props} />;
}

function ResponsiveModalFooter({ className, ...props }) {
  const { isMobile } = useContext();
  const Component = isMobile ? DrawerFooter : DialogFooter;
  return <Component className={className} {...props} />;
}

export {
  ResponsiveModal,
  ResponsiveModalTrigger,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalBody,
  ResponsiveModalFooter,
};
