# Newsletter Automation System

A comprehensive, scalable newsletter automation system for the blog platform.

## 📁 Folder Structure

```
backend/
├── config/
│   └── newsletter.config.js          # Newsletter configuration
├── templates/
│   └── email/
│       └── newsletter/
│           ├── index.js               # Template exports
│           ├── welcome.template.js    # Welcome email template
│           └── post-update.template.js # Post update template
├── services/
│   ├── emailService.js                # Base email service (reused)
│   ├── newsletterService.js           # Subscriber management (enhanced)
│   └── newsletter/
│       ├── newsletterEmailService.js  # Newsletter email operations
│       └── postNotificationService.js # Post notification logic
└── controllers/
    └── newsletterController.js        # Newsletter endpoints (enhanced)
```

## ✨ Features

### 1. **Automatic Welcome Emails**
- Sent immediately when a user subscribes
- Professional HTML template with branding
- Includes unsubscribe link
- Non-blocking (doesn't fail subscription if email fails)

### 2. **Automatic Post Notifications**
- Sent when a post is published (create or update to published status)
- Beautiful email template with post details, images, and metadata
- Batch processing to handle large subscriber lists
- Rate limiting to avoid email service throttling

### 3. **Manual Newsletter Operations**
- Send test emails
- Send custom post digests
- Send weekly digests
- Admin-only endpoints for control

### 4. **Scalable Architecture**
- Reusable email templates
- Batch processing for large subscriber lists
- Configurable batch sizes and delays
- Error handling that doesn't break main operations
- Async email sending (non-blocking)

## 🚀 Usage

### Automatic Operations

#### Subscribe (with automatic welcome email)
```javascript
// POST /api/newsletter/subscribe
{
  "email": "user@example.com"
}
```

#### Publish Post (with automatic notification)
```javascript
// POST /api/posts (with status: 'published')
// OR
// PUT /api/posts/:id (changing status to 'published')
{
  "title": "My New Post",
  "content": "...",
  "status": "published"  // Triggers automatic newsletter
}
```

### Manual Operations (Admin Only)

#### Send Test Email
```javascript
// POST /api/newsletter/test-email
{
  "email": "test@example.com"
}
```

#### Send Custom Digest
```javascript
// POST /api/newsletter/send-update
{
  "postIds": ["post_id_1", "post_id_2", "post_id_3"]
}
```

#### Send Weekly Digest
```javascript
// POST /api/newsletter/send-digest
{
  "days": 7  // Optional, defaults to 7
}
```

## ⚙️ Configuration

### Environment Variables

Add to your `.env` file:

```env
# Newsletter Automation
NEWSLETTER_SEND_WELCOME=true
NEWSLETTER_SEND_POST_NOTIFICATION=true
NEWSLETTER_BATCH_SIZE=50
NEWSLETTER_BATCH_DELAY=1000

# Email Configuration (already exists)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourblog.com
EMAIL_FROM_NAME=Your Blog Platform

# URLs
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:5000
```

### Configuration File

Edit `backend/config/newsletter.config.js` to customize:

```javascript
export const newsletterConfig = {
  automation: {
    sendWelcomeEmail: true,
    sendPostNotification: true,
    batchSize: 50,
    batchDelay: 1000,
  },
  digest: {
    defaultDays: 7,
    maxPosts: 10,
  },
};
```

## 📧 Email Templates

### Welcome Email
- Located: `backend/templates/email/newsletter/welcome.template.js`
- Sent: On subscription
- Includes: Welcome message, benefits list, unsubscribe link

### Post Update Email
- Located: `backend/templates/email/newsletter/post-update.template.js`
- Sent: When post is published
- Includes: Post image, title, excerpt, author, category, tags, read more button

## 🔧 Customization

### Adding New Email Templates

1. Create template file in `backend/templates/email/newsletter/`:
```javascript
export const getMyCustomTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
      <!-- Your HTML template -->
    </html>
  `;
};
```

2. Export from `index.js`:
```javascript
export { getMyCustomTemplate } from './my-custom.template.js';
```

3. Use in service:
```javascript
import { getMyCustomTemplate } from '../../templates/email/newsletter/index.js';

const html = getMyCustomTemplate(data);
await emailService.sendEmail({ to, subject, html });
```

### Modifying Batch Processing

Edit `backend/services/newsletter/newsletterEmailService.js`:

```javascript
// Change batch size
const batchSize = options.batchSize || 100;

// Change delay between batches
await this.delay(options.batchDelay || 2000);
```

## 🎯 Best Practices

1. **Non-Blocking Operations**: Email sending is async and doesn't block main operations
2. **Error Handling**: Email failures are logged but don't break subscriptions or post publishing
3. **Batch Processing**: Large subscriber lists are processed in batches
4. **Rate Limiting**: Delays between batches prevent email service throttling
5. **Reusable Components**: Templates and services are modular and reusable
6. **Configuration**: Centralized config for easy customization

## 🧪 Testing

### Test Welcome Email
```bash
curl -X POST http://localhost:5000/api/newsletter/test-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"email": "test@example.com"}'
```

### Test Post Notification
1. Create a draft post
2. Update it to published status
3. Check subscriber emails

### Monitor Logs
```bash
# Watch for email sending logs
tail -f logs/app.log | grep "📧"
```

## 📊 Monitoring

Email operations log with emojis for easy monitoring:

- `📧` - Email operation started
- `✅` - Email sent successfully
- `❌` - Email failed
- `⚠️` - Warning or skipped operation

## 🔒 Security

- Admin-only endpoints for manual operations
- Email validation on subscription
- Unsubscribe links in all emails
- No sensitive data in email templates
- Rate limiting on email sending

## 🚀 Scalability

The system is designed to scale:

1. **Batch Processing**: Handles thousands of subscribers
2. **Async Operations**: Non-blocking email sending
3. **Configurable Limits**: Adjust batch sizes as needed
4. **Error Isolation**: Email failures don't affect core operations
5. **Modular Design**: Easy to add new features

## 📝 API Endpoints

### Public
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter

### Admin Only
- `GET /api/newsletter` - Get all subscribers
- `GET /api/newsletter/stats` - Get newsletter statistics
- `POST /api/newsletter/test-email` - Send test email
- `POST /api/newsletter/send-update` - Send custom digest
- `POST /api/newsletter/send-digest` - Send weekly digest

## 🐛 Troubleshooting

### Emails Not Sending
1. Check SMTP configuration in `.env`
2. Verify email service credentials
3. Check logs for error messages
4. Test with `sendTestEmail` endpoint

### Slow Email Sending
1. Increase batch size in config
2. Decrease batch delay
3. Check email service rate limits

### Duplicate Emails
1. Check if post is being published multiple times
2. Verify automation flags in config
3. Check for duplicate subscribers

## 📚 Related Files

- `backend/services/emailService.js` - Base email service
- `backend/models/Newsletter.js` - Newsletter subscriber model
- `backend/config/email.config.js` - Email configuration
- `backend/controllers/newsletterController.js` - Newsletter endpoints
- `backend/routes/newsletterRoutes.js` - Newsletter routes
