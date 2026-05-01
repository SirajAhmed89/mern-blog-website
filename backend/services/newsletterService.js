import Newsletter from '../models/Newsletter.js';
import { AppError } from '../utils/AppError.js';
import { getPaginationData, formatPaginatedResponse } from '../utils/pagination.js';
import newsletterEmailService from './newsletter/newsletterEmailService.js';

class NewsletterService {
  async subscribe(email, source = 'website') {
    // Check if email already exists
    const existing = await Newsletter.findOne({ email });

    if (existing) {
      // If previously unsubscribed, reactivate
      if (existing.status === 'unsubscribed') {
        existing.status = 'active';
        existing.subscribedAt = new Date();
        existing.unsubscribedAt = null;
        await existing.save();
        
        // Send welcome back email
        newsletterEmailService.sendWelcomeEmail(email).catch(err => {
          console.error('Failed to send welcome back email:', err);
        });
        
        return { subscriber: existing, message: 'Welcome back! You have been resubscribed.' };
      }
      
      // Already subscribed
      return { subscriber: existing, message: 'You are already subscribed to our newsletter.' };
    }

    // Create new subscriber
    const subscriber = await Newsletter.create({
      email,
      source,
      status: 'active',
    });

    // Send welcome email asynchronously (don't wait for it)
    newsletterEmailService.sendWelcomeEmail(email).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    return { subscriber, message: 'Successfully subscribed to our newsletter!' };
  }

  async unsubscribe(email) {
    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      throw new AppError('Email not found in our subscriber list', 404);
    }

    if (subscriber.status === 'unsubscribed') {
      return { subscriber, message: 'You are already unsubscribed.' };
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return { subscriber, message: 'Successfully unsubscribed from our newsletter.' };
  }

  async findAll(filters = {}, page = 1, limit = 10, sort = '-subscribedAt') {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      query.email = { $regex: filters.search, $options: 'i' };
    }

    const total = await Newsletter.countDocuments(query);
    const pagination = getPaginationData(page, limit, total);

    const subscribers = await Newsletter.find(query)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage);

    return formatPaginatedResponse(subscribers, pagination);
  }

  async findById(id) {
    const subscriber = await Newsletter.findById(id);

    if (!subscriber) {
      throw new AppError('Subscriber not found', 404);
    }

    return subscriber;
  }

  async delete(id) {
    const subscriber = await Newsletter.findById(id);

    if (!subscriber) {
      throw new AppError('Subscriber not found', 404);
    }

    await subscriber.deleteOne();
    return subscriber;
  }

  async deleteMany(ids) {
    const result = await Newsletter.deleteMany({ _id: { $in: ids } });
    return result;
  }

  async getStats() {
    const total = await Newsletter.countDocuments();
    const active = await Newsletter.countDocuments({ status: 'active' });
    const unsubscribed = await Newsletter.countDocuments({ status: 'unsubscribed' });

    // Get subscribers from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSubscribers = await Newsletter.countDocuments({
      subscribedAt: { $gte: thirtyDaysAgo },
      status: 'active',
    });

    return {
      total,
      active,
      unsubscribed,
      recentSubscribers,
    };
  }

  async exportSubscribers(status = 'active') {
    const query = status ? { status } : {};
    const subscribers = await Newsletter.find(query)
      .select('email subscribedAt status')
      .sort('-subscribedAt');

    return subscribers;
  }
}

export default new NewsletterService();
