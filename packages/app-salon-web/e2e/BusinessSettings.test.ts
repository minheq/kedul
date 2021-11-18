import { makeE2E } from './utils/WebE2E';

const { screen, utils, setup, teardown, auth } = makeE2E({});

beforeAll(async () => {
  await setup();
  await auth.initSession();
});

describe('Edit current business profile', () => {
  const newBusinessName = utils.randomString();

  test('Go to ProfileMenu', async () => {
    await screen.navigate('ProfileMenu');
  });

  test('Press CurrentBusiness link', async () => {
    await screen.press('BUSINESS_SETTINGS');
  });

  test('Press view profile', async () => {
    await screen.press('VIEW_PROFILE');
  });

  test('Press edit profile', async () => {
    await screen.press('EDIT_BUSINESS_PROFILE');
    await utils.wait(100);
  });

  test('Update name', async () => {
    await screen.clearInput('BUSINESS_NAME_INPUT');
    await screen.input('BUSINESS_NAME_INPUT', newBusinessName);
  });

  test('Press Save', async () => {
    await screen.press('SAVE');
    await utils.wait(100);
  });

  test('Sees updated profile on BusinessProfile', async () => {
    const component = await screen.findOne('AVATAR_PROFILE');
    const visibleFullName = await component.getText();

    expect(visibleFullName.includes(newBusinessName)).toBeTruthy();
  });

  test('Sees updated profile on BusinessSettings', async () => {
    await screen.press('BACK');
    const component = await screen.findOne('AVATAR_PROFILE');
    const visibleFullName = await component.getText();

    expect(visibleFullName.includes(newBusinessName)).toBeTruthy();
  });

  test('Sees updated profile on ProfileMenu', async () => {
    await screen.press('BACK');
    await screen.press('BACK');
    const component = await screen.findOne('BUSINESS_SETTINGS');

    const visibleBusinessName = await component.getText();

    expect(visibleBusinessName.includes(newBusinessName)).toBeTruthy();
  });
});

afterAll(async () => {
  await teardown();
});
