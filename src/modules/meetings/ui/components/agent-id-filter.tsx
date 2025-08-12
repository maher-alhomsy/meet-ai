import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';
import CommandSelect from '@/components/command-select';
import GeneratedAvatar from '@/components/generated-avatar';
import useMeetingsFilters from '../../hooks/use-meetings-filters';

const AgentIdFilter = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useMeetingsFilters();
  const [agentSearch, setAgentSearch] = useState('');

  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  );

  return (
    <CommandSelect
      className="h-9"
      placeholdre="agent"
      onSearch={setAgentSearch}
      value={filters.agentId ?? ''}
      onSelect={(value) => setFilters({ agentId: value })}
      options={(data?.items || []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              seed={agent.name}
              className="size-4"
              variant="botttsNeutral"
            />
            {agent.name}
          </div>
        ),
      }))}
    />
  );
};

export default AgentIdFilter;
