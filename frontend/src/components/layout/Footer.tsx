import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[oklch(16.6%_0.018_256.802)] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[oklch(63.7%_0.237_25.331)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-bold">Blog</span>
            </div>
            <p className="text-[oklch(71.2%_0.045_256.788)] text-sm">
              A modern blogging platform for sharing ideas and stories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-[oklch(71.2%_0.045_256.788)] hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/posts" className="text-[oklch(71.2%_0.045_256.788)] hover:text-white transition-colors text-sm">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-[oklch(71.2%_0.045_256.788)] hover:text-white transition-colors text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[oklch(71.2%_0.045_256.788)] hover:text-white transition-colors text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/write" className="text-[oklch(71.2%_0.045_256.788)] hover:text-white transition-colors text-sm">
                  Write
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-[oklch(71.2%_0.045_256.788)] hover:text-white transition-colors text-sm">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[oklch(71.2%_0.045_256.788)] hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[oklch(71.2%_0.045_256.788)] hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-[oklch(71.2%_0.045_256.788)] hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[oklch(71.2%_0.045_256.788)] hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-[oklch(71.2%_0.045_256.788)] hover:text-white transition-colors text-sm">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[oklch(33.1%_0.034_265.755)] mt-8 pt-8 text-center">
          <p className="text-[oklch(71.2%_0.045_256.788)] text-sm">
            © {currentYear} Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
