import { Dispatch, SetStateAction, useState } from 'react';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import {
  CommandItem,
  CommandList,
  CommandInput,
  CommandResponsiveDialog,
  CommandGroup,
  CommandEmpty,
} from '@/components/ui/command';
import { useTRPC } from '@/trpc/client';
import GeneratedAvatar from '@/components/generated-avatar';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const DashboardCommand = ({ open, setOpen }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const meetings = useQuery(
    trpc.meetings.getMany.queryOptions({ search, pageSize: 100 })
  );

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({ search, pageSize: 100 })
  );

  function handleValueChange(value: string) {
    setSearch(value);
  }

  return (
    <CommandResponsiveDialog
      open={open}
      shouldFilter={false}
      onOpenChange={setOpen}
    >
      <CommandInput
        value={search}
        onValueChange={handleValueChange}
        placeholder="Find a meeting or agent..."
      />

      <CommandList>
        <CommandGroup heading="Meetings">
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No meetings found
            </span>
          </CommandEmpty>

          {meetings.data?.items.map(({ name, id }) => (
            <CommandItem
              key={id}
              onSelect={() => {
                router.push(`/meetings/${id}`);
                setOpen(false);
              }}
            >
              {name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Agents">
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No agents found
            </span>
          </CommandEmpty>

          {agents.data?.items.map(({ name, id }) => (
            <CommandItem
              key={id}
              onSelect={() => {
                router.push(`/agents/${id}`);
                setOpen(false);
              }}
            >
              <GeneratedAvatar seed={name} variant="botttsNeutral" />
              {name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  );
};

export default DashboardCommand;
