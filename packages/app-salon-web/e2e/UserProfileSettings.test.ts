import { makeE2E } from './utils/WebE2E';

const { screen, utils, setup, teardown, auth } = makeE2E({});

beforeAll(async () => {
  await setup();
  await auth.initSession();
});

describe('Setup user profile', () => {
  const userFullName = utils.randomString();

  test('Go to ProfileMenu', async () => {
    await screen.navigate('ProfileMenu');
  });

  test('Press setup profile', async () => {
    await screen.press('USER_PROFILE_SETUP');
    await utils.wait(200);
  });

  test('Setup profile', async () => {
    await screen.input('FULL_NAME_INPUT', userFullName);
  });

  test('Press Save', async () => {
    await screen.press('SAVE');
    await utils.wait(200);
  });

  test('Sees his profile on ProfileMenu', async () => {
    const component = await screen.findOne('USER_PROFILE_VIEW');
    const visibleFullName = await component.getText();

    expect(visibleFullName.includes(userFullName)).toBeTruthy();
  });
});

describe('Edit user profile', () => {
  const newUserFullName = utils.randomString();

  test('Press profile', async () => {
    await screen.press('USER_PROFILE_VIEW');
    await utils.wait(200);
  });

  test('Press edit profile', async () => {
    await screen.press('EDIT_USER_PROFILE');
    await utils.wait(200);
  });

  test('Edit name', async () => {
    await screen.clearInput('FULL_NAME_INPUT');
    await screen.input('FULL_NAME_INPUT', newUserFullName);
  });

  test('Press Save', async () => {
    await screen.press('SAVE');
    await utils.wait(200);
  });

  test('Sees updated profile on UserProfile', async () => {
    const component = await screen.findOne('AVATAR_PROFILE');
    const visibleFullName = await component.getText();

    expect(visibleFullName.includes(newUserFullName)).toBeTruthy();
  });

  test('Sees updated profile on ProfileMenu', async () => {
    await screen.press('BACK');
    const component = await screen.findOne('USER_PROFILE_VIEW');
    const visibleFullName = await component.getText();

    expect(visibleFullName.includes(newUserFullName)).toBeTruthy();
  });
});

afterAll(async () => {
  await teardown();
});
