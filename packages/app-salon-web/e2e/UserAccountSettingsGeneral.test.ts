import { makeE2E } from './utils/WebE2E';

const { screen, utils, setup, teardown, auth } = makeE2E({});

beforeAll(async () => {
  await setup();
  await auth.initSession();
});

describe('Update user email address', () => {
  const newEmail = utils.makeEmail();

  test('Go to ProfileMenu', async () => {
    await screen.navigate('ProfileMenu');
  });

  test('Press account settings general', async () => {
    await screen.press('USER_ACCOUNT_SETTINGS_GENERAL');
  });

  test('Press update email', async () => {
    await screen.press('UPDATE_EMAIL');
    await utils.wait(200);
  });

  test('Input email', async () => {
    await screen.input('EMAIL_INPUT', newEmail);
  });

  test('Submit email', async () => {
    await screen.press('CONTINUE');
    await utils.wait(200);
  });

  test('Input login code', async () => {
    const emailVerificationCode = await auth.findLatestEmailVerificationCode();
    await screen.input('ONE_TIME_CODE_INPUT', emailVerificationCode.code);
  });

  test('Press save', async () => {
    await screen.press('SAVE');
  });

  test('Sees updated email', async () => {
    const emailSection = await screen.findOne('UPDATE_EMAIL');
    const emailText = await emailSection.getText();

    expect(emailText.includes(newEmail)).toBeTruthy();
  });
});

describe('Update user phone number', () => {
  const newPhoneNumber = utils.makePhoneNumber();

  test('Go to ProfileMenu', async () => {
    await screen.navigate('ProfileMenu');
  });

  test('Press account settings general', async () => {
    await screen.press('USER_ACCOUNT_SETTINGS_GENERAL');
  });

  test('Press update phone', async () => {
    await screen.press('UPDATE_PHONE_NUMBER');
    await utils.wait(200);
  });

  test('Input phone', async () => {
    await screen.clearInput('PHONE_NUMBER_INPUT');
    await screen.input('PHONE_NUMBER_INPUT', newPhoneNumber);
  });

  test('Submit phone', async () => {
    await screen.press('CONTINUE');
  });

  test('Input login code', async () => {
    await utils.wait(200);
    const phoneVerificationCode = await auth.findLatestPhoneVerificationCode();
    await screen.input('ONE_TIME_CODE_INPUT', phoneVerificationCode.code);
  });

  test('Press save', async () => {
    await screen.press('SAVE');
  });

  test('Sees updated phone', async () => {
    const phoneNumberSection = await screen.findOne('UPDATE_PHONE_NUMBER');
    const phoneNumberText = await phoneNumberSection.getText();

    expect(phoneNumberText.includes(newPhoneNumber)).toBeTruthy();
  });
});

afterAll(async () => {
  await teardown();
});
