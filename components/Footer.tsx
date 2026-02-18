'use client';
import Link from 'next/link';
import { useAdmin } from '@/lib/AdminContext';

export default function Footer() {
  const { data } = useAdmin();
  const f = data.footer;
  const n = data.nav;
  const b = data.booking;

  return (
    <footer className="bg-graphite text-white py-12">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">🏠 Chata pri Kaštieli</h3>
            <p className="text-gray-300 text-sm">{f.description}</p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20">📷</a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20">📘</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Menu</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="#gallery" className="hover:text-white">• {n.gallery}</Link></li>
              <li><Link href="#amenities" className="hover:text-white">• {n.amenities}</Link></li>
              <li><Link href="#booking" className="hover:text-white">• {n.booking}</Link></li>
              <li><Link href="#pricing" className="hover:text-white">• {n.pricing}</Link></li>
              <li><Link href="#surroundings" className="hover:text-white">• {n.surroundings}</Link></li>
              <li><Link href="#contact" className="hover:text-white">• {n.contact}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">{n.contact}</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center gap-2">📞 {f.phone}</li>
              <li className="flex items-center gap-2">✉️ {f.email}</li>
              <li className="flex items-center gap-2">📍 {f.location}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/privacy" className="hover:text-white">{f.privacyText}</Link></li>
              <li><Link href="/terms" className="hover:text-white">{f.termsText}</Link></li>
            </ul>
            <p className="mt-4 text-xs text-gray-400">{f.bookViaText}</p>
            <div className="flex gap-2 mt-2">
              {b.bookingLinks.map(l => (
                <a key={l.id} href={l.url} target="_blank" rel="noopener" className="px-3 py-1 bg-white/10 rounded text-sm hover:bg-white/20">
                  {l.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>{f.copyright}</p>
          <p>{f.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
