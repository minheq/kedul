import { filterAsync } from '@kedul/common-utils';

import { makeE2E } from './utils/WebE2E';

const { screen, utils, setup, teardown, auth } = makeE2E({});

beforeAll(async () => {
  await setup();
  await auth.initSession();
});

describe('Create new business B and change to it', () => {
  let newBusinessName = utils.randomString();

  test('Go to ProfileMenu', async () => {
    await screen.navigate('ProfileMenu');
  });

  test('Press change business', async () => {
    await screen.press('CHANGE_BUSINESS');
    await utils.wait(200);
  });

  test('Press create new business', async () => {
    await screen.press('CREATE_NEW_BUSINESS');
    await utils.wait(200);
  });

  test('Input business name', async () => {
    await screen.input('BUSINESS_NAME_INPUT', newBusinessName);
  });

  test('Press save', async () => {
    await screen.press('SAVE');
    await utils.wait(200);
  });

  test('Select alternative business', async () => {
    const businessListItems = await screen.findMany('BUSINESS_LIST_ITEM');
    const newBusinessListItem = (await filterAsync(
      businessListItems,
      async comp => {
        const text = await comp.getText();

        return text.includes(newBusinessName);
      },
    ))[0];

    await newBusinessListItem.press();
    await utils.wait(200);
  });

  test('See current business and location to be the newly created ones', async () => {
    const businessSettingsLink = await screen.findOne('BUSINESS_SETTINGS');
    const businessName = await businessSettingsLink.getText();

    expect(businessName.includes(newBusinessName)).toBeTruthy();
  });
});

describe('Create new location and change to it', () => {
  let newLocationName = utils.randomString();

  test('Press change location', async () => {
    await utils.wait(300);
    await screen.press('SELECT_LOCATION');
    await utils.wait(200);
  });

  test('Press create new location', async () => {
    await screen.press('CREATE_NEW_LOCATION');
    await utils.wait(200);
  });

  test('Input location name', async () => {
    await screen.input('LOCATION_NAME_INPUT', newLocationName);
  });

  test('Press save', async () => {
    await screen.press('SAVE');
    await utils.wait(200);
  });

  test('Select alternative location', async () => {
    const locationListItems = await screen.findMany('LOCATION_LIST_ITEM');
    const newBusinessListItem = (await filterAsync(
      locationListItems,
      async comp => {
        const text = await comp.getText();

        return text.includes(newLocationName);
      },
    ))[0];

    await newBusinessListItem.press();
    await utils.wait(200);
  });

  test('See current location and location to be the newly created ones', async () => {
    const locationSettingsLink = await screen.findOne('LOCATION_SETTINGS');
    const locationName = await locationSettingsLink.getText();

    expect(locationName.includes(newLocationName)).toBeTruthy();
  });
});

afterAll(async () => {
  await teardown();
});
