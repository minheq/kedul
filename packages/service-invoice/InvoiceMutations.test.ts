import path from 'path';

import { makeContext, makeKnex } from '@kedul/common-test-utils';
import faker from 'faker';

import {
  createInvoice,
  CreateInvoiceInput,
  refundInvoice,
  RefundInvoiceInput,
  voidInvoice,
  VoidInvoiceInput,
} from './InvoiceMutations';
import { InvoiceLineItemType, InvoiceStatus } from './InvoiceTypes';

const knex = makeKnex();
jest.mock('@kedul/service-permission');

const makeCreateInput = (
  input?: Partial<CreateInvoiceInput>,
): CreateInvoiceInput => ({
  locationId: faker.random.uuid(),
  clientId: faker.random.uuid(),
  discount: {
    amount: faker.random.number(),
  },
  note: faker.random.word(),

  lineItems: [
    {
      discount: {
        amount: faker.random.number(),
      },
      price: faker.random.number(),
      quantity: faker.random.number(),
      employeeId: faker.random.uuid(),
      type: InvoiceLineItemType.SERVICE,
      typeId: faker.random.uuid(),
    },
    {
      discount: {
        amount: faker.random.number(),
      },
      price: faker.random.number(),
      quantity: faker.random.number(),
      employeeId: faker.random.uuid(),
      type: InvoiceLineItemType.SERVICE,
      typeId: faker.random.uuid(),
    },
    {
      discount: {
        amount: faker.random.number(),
      },
      price: faker.random.number(),
      quantity: faker.random.number(),
      employeeId: faker.random.uuid(),
      type: InvoiceLineItemType.PRODUCT,
      typeId: faker.random.uuid(),
    },
    {
      discount: {
        amount: faker.random.number(),
      },
      price: faker.random.number(),
      quantity: faker.random.number(),
      employeeId: faker.random.uuid(),
      type: InvoiceLineItemType.PRODUCT,
      typeId: faker.random.uuid(),
    },
  ],
  payment: {
    amount: faker.random.number(),
    method: {
      name: faker.random.word(),
    },
  },
  tip: {
    amount: faker.random.number(),
  },
});

beforeAll(async () => {
  await knex.migrate.latest({
    directory: path.resolve(__dirname, './migrations'),
  });
});

afterAll(async () => {
  await knex.destroy();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('create', () => {
  test('should create happy path', async () => {
    const input = makeCreateInput();

    const result = await createInvoice(input, makeContext());

    expect(result.invoice!).toMatchObject(input);
  });
});

describe('refund', () => {
  test('should refund happy path', async () => {
    const context = makeContext();
    const { invoice } = await createInvoice(makeCreateInput(), context);

    const firstLineItem = invoice!.lineItems[0];
    const secondLineItem = invoice!.lineItems[1];

    const input: RefundInvoiceInput = {
      id: invoice!.id,
      lineItems: [
        {
          id: firstLineItem.id,
          quantity: 1,
        },
        {
          id: secondLineItem.id,
          quantity: 1,
        },
      ],
      payment: {
        amount: faker.random.number(),
        method: {
          name: faker.random.word(),
        },
      },
    };

    const result = await refundInvoice(input, context);

    expect(result.invoice!.payment).toMatchObject(input.payment);
    expect(result.invoice!.id).not.toBe(input.id);
    expect(result.invoice!.lineItems).toHaveLength(input.lineItems.length);
  });
});

describe('void', () => {
  test('should void happy path', async () => {
    const context = makeContext();
    const { invoice } = await createInvoice(makeCreateInput(), context);

    const input: VoidInvoiceInput = {
      id: invoice!.id,
    };

    const result = await voidInvoice(input, context);

    expect(result.invoice!.status).toBe(InvoiceStatus.VOID);
  });
});
