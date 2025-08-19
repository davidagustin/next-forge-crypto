import 'server-only';
import Stripe from 'stripe';
import { keys } from './keys';

const stripeKey = keys().STRIPE_SECRET_KEY;

export const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: '2025-04-30.basil',
    })
  : null;

export type { Stripe } from 'stripe';
