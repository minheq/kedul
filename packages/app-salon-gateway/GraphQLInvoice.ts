import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { RequestContext } from '@kedul/common-server';
import {
  QueryFindInvoiceByIdArgs,
  VoidInvoiceInput,
  voidInvoice,
  RefundInvoiceInput,
  refundInvoice,
  createInvoice,
  CreateInvoiceInput,
} from '@kedul/service-invoice';

import { GraphQLUserError, GraphQLDate } from './GraphQLCommon';
import { GraphQLEmployee } from './GraphQLEmployee';
import { GraphQLClient } from './GraphQLClient';
import { GraphQLLocation } from './GraphQLLocation';
import { makeMutation, makeQuery } from './GraphQLUtils';

const GraphQLDiscount: GraphQLObjectType = new GraphQLObjectType({
  name: 'Discount',
  fields: () => ({
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

const GraphQLPayment: GraphQLObjectType = new GraphQLObjectType({
  name: 'Payment',
  fields: () => ({
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
    method: { type: GraphQLPaymentMethod },
  }),
});

const GraphQLPaymentMethod: GraphQLObjectType = new GraphQLObjectType({
  name: 'PaymentMethod',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const GraphQLTip: GraphQLObjectType = new GraphQLObjectType({
  name: 'Tip',
  fields: () => ({
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

const GraphQLInvoiceLineItemType = new GraphQLEnumType({
  name: 'InvoiceLineItemType',
  values: {
    SERVICE: { value: 'SERVICE' },
    PRODUCT: { value: 'PRODUCT' },
  },
});

export const GraphQLInvoice: GraphQLObjectType = new GraphQLObjectType({
  name: 'Invoice',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    note: { type: GraphQLString },
    location: { type: new GraphQLNonNull(GraphQLLocation) },
    lineItems: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLInvoiceLineItem)),
      ),
    },
    discount: { type: GraphQLDiscount },
    tip: { type: GraphQLTip },
    payment: { type: new GraphQLNonNull(GraphQLPayment) },
    client: { type: GraphQLClient },
    status: { type: new GraphQLNonNull(GraphQLInvoiceStatus) },
    refundInvoice: { type: GraphQLInvoice },
    originalInvoice: { type: GraphQLInvoice },
    createdAt: { type: new GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: new GraphQLNonNull(GraphQLDate) },
    refundedAt: { type: GraphQLDate },
    voidAt: { type: GraphQLDate },
  }),
});

const GraphQLInvoiceLineItem: GraphQLObjectType = new GraphQLObjectType({
  name: 'InvoiceLineItem',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    invoice: { type: new GraphQLNonNull(GraphQLInvoice) },
    quantity: { type: new GraphQLNonNull(GraphQLInt) },
    typeId: { type: new GraphQLNonNull(GraphQLID) },
    type: { type: new GraphQLNonNull(GraphQLInvoiceLineItemType) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    discount: { type: GraphQLDiscount },
    employee: { type: GraphQLEmployee },
  }),
});

const GraphQLInvoiceStatus = new GraphQLEnumType({
  name: 'InvoiceStatus',
  values: {
    VOID: { value: 'VOID' },
    REFUNDED: { value: 'REFUNDED' },
    COMPLETED: { value: 'COMPLETED' },
  },
});

const GraphQLPaymentMethodInput = new GraphQLInputObjectType({
  name: 'PaymentMethodInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const GraphQLPaymentInput = new GraphQLInputObjectType({
  name: 'PaymentInput',
  fields: () => ({
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
    method: { type: GraphQLPaymentMethodInput },
  }),
});

const GraphQLDiscountInput = new GraphQLInputObjectType({
  name: 'DiscountInput',
  fields: () => ({
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

const GraphQLInvoiceLineItemInput = new GraphQLInputObjectType({
  name: 'InvoiceLineItemInput',
  fields: () => ({
    id: { type: GraphQLID },
    quantity: { type: new GraphQLNonNull(GraphQLInt) },
    typeId: { type: new GraphQLNonNull(GraphQLID) },
    type: { type: new GraphQLNonNull(GraphQLInvoiceLineItemType) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    discount: { type: GraphQLDiscountInput },
    employeeId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

const GraphQLRefundInvoiceLineItemInput = new GraphQLInputObjectType({
  name: 'RefundInvoiceLineItemInput',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    quantity: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const GraphQLTipInput = new GraphQLInputObjectType({
  name: 'TipInput',
  fields: () => ({
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const CreateInvoiceMutation = makeMutation({
  name: 'CreateInvoice',
  inputFields: {
    id: { type: GraphQLID },
    note: { type: GraphQLString },
    lineItems: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLInvoiceLineItemInput)),
      ),
    },
    discount: { type: GraphQLDiscountInput },
    tip: { type: GraphQLTipInput },
    payment: { type: new GraphQLNonNull(GraphQLPaymentInput) },
    clientId: { type: GraphQLID },
    locationId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    invoice: { type: GraphQLInvoice },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: CreateInvoiceInput, context: RequestContext) =>
    createInvoice(input, context),
});

export const RefundInvoiceMutation = makeMutation({
  name: 'RefundInvoice',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    lineItems: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLRefundInvoiceLineItemInput)),
      ),
    },
    payment: { type: new GraphQLNonNull(GraphQLPaymentInput) },
  },
  outputFields: {
    invoice: { type: GraphQLInvoice },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: RefundInvoiceInput, context: RequestContext) =>
    refundInvoice(input, context),
});

export const VoidInvoiceMutation = makeMutation({
  name: 'VoidInvoice',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    invoice: { type: GraphQLInvoice },
    isSuccessful: { type: new GraphQLNonNull(GraphQLBoolean) },
    userError: { type: GraphQLUserError },
  },
  mutateAndGetPayload: (input: VoidInvoiceInput, context: RequestContext) =>
    voidInvoice(input, context),
});

export const InvoiceQuery = makeQuery({
  type: GraphQLInvoice,
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (
    root: {},
    args: QueryFindInvoiceByIdArgs,
    context: RequestContext,
  ) => null,
});
