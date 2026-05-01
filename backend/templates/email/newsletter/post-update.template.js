/**
 * Newsletter Post Update Email Template
 * Sent when new posts are published
 */

export const getPostUpdateTemplate = (posts, unsubscribeUrl) => {
  const currentYear = new Date().getFullYear();
  const isMultiplePosts = posts.length > 1;
  
  // Generate post cards HTML
  const postCardsHtml = posts.map(post => {
    const postUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/posts/${post.slug}`;
    const imageUrl = post.featuredImage 
      ? `${process.env.API_URL || 'http://localhost:5000'}${post.featuredImage}`
      : 'https://via.placeholder.com/600x300?text=Blog+Post';
    
    const excerpt = post.excerpt || post.content.substring(0, 150) + '...';
    const publishDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `
      <tr>
        <td style="padding: 0 0 30px 0;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <!-- Post Image -->
            <tr>
              <td style="padding: 0;">
                <a href="${postUrl}" style="display: block;">
                  <img src="${imageUrl}" alt="${post.title}" style="width: 100%; height: auto; display: block; border-radius: 8px 8px 0 0;" />
                </a>
              </td>
            </tr>
            
            <!-- Post Content -->
            <tr>
              <td style="padding: 30px;">
                <!-- Category Badge -->
                ${post.category ? `
                  <div style="margin-bottom: 15px;">
                    <span style="display: inline-block; padding: 6px 12px; background-color: #667eea; color: #ffffff; font-size: 12px; font-weight: bold; text-transform: uppercase; border-radius: 4px; letter-spacing: 0.5px;">
                      ${post.category.name}
                    </span>
                  </div>
                ` : ''}
                
                <!-- Post Title -->
                <h2 style="margin: 0 0 15px; color: #333333; font-size: 24px; font-weight: bold; line-height: 1.3;">
                  <a href="${postUrl}" style="color: #333333; text-decoration: none;">
                    ${post.title}
                  </a>
                </h2>
                
                <!-- Post Meta -->
                <p style="margin: 0 0 15px; color: #999999; font-size: 14px;">
                  ${post.author ? `By ${post.author.name} • ` : ''}${publishDate}
                </p>
                
                <!-- Post Excerpt -->
                <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                  ${excerpt}
                </p>
                
                <!-- Read More Button -->
                <div>
                  <a href="${postUrl}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
                    Read Full Article →
                  </a>
                </div>
                
                <!-- Tags -->
                ${post.tags && post.tags.length > 0 ? `
                  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                    ${post.tags.map(tag => `
                      <span style="display: inline-block; margin: 0 8px 8px 0; padding: 4px 10px; background-color: #f8f9fa; color: #666666; font-size: 12px; border-radius: 4px;">
                        #${tag.name}
                      </span>
                    `).join('')}
                  </div>
                ` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New ${isMultiplePosts ? 'Posts' : 'Post'} Published</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse;">
              <!-- Header -->
              <tr>
                <td style="padding: 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; margin-bottom: 30px;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    ${isMultiplePosts ? '📚 New Posts Published!' : '📝 New Post Published!'}
                  </h1>
                  <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                    Fresh content just for you
                  </p>
                </td>
              </tr>
              
              <!-- Spacer -->
              <tr><td style="height: 30px;"></td></tr>
              
              <!-- Post Cards -->
              ${postCardsHtml}
              
              <!-- Call to Action -->
              <tr>
                <td style="padding: 30px; text-align: center; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <h3 style="margin: 0 0 15px; color: #333333; font-size: 20px;">
                    Don't Miss Out!
                  </h3>
                  <p style="margin: 0 0 20px; color: #666666; font-size: 16px;">
                    Visit our blog for more amazing content
                  </p>
                  <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                    Visit Blog
                  </a>
                </td>
              </tr>
              
              <!-- Spacer -->
              <tr><td style="height: 30px;"></td></tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; background-color: #ffffff; border-radius: 8px; text-align: center;">
                  <p style="margin: 0 0 15px; color: #666666; font-size: 14px; line-height: 1.5;">
                    You're receiving this email because you subscribed to our newsletter.
                  </p>
                  <p style="margin: 0 0 10px; color: #666666; font-size: 12px;">
                    <a href="${unsubscribeUrl}" style="color: #667eea; text-decoration: none;">Unsubscribe</a> from this newsletter
                  </p>
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    © ${currentYear} ${process.env.EMAIL_FROM_NAME || 'Your Blog Platform'}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
