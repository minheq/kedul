import {
  EventData,
  RequestContext,
  upholdDataLoaderConstraints,
} from '@kedul/common-server';

import { Activity } from './ActivityTypes';
import { Table } from './Database';

export interface ActivityRepository {
  save(activity: any): Promise<void>;
  findManyByIds(ids: string[]): Promise<(Activity | null)[]>;
}

const fromEntity = (context: RequestContext) => (event: EventData) => {
  return event;
};

const save = (context: RequestContext) => async (activity: any) => {
  const { knex } = context.dependencies;

  await knex.insert(fromEntity(context)(activity)).into(Table.ACTIVITY);
};

const findManyByIds = (context: RequestContext) => async (ids: string[]) => {
  const { knex } = context.dependencies;

  const activities = await knex
    .select()
    .whereIn('id', ids)
    .from(Table.ACTIVITY);

  return upholdDataLoaderConstraints(activities, ids);
};

export const makeActivityRepository = (
  context: RequestContext,
): ActivityRepository => ({
  save: save(context),
  findManyByIds: findManyByIds(context),
});
