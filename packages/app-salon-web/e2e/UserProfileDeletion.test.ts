import { makeE2E } from './utils/WebE2E';

const { screen, utils, setup, teardown, auth } = makeE2E({});

beforeAll(async () => {
  await setup();
  await auth.initSession();
});

describe('Delete location', () => {
  test('Go to ProfileMenu', async () => {
    await screen.navigate('ProfileMenu');
  });

  test('Press CurrentLocation link', async () => {
    await screen.press('LOCATION_SETTINGS');
  });

  test('Navigate to LocationSettingsGeneral', async () => {
    await screen.press('LOCATION_SETTINGS_GENERAL');
  });

  test('Press delete and confirm', async () => {
    await screen.press('DELETE_LOCATION');
    await screen.press('CONFIRM');
  });

  test('Sees Select location on ProfileMenu', async () => {
    const component = await screen.findOne('SELECT_LOCATION');

    expect(component).toBeTruthy();
  });
});

describe('Delete business', () => {
  test('Press CurrentBusiness link', async () => {
    await screen.press('BUSINESS_SETTINGS');
  });

  test('Navigate to LocationSettingsGeneral', async () => {
    await screen.press('BUSINESS_SETTINGS_GENERAL');
  });

  test('Press delete and confirm', async () => {
    await screen.press('DELETE_BUSINESS');
    await screen.press('CONFIRM');
  });

  test('Sees Select business on ProfileMenu', async () => {
    const component = await screen.findOne('SELECT_BUSINESS');

    expect(component).toBeTruthy();
  });
});

describe('Deactivate account', () => {
  test('Press account settings general', async () => {
    await utils.wait(200);
    await screen.press('USER_ACCOUNT_SETTINGS_GENERAL');
  });

  test('Press delete and confirm', async () => {
    await screen.press('DEACTIVATE_ACCOUNT');
    await screen.press('CONFIRM');
  });

  test('Gets redirected to Login', async () => {
    const current = await screen.current();

    expect(current).toBe('Login');
  });
});

afterAll(async () => {
  await teardown();
});
