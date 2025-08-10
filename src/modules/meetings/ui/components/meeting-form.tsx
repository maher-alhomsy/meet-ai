import { useState } from 'react';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/components/ui/form';
import { useTRPC } from '@/trpc/client';
import { MeetingGetOne } from '../../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { meetingsInsertSchema } from '../../schemas';
import CommandSelect from '@/components/command-select';
import GeneratedAvatar from '@/components/generated-avatar';
import NewAgentDialog from '@/modules/agents/ui/components/new-agent-dialog';

interface Props {
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
  onSuccess?: (id?: string) => void;
}

const MeetingForm = ({ initialValues, onCancel, onSuccess }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [agentSearch, setAgentSearch] = useState('');
  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({ pageSize: 100, search: agentSearch })
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },

      onSuccess: async ({ id }) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );

        onSuccess?.(id);
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id })
          );
        }

        onSuccess?.();
      },
    })
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      agentId: initialValues?.agentId ?? '',
      // instructions: initialValues?.instructions ?? '',
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({ ...values, id: initialValues.id });
    } else {
      createMeeting.mutate(values);
    }
  };

  function handleOpenAgentDialog() {
    setOpenNewAgentDialog(true);
  }

  return (
    <>
      <NewAgentDialog
        open={openNewAgentDialog}
        onOpenChange={setOpenNewAgentDialog}
      />

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Math Consultations" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents.data?.items ?? []).map((ag) => ({
                      id: ag.id,
                      value: ag.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GeneratedAvatar
                            seed={ag.name}
                            variant="botttsNeutral"
                            className="border size-6"
                          />
                          <span>{ag.name}</span>
                        </div>
                      ),
                    }))}
                    value={field.value}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    placeholdre="Select an agent"
                  />
                </FormControl>

                <FormDescription>
                  Not found what you&apos;re looking for{' '}
                  <button
                    type="button"
                    onClick={handleOpenAgentDialog}
                    className="text-primary hover:underline"
                  >
                    Create new agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
            )}

            <Button disabled={isPending} type="submit">
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default MeetingForm;
