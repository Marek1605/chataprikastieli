'use client';

import { useTranslations } from 'next-intl';

const amenityCategories = [
  {
    id: 'kitchen',
    icon: '🍳',
    titleKey: 'kitchen',
    items: ['kitchenItem1', 'kitchenItem2', 'kitchenItem3', 'kitchenItem4', 'kitchenItem5'],
  },
  {
    id: 'bathroom',
    icon: '🛁',
    titleKey: 'bathroom',
    items: ['bathroomItem1', 'bathroomItem2', 'bathroomItem3', 'bathroomItem4', 'bathroomItem5'],
  },
  {
    id: 'bedroom',
    icon: '🛏',
    titleKey: 'bedroom',
    items: ['bedroomItem1', 'bedroomItem2', 'bedroomItem3', 'bedroomItem4', 'bedroomItem5'],
  },
  {
    id: 'living',
    icon: '🛋',
    titleKey: 'living',
    items: ['livingItem1', 'livingItem2', 'livingItem3', 'livingItem4', 'livingItem5'],
  },
  {
    id: 'exterior',
    icon: '🌳',
    titleKey: 'exterior',
    items: ['exteriorItem1', 'exteriorItem2', 'exteriorItem3', 'exteriorItem4', 'exteriorItem5'],
  },
  {
    id: 'experiences',
    icon: '🎿',
    titleKey: 'experiences',
    items: ['experiencesItem1', 'experiencesItem2', 'experiencesItem3', 'experiencesItem4', 'experiencesItem5'],
  },
];

export default function Amenities() {
  const t = useTranslations('amenities');

  return (
    <section id="amenities" className="py-20 bg-cream">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="section-label">{t('label')}</span>
          <h2 className="section-title">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenityCategories.map((category, index) => (
            <div
              key={category.id}
              className="bg-white p-8 rounded-xl shadow-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="font-body text-lg font-semibold">{t(category.titleKey)}</h3>
              </div>
              <ul className="space-y-3">
                {category.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <span className="w-1.5 h-1.5 bg-wood rounded-full flex-shrink-0" />
                    {t(item)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
