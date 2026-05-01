import { Link } from 'react-router-dom';
import { 
  ComputerDesktopIcon, 
  PaintBrushIcon, 
  ChartBarIcon, 
  SparklesIcon 
} from '@heroicons/react/24/outline';

interface Category {
  name: string;
  slug: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  postCount: number;
  color: string;
}

export default function CategoryGrid() {
  const categories: Category[] = [
    {
      name: 'Technology',
      slug: 'technology',
      description: 'Latest in tech, programming, and innovation',
      icon: ComputerDesktopIcon,
      postCount: 156,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Design',
      slug: 'design',
      description: 'UI/UX, visual design, and creative inspiration',
      icon: PaintBrushIcon,
      postCount: 89,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Business',
      slug: 'business',
      description: 'Entrepreneurship, startups, and growth strategies',
      icon: ChartBarIcon,
      postCount: 124,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Lifestyle',
      slug: 'lifestyle',
      description: 'Health, productivity, and personal development',
      icon: SparklesIcon,
      postCount: 67,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Find articles that match your interests and dive deep into topics you love.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  {/* Gradient Header */}
                  <div className={`bg-gradient-to-br ${category.color} p-6 text-white`}>
                    <IconComponent className="w-12 h-12 mb-3" />
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-white/90 text-sm">{category.description}</p>
                  </div>

                  {/* Footer */}
                  <div className="p-6 flex items-center justify-between">
                    <span className="text-neutral-600 text-sm">
                      {category.postCount} articles
                    </span>
                    <svg 
                      className="w-5 h-5 text-neutral-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
