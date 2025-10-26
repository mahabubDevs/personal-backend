import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';
import ApiError from '../errors/ApiErrors';
import stripe from '../config/stripe';
import { Subscription } from '../app/modules/subscription/subscription.model';
import { User } from '../app/modules/user/user.model';
import { Package } from '../app/modules/package/package.model';
import { NotificationService } from '../app/modules/notification/notification.service';

export const handleSubscriptionCreated = async (data: Stripe.Subscription) => {
    try {
        // Retrieve the subscription from Stripe
        const subscription = await stripe.subscriptions.retrieve(data.id);

        // Retrieve the customer
        const customer = (await stripe.customers.retrieve(subscription.customer as string)) as Stripe.Customer;

        if (!customer?.email) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'No email found for the customer!');
        }

        // Find user by email
        const existingUser = await User.findOne({ email: customer.email });
        if (!existingUser) {
            throw new ApiError(StatusCodes.NOT_FOUND, `User with Email: ${customer.email} not found!`);
        }

        // Extract price ID
        const priceId = subscription.items.data[0]?.price?.id;

        // Find pricing plan by priceId
        const pricingPlan = await Package.findOne({ priceId });
        if (!pricingPlan) {
            throw new ApiError(StatusCodes.NOT_FOUND, `Pricing plan with Price ID: ${priceId} not found!`);
        }

        // Retrieve invoice for trxId and amountPaid
        const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
        const trxId = invoice?.payment_intent as string;
        const amountPaid = invoice?.total ? invoice.total / 100 : 0;

        // Required subscription fields
        const currentPeriodStart = subscription.current_period_start;
        const currentPeriodEnd = subscription.current_period_end;
        const subscriptionId = subscription.id;
        const price = subscription.items.data[0].price.unit_amount! / 100;
        const remaining = subscription.items.data[0].quantity || 1;

        // Create subscription
        const newSubscription = new Subscription({
            user: existingUser._id,
            customerId: customer.id,
            package: pricingPlan._id,
            status: 'active',
            trxId,
            amountPaid,
            price,
            subscriptionId,
            currentPeriodStart: new Date(currentPeriodStart * 1000).toISOString(),
            currentPeriodEnd: new Date(currentPeriodEnd * 1000).toISOString(),
            remaining,
        });

        await newSubscription.save();

        // Update user role
        await User.findByIdAndUpdate(
            existingUser._id,
            { role: 'PAIDUSER', isSubscribed: true, hasAccess: true },
            { new: true }
        );

         // --- ADD NOTIFICATION ---
       await NotificationService.createNotificationToDB({
        text: `A new user has subscribed to ${pricingPlan.title}!`,
        type: 'ADMIN',               
        read: false,                    
        referenceId: existingUser._id.toString(), 
        });

        
    } catch (error) {
        console.error('Subscription Created Error:', error);
        throw error;
    }

};