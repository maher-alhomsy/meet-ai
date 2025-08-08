import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { useTRPC } from '@/trpc/client';
import { Input } from '@/components/ui/input';
import type { AgentGetOne } from '../../types';
import { Button } from '@/components/ui/button';
import { agentsInsertSchema } from '../../schemas';
import { Textarea } from '@/components/ui/textarea';
import GeneratedAvatar from '@/components/generated-avatar';

interface Props {
  onCancle?: () => void;
  onSuccess?: () => void;
  initialValues?: AgentGetOne;
}

const AgentForm = ({ initialValues, onCancle, onSuccess }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );

        onSuccess?.();
      },
    })
  );

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id })
          );
        }

        onSuccess?.();
      },
    })
  );

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      instructions: initialValues?.instructions ?? '',
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending || updateAgent.isPending;

  const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
    if (isEdit) {
      updateAgent.mutate({ ...values, id: initialValues.id });
    } else {
      createAgent.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <GeneratedAvatar
          seed={form.watch('name')}
          variant="botttsNeutral"
          className="border size-16"
        />

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Math tutor" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="You are a helpful assistant that can answer questions and help with assignments."
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-x-2">
          {onCancle && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancle}
              disabled={isPending}
            >
              Cancle
            </Button>
          )}

          <Button disabled={isPending} type="submit">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AgentForm;
