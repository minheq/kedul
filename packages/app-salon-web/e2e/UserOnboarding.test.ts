import faker from 'faker';

import { makeE2E } from './utils/WebE2E';

const { screen, utils, setup, teardown, auth } = makeE2E({});

beforeAll(async () => {
  await setup();
});

test('Go to Login e2e', async () => {
  await screen.navigate('Login');
});

test('Input phone number', async () => {
  await screen.input('PHONE_NUMBER_INPUT', utils.makePhoneNumber());
});

test('Submit phone number', async () => {
  await screen.press('CONTINUE');
});

test('Input login code', async () => {
  await utils.wait(100);
  const phoneVerificationCode = await auth.findLatestPhoneVerificationCode();
  await screen.input('ONE_TIME_CODE_INPUT', phoneVerificationCode.code);
});

test('Submit login code', async () => {
  await screen.press('VERIFY');
});

test('Input business name', async () => {
  await screen.input('BUSINESS_NAME_INPUT', utils.randomString());
});

test('Submit business creation form', async () => {
  await screen.press('SAVE');
});

test('Input location name', async () => {
  await screen.input('LOCATION_NAME_INPUT', faker.address.streetAddress());
});

test('Submit location creation form', async () => {
  await screen.press('NEXT');
});

test('Skip location setup', async () => {
  await utils.wait(200);
  await screen.press('NEXT');
});

test('See CalendarOverview screen', async () => {
  const screenName = await screen.current();
  expect(screenName).toBe('CalendarOverview');
});

afterAll(async () => {
  await teardown();
});
