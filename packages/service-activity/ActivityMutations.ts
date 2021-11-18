import { EventData, RequestContext } from '@kedul/common-server';
import uuidv4 from 'uuid/v4';

import { Activity } from './ActivityTypes';
import { enhance } from './RequestContext';

const make = async (input: EventData): Promise<Activity> => {
  return {
    ...input,
    id: uuidv4(),
    createdAt: new Date(),
  };
};

export const createActivity = async (
  input: EventData,
  context: RequestContext,
) => {
  const { activityRepository } = enhance(context).repositories;

  const activity = await make(input);

  return activityRepository.save(activity);
};
