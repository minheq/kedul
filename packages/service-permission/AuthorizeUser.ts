import { ActorType, RequestContext } from '@kedul/common-server';

export const authorizeUser = async (
  userId: string,
  context: RequestContext,
) => {
  if (!context.actor) {
    throw new Error('Unauthenticated');
  }

  if (context.actor.type !== ActorType.USER) {
    throw new Error('Unauthorized, auth context is not a user');
  }

  if (userId === context.actor.userId) return;

  throw new Error(
    `Unauthorized access to user account id ${userId}. Context user account id is ${
      context.actor.userId
    }`,
  );
};
