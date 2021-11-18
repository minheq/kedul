import { RequestContext } from '@kedul/common-server';

export interface ClientRepository {
  findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<{ id: string; userId: string } | null>;
}

const findByIdAndUserId = (context: RequestContext) => async (
  id: string,
  userId: string,
) => {
  const { knex } = context.dependencies;

  return knex
    .select()
    .where({ id, userId })
    .from('CLIENT')
    .first();
};

export const makeClientRepository = (
  context: RequestContext,
): ClientRepository => ({
  findByIdAndUserId: findByIdAndUserId(context),
});
