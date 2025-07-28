import { z } from 'zod';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { agents } from '@/db/schema';
import { agentsInsertSchema } from '../schemas';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
// import { TRPCError } from '@trpc/server';

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.id));

      // throw new TRPCError({ code: 'BAD_REQUEST' });
      // await new Promise((res) => setTimeout(res, 5000));

      return existingAgent;
    }),

  getMany: protectedProcedure.query(async () => {
    const data = await db.select().from(agents);

    // throw new TRPCError({ code: 'BAD_REQUEST' });
    // await new Promise((res) => setTimeout(res, 5000));

    return data;
  }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({ ...input, userId: ctx.auth.user.id })
        .returning();

      return createdAgent;
    }),
});
