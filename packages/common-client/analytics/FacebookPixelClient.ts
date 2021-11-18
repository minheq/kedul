import { AnalyticsClientInterface } from './AnalyticsClientInterface';

export type FacebookStandardEvent =
  /* Track when items are added to a shopping basket (e.g. click, landing page on Add to Basket button).	fbq('track', 'AddToCart');*/
  | 'Add to basket'
  /* Track when payment information is added in the checkout flow (e.g. click, landing page on billing info)	fbq('track', 'AddPaymentInfo');*/
  | 'Add payment info'
  /* Track when items are added to a wishlist (e.g. click, landing page on Add to Wishlist button).	fbq('track', 'AddToWishlist');*/
  | 'Add to wishlist'
  /* Track when a registration form is completed (e.g. subscription completion, sign-up for a service).	fbq('track', 'CompleteRegistration');*/
  | 'Complete registration'
  /* A telephone/SMS, email, chat or other type of contact between a customer and your business	fbq('track', 'Contact'); */
  | 'Contact'
  /* The customisation of products through a configuration tool or other application that your business owns	fbq('track', 'CustomiseProduct'); */
  | 'Customise product'
  /* Track donation of funds to your organisation or cause	fbq('track', 'Donate');*/
  | 'Donate'
  /* Track when a person finds one of your locations on the Internet or application with the intention to visit	fbq('track', 'FindLocation');*/
  | 'Find location'
  /* Track when people enter the checkout flow (e.g. click, landing page on checkout button).	fbq('track', 'InitiateCheckout');*/
  | 'Initiate checkout'
  /* Track when someone expresses interest in your offering (e.g. form submission, sign-up for trial, landing on pricing page).	fbq('track', 'Lead');*/
  | 'Lead'
  /* Track purchases or checkout flow completions (e.g. Landing on "Thank you" or confirmation page).	fbq('track', 'Purchase', {value: '0.00', currency: 'GBP'});*/
  | 'Purchase'
  /* Track the booking of an appointment to visit one of your locations	fbq('track', 'Schedule');*/
  | 'Schedule'
  /* Track searches on your website, app or other property (e.g. product searches)	fbq('track', 'Search');*/
  | 'Search'
  /* Track the start of a free trial of a product or service that you offer (e.g. trial subscription)	fbq('track', 'StartTrial', {value: '0.00', currency: 'USD', predicted_ltv: '0.00'});*/
  | 'Start trial'
  /* Track when a registration form is completed for a product, service or programme that you offer (e.g. credit card, educational programme or job)	fbq('track', 'SubmitApplication');*/
  | 'Submit application'
  /* Track the start of a paid subscription for a product or service that you offer	fbq('track', 'Subscribe', {value: '0.00', currency: 'USD', predicted_ltv: '0.00'});*/
  | 'Subscribe'
  /* Track key page views (e.g. product page, landing page, article).	fbq('track', 'ViewContent');*/
  | 'View content';

export const makeFacebookPixelClient = (
  eventMap: {
    [eventName: string]: FacebookStandardEvent;
  } = {},
): AnalyticsClientInterface => {
  return {
    group: payload => {
      return;
    },
    identify: payload => {
      return;
    },
    screen: payload => {
      return;
    },
    track: payload => {
      if (payload.event && eventMap[payload.event]) {
        const event = eventMap[payload.event];
        // @ts-ignore
        window.fbq('track', event, payload.properties);
      }
      return;
    },
  };
};
