import faker from 'faker';

import { makeE2E } from './utils/WebE2E';

const { screen, utils, setup, teardown, auth } = makeE2E({});

const invitedUserPhoneNumber = utils.makePhoneNumber();

beforeAll(async () => {
  await setup();
  await auth.initSession();
});

describe('Sending invitation to employee', () => {
  test('Go to ManageEmployeeList', async () => {
    await screen.navigate('ManageEmployeeList');
  });

  test('Press add employee', async () => {
    await screen.press('ADD_EMPLOYEE');
  });

  test('Type employee name', async () => {
    await screen.input('FULL_NAME_INPUT', faker.name.firstName());
  });

  test('Submit employee', async () => {
    await screen.press('SAVE');
  });

  test('Press add contact details', async () => {
    await screen.press('ADD_EMPLOYEE_CONTACT_DETAILS');
    await utils.wait(200);
  });

  test('Type user phone number', async () => {
    await screen.input('PHONE_NUMBER_INPUT', invitedUserPhoneNumber);
  });

  test('Check send invite', async () => {
    await screen.press('SEND_INVITE_CHECK');
  });

  test('Press save', async () => {
    await screen.press('SAVE');
    await utils.wait(200);
  });

  test('Press back', async () => {
    await screen.press('BACK');
  });

  test('Go to ProfileMenu', async () => {
    await screen.press('PROFILE_NAVIGATION_TAB');
  });

  test('Log out', async () => {
    await screen.press('LOG_OUT');
  });
});

describe('Accepting employee invitation', () => {
  test('Type phone number', async () => {
    await screen.input('PHONE_NUMBER_INPUT', invitedUserPhoneNumber);
  });

  test('Submit phone number', async () => {
    await screen.press('CONTINUE');
  });

  test('Type login code', async () => {
    await utils.wait(200);
    const phoneVerificationCode = await auth.findLatestPhoneVerificationCode();
    await screen.input('ONE_TIME_CODE_INPUT', phoneVerificationCode.code);
  });

  test('Submit login code', async () => {
    await screen.press('VERIFY');
  });

  test('Accept invitation', async () => {
    await utils.wait(200);
    await screen.press('ACCEPT');
  });

  test('Sees CalendarOverview', async () => {
    const screeName = await screen.current();
    expect(screeName).toBe('CalendarOverview');
  });
});

afterAll(async () => {
  await teardown();
});
