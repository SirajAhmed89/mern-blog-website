import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { newsletterService } from '../../services/newsletterService';
import { useToast } from '../../hooks/useToast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await newsletterService.subscribe(email);
      toast.success('Successfully subscribed!', {
        description: response.data.message || 'You will receive our latest updates',
      });
      setEmail('');
    } catch (error: any) {
      toast.error('Subscription failed', {
        description: error?.message || 'Something went wrong. Please try again later.',
      });
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-error-500 rounded-full mb-6 sm:mb-8">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">
            Never Miss an Update
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 px-4 leading-relaxed">
            Subscribe to our newsletter and get the latest articles, insights, and updates delivered directly to your inbox.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4">
            <div className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 sm:h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 text-base sm:text-lg px-4 sm:px-6"
              />
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full h-12 sm:h-14 bg-error-500 hover:bg-error-600 text-white font-semibold text-base sm:text-lg"
              >
                Subscribe
              </Button>
            </div>
          </form>

          {/* Privacy Note */}
          <p className="mt-6 sm:mt-8 text-sm sm:text-base text-white/60 px-4">
            We respect your privacy. Unsubscribe at any time.
          </p>

          {/* Stats - Hidden on mobile, shown on tablet+ */}
          <div className="hidden sm:grid grid-cols-3 gap-4 md:gap-8 mt-12 pt-12 border-t border-white/10">
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-1">10K+</div>
              <div className="text-white/70 text-sm">Subscribers</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-1">Weekly</div>
              <div className="text-white/70 text-sm">Newsletters</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-1">4.9★</div>
              <div className="text-white/70 text-sm">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
