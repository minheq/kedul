import faker from 'faker';

import { makeE2E } from './utils/WebE2E';

const { screen, utils, setup, teardown, auth } = makeE2E({});

beforeAll(async () => {
  await setup();
  await auth.initSession();
});

describe('Setup current location profile', () => {
  const newLocationName = utils.randomString();
  const newAddress = {
    street: faker.address.streetAddress(),
    city: faker.address.city(),
    country: faker.address.country(),
  };
  const newContactDetails = {
    phoneNumber: faker.phone.phoneNumber(),
    email: faker.internet.email(),
  };

  test('Go to ProfileMenu', async () => {
    await screen.navigate('ProfileMenu');
  });

  test('Press CurrentLocation link', async () => {
    await screen.press('LOCATION_SETTINGS');
  });

  test('Press view profile', async () => {
    await screen.press('VIEW_PROFILE');
  });

  test('Press edit profile', async () => {
    await screen.press('EDIT_LOCATION_NAME');
    await utils.wait(100);
  });

  test('Update location name', async () => {
    await screen.clearInput('LOCATION_NAME_INPUT');
    await screen.input('LOCATION_NAME_INPUT', newLocationName);
  });

  test('Press Save', async () => {
    await screen.press('SAVE');
  });

  test('Sees updated profile on LocationProfile', async () => {
    const component = await screen.findOne('AVATAR_PROFILE');
    const visibleFullName = await component.getText();

    expect(visibleFullName.includes(newLocationName)).toBeTruthy();
  });

  test('Press add address', async () => {
    await utils.wait(100);
    await screen.press('ADD_LOCATION_ADDRESS');
    await utils.wait(100);
  });

  test('Add address fields', async () => {
    await screen.input('STREET_ADDRESS_LINE_1_INPUT', newAddress.street);
    await screen.input('CITY_INPUT', newAddress.city);
    await screen.input('COUNTRY_INPUT', newAddress.country);
  });

  test('Press Save', async () => {
    await screen.press('SAVE');
  });

  test('Sees updated address on LocationProfile', async () => {
    const component = await screen.findOne('ADDRESS_BASIC_INFORMATION');
    const visibleFullName = await component.getText();

    expect(visibleFullName.includes(newAddress.street)).toBeTruthy();
    expect(visibleFullName.includes(newAddress.city)).toBeTruthy();
    expect(visibleFullName.includes(newAddress.country)).toBeTruthy();
  });

  test('Press add contact details', async () => {
    await utils.wait(100);
    await screen.press('ADD_LOCATION_CONTACT_DETAILS');
    await utils.wait(100);
  });

  test('Add contact details fields', async () => {
    await screen.input('PHONE_NUMBER_INPUT', newContactDetails.phoneNumber);
    await screen.input('EMAIL_INPUT', newContactDetails.email);
  });

  test('Press Save', async () => {
    await screen.press('SAVE');
  });

  test('Sees updated contact details on LocationProfile', async () => {
    const component = await screen.findOne('CONTACT_DETAILS');
    const contactDetail = await component.getText();

    expect(contactDetail.includes(newContactDetails.email)).toBeTruthy();
    expect(contactDetail.includes(newContactDetails.phoneNumber)).toBeTruthy();
  });
});

describe('Edit current location address and contact details', () => {
  const newAddress = {
    street: faker.address.streetAddress(),
    city: faker.address.city(),
    country: faker.address.country(),
  };
  const newContactDetails = {
    phoneNumber: faker.phone.phoneNumber(),
    email: faker.internet.email(),
  };

  test('Press edit address', async () => {
    await utils.wait(100);
    await screen.press('EDIT_LOCATION_ADDRESS');
    await utils.wait(100);
  });

  test('Edit address fields', async () => {
    await screen.clearInput('STREET_ADDRESS_LINE_1_INPUT');
    await screen.input('STREET_ADDRESS_LINE_1_INPUT', newAddress.street);
  });

  test('Press Save', async () => {
    await screen.press('SAVE');
  });

  test('Sees updated address on LocationProfile', async () => {
    await utils.wait(100);
    const component = await screen.findOne('ADDRESS_BASIC_INFORMATION');
    const visibleAddress = await component.getText();

    expect(visibleAddress.includes(newAddress.street)).toBeTruthy();
  });

  test('Press edit contact details', async () => {
    await utils.wait(100);
    await screen.press('EDIT_LOCATION_CONTACT_DETAILS');
    await utils.wait(100);
  });

  test('Edit contact details fields', async () => {
    await screen.clearInput('EMAIL_INPUT');
    await screen.input('EMAIL_INPUT', newContactDetails.email);
  });

  test('Press Save', async () => {
    await screen.press('SAVE');
  });

  test('Sees updated contact details on LocationProfile', async () => {
    const component = await screen.findOne('CONTACT_DETAILS');
    const contactDetail = await component.getText();

    expect(contactDetail.includes(newContactDetails.email)).toBeTruthy();
  });
});

afterAll(async () => {
  await teardown();
});
