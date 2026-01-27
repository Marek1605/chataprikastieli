import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Overview from '@/components/Overview';
import WhyUs from '@/components/WhyUs';
import Gallery from '@/components/Gallery';
import Amenities from '@/components/Amenities';
import Experience from '@/components/Experience';
import Reset from '@/components/Reset';
import MemoryGame from '@/components/MemoryGame';
import Pricing from '@/components/Pricing';
import Booking from '@/components/Booking';
import Surroundings from '@/components/Surroundings';
import Reviews from '@/components/Reviews';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return (
    <main>
      <Navigation />
      <Hero />
      <Overview />
      <WhyUs />
      <Gallery />
      <Amenities />
      <Experience />
      <Reset />
      <MemoryGame />
      <Pricing />
      <Booking />
      <Surroundings />
      <Reviews />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
