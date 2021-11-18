import { bootstrap } from '@kedul/app-salon-bootstrap';
import { randomDigits, sleep } from '@kedul/common-utils';
import {
  EmailVerificationCode,
  PhoneVerificationCode,
} from '@kedul/service-user';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import Knex from 'knex';
import puppeteer from 'puppeteer';
import uuidv4 from 'uuid/v4';

import { env } from '../../env';
import { WebRouteName } from '../../src/App';

expect.extend({ toMatchImageSnapshot });

export interface E2EUtils {
  makeEmail: () => string;
  makePhoneNumber: () => string;
  wait: (ms?: number) => Promise<void>;
  randomString: () => string;
}

export interface E2EAuth {
  initSession: () => Promise<void>;
  findLatestPhoneVerificationCode: () => Promise<PhoneVerificationCode>;
  findLatestEmailVerificationCode: () => Promise<EmailVerificationCode>;
}

export interface Component {
  getText: () => Promise<string>;
  press: () => Promise<void>;
  findOne: (testId: string) => Promise<Component>;
  findMany: (testId: string) => Promise<Component[]>;
}

export interface E2EScreen {
  waitFor: (testId: string) => Promise<Component>;
  /** Press via touch the given node */
  press: (testId: string) => Promise<void>;
  /** Prints the current DOM tree */
  debug: () => Promise<string>;
  /** Type the text into input field */
  input: (testId: string, text: string) => Promise<void>;
  /** Clear the input field */
  clearInput: (testId: string) => Promise<void>;
  /** Find single component with given testID */
  findOne: (testId: string) => Promise<Component>;
  /** Find many components with given testID */
  findMany: (testId: string) => Promise<Component[]>;
  /** Navigate to given screen */
  navigate: (screenName: WebRouteName) => Promise<void>;
  /** Takes a screenshot of the screen and asserts it looks the same as its previous version */
  matchImageSnapshot: () => Promise<void>;
  /** Gets the name of the current screen */
  current: () => Promise<string>;
}

export interface E2E {
  setup: () => Promise<void>;
  teardown: () => Promise<void>;

  screen: E2EScreen;
  auth: E2EAuth;
  utils: E2EUtils;
}

class NoSetupError extends Error {
  constructor() {
    super(
      'The browser is not setup yet. Make sure to run screen.setup() before continuing with any test',
    );
  }
}

const knex = Knex({
  client: env.database.config.client,
  connection: `${env.database.config.connection}/${env.database.config.name}`,
});

const utils: E2EUtils = {
  makePhoneNumber: () => `9999${randomDigits(5)}`,
  makeEmail: () => `${uuidv4()}@gmail.com`,
  randomString: () => uuidv4(),
  wait: async (ms?: number) => {
    await sleep(ms);
  },
};

const testIDAttribute = (testID: string) => `*[data-testid="${testID}"]`;

export const makeE2E = (options?: puppeteer.LaunchOptions): E2E => {
  let page: puppeteer.Page | null = null;
  let browser: puppeteer.Browser | null = null;

  const setup = async () => {
    browser = await puppeteer.launch(options);
    page = await browser.newPage();
  };

  const teardown = async () => {
    if (!browser) throw new NoSetupError();
    browser.close();
    knex.destroy();
  };

  const getText = async (elementHandle: puppeteer.ElementHandle<Element>) => {
    if (!page) throw new NoSetupError();
    const text = await page.evaluate(el => el.innerText, elementHandle);
    return text;
  };

  const makeComponent = (elementHandle: puppeteer.ElementHandle<Element>) => {
    return {
      getText: async () => getText(elementHandle),
      press: async () => elementHandle.tap(),
      findOne: async (testID: string) => {
        const innerElementHandle = await elementHandle.$(
          testIDAttribute(testID),
        );

        return makeComponent(innerElementHandle!);
      },
      findMany: async (testID: string) => {
        const innerElementHandles = await elementHandle.$$(
          testIDAttribute(testID),
        );

        return innerElementHandles.map(makeComponent);
      },
    };
  };

  const waitFor = async (testID: string) => {
    if (!page) throw new NoSetupError();
    const elementHandle = await page.waitForSelector(testIDAttribute(testID));

    return makeComponent(elementHandle);
  };

  const findOne = async (testID: string) => {
    await waitFor(testID);

    if (!page) throw new NoSetupError();
    const elementHandle = await page.$(testIDAttribute(testID));

    return makeComponent(elementHandle!);
  };

  const findMany = async (testID: string) => {
    await waitFor(testID);

    if (!page) throw new NoSetupError();
    const elementHandles = await page.$$(testIDAttribute(testID));

    return elementHandles.map(makeComponent);
  };

  const press = async (testID: string) => {
    await waitFor(testID);

    if (!page) throw new NoSetupError();
    await page.tap(testIDAttribute(testID));
    // Often pressing items open up a Modal which requires some time to be visible
    await utils.wait(50);
  };

  const input = async (testID: string, text: string) => {
    await waitFor(testID);
    if (!page) throw new NoSetupError();
    await page.type(testIDAttribute(testID), text);
  };

  const clearInput = async (testID: string) => {
    await waitFor(testID);
    if (!page) throw new NoSetupError();
    await page.click(testIDAttribute(testID), { clickCount: 3 });
    await page.keyboard.press('Backspace');
  };

  const debug = async () => {
    if (!page) throw new NoSetupError();
    const content = await page.content();

    return content;
  };

  const matchImageSnapshot = async () => {
    if (!page) throw new NoSetupError();
    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot();
  };

  const navigate = async (to: WebRouteName) => {
    if (!page) throw new NoSetupError();
    await page.goto(`http://localhost:3000/${to}`);
  };

  const initSession = async () => {
    const data = await bootstrap();
    if (!page) throw new NoSetupError();

    await page.goto(`http://localhost:3000`);
    await page.evaluate(data => {
      localStorage.setItem('userToken', data.accessToken);
      localStorage.setItem('businessId', data.business.id);
      localStorage.setItem('locationId', data.location.id);
      // @ts-ignore
    }, data);
  };

  const findLatestPhoneVerificationCode = async () => {
    const phoneNumberVerificationCode = await knex
      .select()
      .from('PHONE_VERIFICATION_CODE')
      .orderBy('expiredAt', 'desc')
      .first();

    return phoneNumberVerificationCode;
  };

  const findLatestEmailVerificationCode = async () => {
    const emailVerificationCode = await knex
      .select()
      .from('EMAIL_VERIFICATION_CODE')
      .orderBy('expiredAt', 'desc')
      .first();

    return emailVerificationCode;
  };

  const current = async () => {
    if (!page) throw new NoSetupError();

    // Safely wait for the pages first
    await utils.wait(200);

    const url = page.url();
    const paths = url.split('/');
    const lastPath = paths[paths.length - 1] || paths[paths.length - 2];
    const path = lastPath.split('?')[0];

    return path;
  };

  return {
    screen: {
      waitFor,
      press,
      input,
      navigate,
      current,
      clearInput,
      debug,
      matchImageSnapshot,
      findOne,
      findMany,
    },
    setup,
    teardown,
    auth: {
      initSession,
      findLatestPhoneVerificationCode,
      findLatestEmailVerificationCode,
    },
    utils,
  };
};
