import { eq, like } from "drizzle-orm"
import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { ingredients } from "@/server/db/schema"

export const ingredientRouter = createTRPCRouter({
  insert: protectedProcedure
    .input(
      z.object({ name: z.string().min(1), calories: z.number().nonnegative() }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(ingredients).values({
        name: input.name,
        calories: input.calories,
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        calories: z.number().nonnegative(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(ingredients)
        .set({
          name: input.name,
          calories: input.calories,
        })
        .where(eq(ingredients.id, input.id))
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(ingredients).where(eq(ingredients.id, input.id))
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.ingredients.findMany()
  }),

  search: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.ingredients.findMany({
        where: like(ingredients.name, `%${input.name}%`),
        orderBy: (ingredients, { desc }) => [desc(ingredients.updatedAt)],
      })
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.ingredients.findFirst({
      orderBy: (ingredients, { desc }) => [desc(ingredients.updatedAt)],
    })
  }),
})