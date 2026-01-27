'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/lib/config';
import { isValidEmail, cn } from '@/lib/utils';

export default function Contact() {
  const t = useTranslations('contact');
  const tVal = useTranslations('validation');
  const tForm = useTranslations('form');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    gdprConsent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = tVal('nameRequired');
    if (!isValidEmail(formData.email)) newErrors.email = tVal('emailInvalid');
    if (!formData.message.trim()) newErrors.message = tVal('nameRequired');
    if (!formData.gdprConsent) newErrors.gdpr = tVal('gdprRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '', gdprConsent: false });
      } else {
        alert(tForm('submitError'));
      }
    } catch {
      alert(tForm('submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-16 sm:py-20 lg:py-24 bg-cream"
      aria-labelledby="contact-title"
    >
      <div className="container-custom">
        <header className="text-center mb-10 sm:mb-12 lg:mb-16">
          <span className="section-label">{t('label')}</span>
          <h2 id="contact-title" className="section-title">{t('title')}</h2>
          <p className="section-subtitle mt-4">{t('subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-body font-semibold mb-2">{t('phone')}</h3>
              <a
                href={`tel:${siteConfig.phone}`}
                className="text-lg text-wood hover:underline"
              >
                {siteConfig.phone}
              </a>
            </div>
            <div>
              <h3 className="font-body font-semibold mb-2">{t('email')}</h3>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-lg text-wood hover:underline"
              >
                {siteConfig.email}
              </a>
            </div>
            <div>
              <h3 className="font-body font-semibold mb-2">{t('address')}</h3>
              <p className="text-gray-600">
                {siteConfig.address.city}, {siteConfig.address.region}
                <br />
                {siteConfig.address.country}
              </p>
            </div>
            <div>
              <h3 className="font-body font-semibold mb-2">WhatsApp</h3>
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-wood hover:underline"
              >
                {siteConfig.whatsapp}
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✓</div>
                <p className="text-gray-600">{t('successMessage')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">{t('formName')}</label>
                  <input
                    type="text"
                    className={cn('form-input', errors.name && 'error')}
                    placeholder={t('namePlaceholder')}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                <div>
                  <label className="form-label">{t('formEmail')}</label>
                  <input
                    type="email"
                    className={cn('form-input', errors.email && 'error')}
                    placeholder={t('emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>
                <div>
                  <label className="form-label">{t('formMessage')}</label>
                  <textarea
                    className={cn('form-input min-h-[120px]', errors.message && 'error')}
                    placeholder={t('messagePlaceholder')}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                  {errors.message && (
                    <p className="form-error">{errors.message}</p>
                  )}
                </div>
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={formData.gdprConsent}
                      onChange={(e) =>
                        setFormData({ ...formData, gdprConsent: e.target.checked })
                      }
                    />
                    <span className="text-sm text-gray-600">{t('formGdpr')}</span>
                  </label>
                  {errors.gdpr && <p className="form-error">{errors.gdpr}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full"
                >
                  {isSubmitting ? '...' : t('formSubmit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
