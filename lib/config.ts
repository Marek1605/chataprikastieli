import { PricingConfig, SurroundingPlace, Review, FAQItem, PricingPackage, GalleryImage } from './types';

// Site metadata
export const siteConfig = {
  name: 'Chata pri Kaštieli',
  domain: 'chataprikastieli.sk',
  url: 'https://chataprikastieli.sk',
  email: 'info@chataprikastieli.sk',
  phone: '+421 XXX XXX XXX',
  whatsapp: '+421 XXX XXX XXX',
  address: {
    street: '',
    city: 'Necpaly',
    region: 'Turiec',
    country: 'Slovensko',
  },
  social: {
    instagram: '#',
    facebook: '#',
  },
  booking: {
    airbnb: '#',
    bookingCom: '#',
  },
};

// iCal configuration
export const icalConfig = {
  urls: {
    airbnb: process.env.ICAL_URL_AIRBNB || '',
    booking: process.env.ICAL_URL_BOOKING || '',
  },
  cacheDuration: 20 * 60 * 1000, // 20 minutes
  cacheKey: 'chata_ical_cache',
};

// Pricing configuration
export const pricingConfig: PricingConfig = {
  offSeason: 85,
  season: 95,
  topSeason: 110,
  currency: '€',
  minNights: {
    default: 2,
    holidays: 3,
    topSeason: 2,
  },
  holidays: [
    '12-24', '12-25', '12-26', '12-27', '12-28', '12-29', '12-30', '12-31',
    '01-01', '01-02', '01-03', '01-04', '01-05', '01-06',
    '04-18', '04-19', '04-20', '04-21', // Easter (variable, update yearly)
    '05-01', '05-08', '11-01', '11-17',
  ],
  topSeasonMonths: [7, 8], // July, August
  seasonMonths: [4, 5, 6, 9, 10], // April-June, September-October
};

// Gallery images
export const galleryImages: GalleryImage[] = [
  { src: '/assets/gallery-1.jpg', alt: 'Interiér chaty', width: 800, height: 600 },
  { src: '/assets/gallery-2.jpg', alt: 'Obývačka', width: 400, height: 300 },
  { src: '/assets/gallery-3.jpg', alt: 'Spálňa', width: 400, height: 300 },
  { src: '/assets/gallery-4.jpg', alt: 'Kuchyňa', width: 400, height: 300 },
  { src: '/assets/gallery-5.jpg', alt: 'Kúpeľňa', width: 400, height: 300 },
  { src: '/assets/gallery-6.jpg', alt: 'Terasa', width: 800, height: 300 },
  { src: '/assets/gallery-7.jpg', alt: 'Výhľad', width: 400, height: 300 },
  { src: '/assets/gallery-8.jpg', alt: 'Detail interiéru', width: 400, height: 300 },
  { src: '/assets/gallery-9.jpg', alt: 'Okolie', width: 400, height: 300 },
  { src: '/assets/gallery-10.jpg', alt: 'Exteriér chaty', width: 400, height: 300 },
];

// Surrounding places
export const surroundingPlaces: SurroundingPlace[] = [
  { id: '1', type: 'surroundings.type1', titleKey: 'surroundings.place1Title', descKey: 'surroundings.place1Desc', image: '/assets/surrounding-1.jpg' },
  { id: '2', type: 'surroundings.type2', titleKey: 'surroundings.place2Title', descKey: 'surroundings.place2Desc', image: '/assets/surrounding-2.jpg' },
  { id: '3', type: 'surroundings.type3', titleKey: 'surroundings.place3Title', descKey: 'surroundings.place3Desc', image: '/assets/surrounding-3.jpg' },
  { id: '4', type: 'surroundings.type4', titleKey: 'surroundings.place4Title', descKey: 'surroundings.place4Desc', image: '/assets/surrounding-4.jpg' },
  { id: '5', type: 'surroundings.type5', titleKey: 'surroundings.place5Title', descKey: 'surroundings.place5Desc', image: '/assets/surrounding-5.jpg' },
  { id: '6', type: 'surroundings.type6', titleKey: 'surroundings.place6Title', descKey: 'surroundings.place6Desc', image: '/assets/surrounding-6.jpg' },
  { id: '7', type: 'surroundings.type7', titleKey: 'surroundings.place7Title', descKey: 'surroundings.place7Desc', image: '/assets/surrounding-7.jpg' },
  { id: '8', type: 'surroundings.type8', titleKey: 'surroundings.place8Title', descKey: 'surroundings.place8Desc', image: '/assets/surrounding-8.jpg' },
];

// Reviews
export const reviews: Review[] = [
  { id: '1', rating: 5, textKey: 'reviews.review1', author: 'Jana K.', dateKey: 'reviews.date1' },
  { id: '2', rating: 5, textKey: 'reviews.review2', author: 'Martin S.', dateKey: 'reviews.date2' },
  { id: '3', rating: 5, textKey: 'reviews.review3', author: 'Petra N.', dateKey: 'reviews.date3' },
  { id: '4', rating: 5, textKey: 'reviews.review4', author: 'Tomáš B.', dateKey: 'reviews.date4' },
  { id: '5', rating: 5, textKey: 'reviews.review5', author: 'Zuzana M.', dateKey: 'reviews.date5' },
  { id: '6', rating: 5, textKey: 'reviews.review6', author: 'Andrej H.', dateKey: 'reviews.date6' },
];

// FAQ items
export const faqItems: FAQItem[] = [
  { id: '1', questionKey: 'faq.q1', answerKey: 'faq.a1' },
  { id: '2', questionKey: 'faq.q2', answerKey: 'faq.a2' },
  { id: '3', questionKey: 'faq.q3', answerKey: 'faq.a3' },
  { id: '4', questionKey: 'faq.q4', answerKey: 'faq.a4' },
  { id: '5', questionKey: 'faq.q5', answerKey: 'faq.a5' },
  { id: '6', questionKey: 'faq.q6', answerKey: 'faq.a6' },
];

// Pricing packages
export const pricingPackages: PricingPackage[] = [
  {
    id: 'weekend',
    nameKey: 'pricing.package1Name',
    durationKey: 'pricing.package1Duration',
    nights: 2,
    price: 170,
    features: ['pricing.package1Feature1', 'pricing.package1Feature2', 'pricing.package1Feature3'],
  },
  {
    id: 'reset',
    nameKey: 'pricing.package2Name',
    durationKey: 'pricing.package2Duration',
    nights: 3,
    price: 255,
    features: ['pricing.package2Feature1', 'pricing.package2Feature2', 'pricing.package2Feature3'],
    popular: true,
  },
  {
    id: 'week',
    nameKey: 'pricing.package3Name',
    durationKey: 'pricing.package3Duration',
    nights: 7,
    price: 550,
    features: ['pricing.package3Feature1', 'pricing.package3Feature2', 'pricing.package3Feature3'],
  },
];

// Amenities categories
export const amenityCategories = [
  {
    id: 'kitchen',
    icon: '🍳',
    titleKey: 'amenities.kitchen',
    items: ['amenities.kitchenItem1', 'amenities.kitchenItem2', 'amenities.kitchenItem3', 'amenities.kitchenItem4', 'amenities.kitchenItem5'],
  },
  {
    id: 'bathroom',
    icon: '🛁',
    titleKey: 'amenities.bathroom',
    items: ['amenities.bathroomItem1', 'amenities.bathroomItem2', 'amenities.bathroomItem3', 'amenities.bathroomItem4', 'amenities.bathroomItem5'],
  },
  {
    id: 'bedroom',
    icon: '🛏',
    titleKey: 'amenities.bedroom',
    items: ['amenities.bedroomItem1', 'amenities.bedroomItem2', 'amenities.bedroomItem3', 'amenities.bedroomItem4', 'amenities.bedroomItem5'],
  },
  {
    id: 'living',
    icon: '🛋',
    titleKey: 'amenities.living',
    items: ['amenities.livingItem1', 'amenities.livingItem2', 'amenities.livingItem3', 'amenities.livingItem4', 'amenities.livingItem5'],
  },
  {
    id: 'exterior',
    icon: '🌳',
    titleKey: 'amenities.exterior',
    items: ['amenities.exteriorItem1', 'amenities.exteriorItem2', 'amenities.exteriorItem3', 'amenities.exteriorItem4', 'amenities.exteriorItem5'],
  },
  {
    id: 'experiences',
    icon: '🎿',
    titleKey: 'amenities.experiences',
    items: ['amenities.experiencesItem1', 'amenities.experiencesItem2', 'amenities.experiencesItem3', 'amenities.experiencesItem4', 'amenities.experiencesItem5'],
  },
];
