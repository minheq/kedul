import { ActorType, RequestContext } from '@kedul/common-server';

import { makeClientRepository } from './ClientRepository';
import { unauthorized } from './unauthorized';

export const authorizeClient = async (
  clientId: string,
  context: RequestContext,
) => {
  const clientRepository = makeClientRepository(context);

  if (!context.actor) {
    unauthorized();
    return;
  }

  if (context.actor.type !== ActorType.USER) {
    unauthorized();
    return;
  }

  const found = await clientRepository.findByIdAndUserId(
    clientId,
    context.actor.userId,
  );

  if (!found) unauthorized();
};
