import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import uuidv4 from 'uuid/v4';

import { RequestContext } from './Context';

const events = new EventEmitter({
  wildcard: true,
});

export interface EventData<TData = any> {
  data: TData;
  aggregateType: string;
  aggregateId: string;
  /** User Data, Tenant/Business Data */
  context: RequestContext;
}

export interface HandlerProps<TData = any> extends EventData<TData> {
  eventId: string;
  eventName: string;
  createdAt: Date;
}

export const subscribe = <TData = any>(
  eventName: string,
  handler: (eventData: HandlerProps<TData>) => void,
) => {
  events.on(eventName, handler);
};

export const publish = <TData = any>(
  eventName: string,
  eventData: EventData<TData>,
) => {
  const { context, aggregateId, aggregateType } = eventData;
  const { logger } = context.dependencies;

  const handlerProps: HandlerProps<TData> = {
    ...eventData,
    createdAt: new Date(),
    eventId: uuidv4(),
    eventName,
  };

  logger.info(`EVENT:${eventName}`, {
    entity: aggregateType,
    id: aggregateId,
  });

  events.emit(eventName, handlerProps);
};
