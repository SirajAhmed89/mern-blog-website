import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import FeaturedSection from '../components/home/FeaturedSection';
import CategoryGrid from '../components/home/CategoryGrid';
import NewsletterSection from '../components/home/NewsletterSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <FeaturedSection />
      <CategoryGrid />
      <NewsletterSection />
    </div>
  );
}
