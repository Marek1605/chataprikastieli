'use client';
import { useAdmin } from '@/lib/AdminContext';

export default function Pricing() {
  const { data } = useAdmin();
  const p = data.pricing;
  const pkgs = [
    { key: 'weekend', icon: '🌙', ...p.packages.weekend, popular: false },
    { key: 'reset', icon: '⭐', ...p.packages.reset, popular: true },
    { key: 'week', icon: '📅', ...p.packages.week, popular: false },
  ];
  const scroll = (e: React.MouseEvent) => { e.preventDefault(); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <section id="pricing" className="py-16 bg-cream">
      <div className="container-custom">
        <header className="text-center mb-12"><span className="section-label">{p.label}</span><h2 className="section-title">{p.title}</h2></header>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pkgs.map(pkg => (
            <div key={pkg.key} className={`bg-white rounded-2xl p-6 shadow-sm relative ${pkg.popular ? 'ring-2 ring-wood' : ''}`}>
              {pkg.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-wood text-white text-xs px-3 py-1 rounded-full">{p.popularText}</span>}
              <div className="text-center mb-6"><span className="text-4xl mb-2 block">{pkg.icon}</span><h3 className="text-xl font-bold text-graphite">{pkg.name}</h3><p className="text-gray-500 text-sm">{pkg.desc}</p></div>
              <div className="text-center mb-6"><span className="text-4xl font-bold text-graphite">{pkg.price}€</span><span className="text-gray-500">/ {pkg.nights} {pkg.nights < 5 ? 'noci' : 'nocí'}</span></div>
              <button onClick={scroll} className={`w-full py-3 rounded-xl font-semibold ${pkg.popular ? 'bg-wood text-white hover:bg-wood-dark' : 'bg-gray-100 text-graphite hover:bg-gray-200'}`}>{p.ctaText}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
