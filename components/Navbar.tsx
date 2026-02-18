'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/lib/AdminContext';

export default function Navbar() {
  const { data, isAdmin } = useAdmin();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const n = data.nav;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { id: 'hero', label: n.home },
    { id: 'gallery', label: n.gallery },
    { id: 'amenities', label: n.amenities },
    { id: 'booking', label: n.booking },
    { id: 'pricing', label: n.pricing },
    { id: 'surroundings', label: n.surroundings },
    { id: 'reviews', label: n.reviews },
    { id: 'faq', label: n.faq },
    { id: 'contact', label: n.contact },
  ];

  // Admin bar offset
  const topOffset = isAdmin ? 'top-[52px]' : 'top-0';

  return (
    <>
      <nav className={`fixed left-0 right-0 z-[300] transition-all duration-300 ${topOffset} ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-display text-xl text-graphite">
              <span className="text-2xl">🏠</span>
              <span className="hidden sm:inline">Chata pri Kaštieli</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={scrollTo(item.id)}
                  className="px-3 py-2 text-sm text-graphite hover:text-wood transition-colors rounded-lg hover:bg-cream"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Language - zatiaľ len SK */}
              <div className="hidden sm:flex items-center gap-1 text-sm text-graphite">
                <span>🇸🇰</span>
                <span>SK</span>
              </div>

              {/* CTA button */}
              <a
                href="#booking"
                onClick={scrollTo('booking')}
                className="px-4 py-2 bg-graphite text-white rounded-lg text-sm font-semibold hover:bg-graphite/90 transition-colors"
              >
                {n.bookNow}
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-graphite"
              >
                {mobileOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t shadow-lg">
            <div className="container-custom py-4 space-y-2">
              {navItems.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={scrollTo(item.id)}
                  className="block px-4 py-2 text-graphite hover:bg-cream rounded-lg"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
      
      {/* Spacer for fixed navbar */}
      <div className={`h-16 ${isAdmin ? 'mt-[52px]' : ''}`} />
    </>
  );
}
