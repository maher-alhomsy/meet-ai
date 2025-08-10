'use client';
import { useState } from 'react';

import { ChevronsUpDownIcon } from 'lucide-react';

import {
  CommandItem,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandResponsiveDialog,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: React.ReactNode;
  }>;
  value: string;
  className?: string;
  placeholdre?: string;
  isSearchable?: boolean;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
}

const CommandSelect = ({
  value,
  options,
  onSelect,
  onSearch,
  className,
  placeholdre = 'Select an option',
}: Props) => {
  const [open, setOpen] = useState(false);
  console.log(value);

  const selectedOption = options.find((op) => op.value === value);

  function handleSelect(value: string) {
    onSelect(value);
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleOpen}
        className={cn(
          'h-9 justify-between font-normal px-2',
          !selectedOption && 'text-muted-foreground',
          className
        )}
      >
        <div>{selectedOption?.children ?? placeholdre}</div>

        <ChevronsUpDownIcon />
      </Button>

      <CommandResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={!onSearch}
      >
        <CommandInput placeholder="Search ..." onValueChange={onSearch} />
        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No Options Found
            </span>
          </CommandEmpty>

          {options.map((op) => (
            <CommandItem key={op.id} onSelect={() => handleSelect(op.id)}>
              {op.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};

export default CommandSelect;
