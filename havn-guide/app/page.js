'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Wifi,
  Lock,
  Car,
  Droplets,
  Cloud,
  MessageCircle,
  Phone,
  MapPinIcon,
  Heart,
  AlertCircle,
  ChevronRight,
  Star,
  Utensils,
  Compass,
  Flower2,
  ShoppingBag,
  Music,
  Users,
  Ticket,
  Clock,
  DollarSign,
  Send,
  Menu,
  X,
} from 'lucide-react';
import { lookupReservation, fetchGuideContent, submitFeedback, requestService } from './api';
import { translations } from './translations';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getDaysLeft = (checkOutDate) => {
  const checkout = new Date(checkOutDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  checkout.setHours(0, 0, 0, 0);
  const diff = Math.ceil((checkout - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};

const formatDate = (dateStr, lang) => {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const locale = lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : 'en-US';
  return date.toLocaleDateString(locale, options);
};

const getLanguageFromCountry = (country) => {
  const arabicCountries = ['MA', 'DZ', 'TN', 'SA', 'AE'];
  const frenchCountries = ['FR', 'BE', 'CH'];
  if (arabicCountries.includes(country)) return 'ar';
  if (frenchCountries.includes(country)) return 'fr';
  return 'en';
};

// ============================================================================
// COPY BUTTON COMPONENT
// ============================================================================

const CopyButton = ({ text, lang = 'en' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const t = translations[lang] || translations.en;

  return (
    <button
      onClick={handleCopy}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#C5A55A',
        fontSize: '0.875rem',
        fontWeight: '500',
        marginLeft: '8px',
        padding: '4px 8px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(197, 165, 90, 0.1)')}
      onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
    >
      {copied ? `${t.copied}!` : t.copy}
    </button>
  );
};

// ============================================================================
// LOOKUP SCREEN COMPONENT
// ============================================================================

const LookupScreen = ({ onReservationFound, onLanguageChange, currentLang }) => {
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const t = translations[currentLang] || translations.en;

  const handleSearch = async () => {
    if (!guestName.trim()) {
      setError(t.enterName || 'Please enter a guest name');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await lookupReservation(guestName);
      if (!result.success) {
        setError(t.reservationNotFound || 'Reservation not found');
        return;
      }

      const reservations = result.reservations || [];

      if (reservations.length === 0) {
        setError(t.contactHost || 'Please contact your host');
      } else if (reservations.length === 1) {
        onReservationFound(reservations[0], currentLang);
      } else {
        setSearchResults(reservations);
        setShowResults(true);
      }
    } catch (err) {
      setError(t.error || 'An error occurred');
      console.error('Lookup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReservation = (reservation) => {
    onReservationFound(reservation, currentLang);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (showResults && searchResults.length > 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0F1923',
          color: '#FFFFFF',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '40px',
        }}
      >
        <div style={{ maxWidth: '430px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '2px', marginBottom: '4px' }}>
              HAVN
            </div>
            <div style={{ fontSize: '12px', letterSpacing: '1px', color: '#C5A55A' }}>
              STAYS by Medini Homes
            </div>
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '18px', fontWeight: '400' }}>
            {t.selectReservation || 'Select your reservation'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {searchResults.map((res, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectReservation(res)}
                style={{
                  padding: '16px',
                  background: '#162230',
                  border: '1px solid #C5A55A',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1a2a38';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#162230';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{res.listing?.name || 'Property'}</div>
                <div style={{ fontSize: '12px', color: '#B8B0A4' }}>
                  {formatDate(res.checkIn, currentLang)} - {formatDate(res.checkOut, currentLang)}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setShowResults(false);
              setSearchResults([]);
              setGuestName('');
            }}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: '1px solid #8A8578',
              color: '#FFFFFF',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {t.back || 'Back'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0F1923',
        color: '#FFFFFF',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '430px', width: '100%', textAlign: 'center' }}>
        {/* Language Switcher */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '40px',
            position: 'absolute',
            top: '20px',
            right: '20px',
          }}
        >
          {['en', 'fr', 'ar'].map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              style={{
                padding: '6px 12px',
                background: currentLang === lang ? '#C5A55A' : 'transparent',
                color: currentLang === lang ? '#0F1923' : '#C5A55A',
                border: '1px solid #C5A55A',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Logo */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '3px', marginBottom: '8px' }}>
            HAVN
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '2px' }}>
            <span style={{ color: '#C5A55A' }}>STAYS</span>
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '1px', color: '#8A8578', marginTop: '12px' }}>
            by Medini Homes
          </div>
        </div>

        {/* Guest Name Input */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder={t.lookupPlaceholder || 'Reservation name'}
            value={guestName}
            onChange={(e) => {
              setGuestName(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid #C5A55A',
              borderRadius: '4px',
              background: '#162230',
              color: '#FFFFFF',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#D4B96A')}
            onBlur={(e) => (e.target.style.borderColor = '#C5A55A')}
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: '#C5A55A',
            color: '#0F1923',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '1px',
            transition: 'all 0.2s',
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.background = '#D4B96A';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.background = '#C5A55A';
          }}
        >
          {loading ? (t.lookupSearching || 'Searching…') : t.lookupButton || 'Access my guide'}
        </button>

        {/* Error Message */}
        {error && (
          <div
            style={{
              marginTop: '20px',
              padding: '12px 16px',
              background: 'rgba(255, 59, 48, 0.1)',
              border: '1px solid #FF3B30',
              borderRadius: '4px',
              color: '#FF9999',
              fontSize: '13px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// GUIDE SCREEN COMPONENT
// ============================================================================

const GuideScreen = ({ reservation, onBack, lang }) => {
  const [guideContent, setGuideContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const t = translations[lang] || translations.en;
  const guestFirstName = reservation.guestName?.split(' ')[0] || 'Guest';
  const daysLeft = getDaysLeft(reservation.checkOut);
  const isRTL = lang === 'ar';

  // Auto-detect language from guest country if not set
  const detectedLang = lang || getLanguageFromCountry(reservation.guestCountry || 'US');

  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await fetchGuideContent();
        if (content.success) {
          setGuideContent(content.data);
        } else {
          setError(t.contentLoadError || 'Failed to load content');
        }
      } catch (err) {
        console.error('Content load error:', err);
        setError(t.contentLoadError || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [t]);

  const handleFeedback = async (rating) => {
    setFeedbackRating(rating);
    try {
      await submitFeedback({
        reservationId: reservation.id,
        guestName: reservation.guestName,
        listingName: reservation.listing?.name,
        rating: rating,
        comment: '',
      });
    } catch (err) {
      console.error('Feedback error:', err);
    }
  };

  const handleRequestService = async (service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0F1923',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>{t.loading || 'Loading...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0F1923',
          color: '#FFFFFF',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ marginBottom: '20px', color: '#FF9999' }}>{error}</div>
        <button
          onClick={onBack}
          style={{
            padding: '12px 24px',
            background: '#C5A55A',
            color: '#0F1923',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          {t.back || 'Back'}
        </button>
      </div>
    );
  }

  const propertyImage = reservation.listing?.image || 'https://images.unsplash.com/photo-1566708881687-a5e12b5d8f45?w=800&h=600&fit=crop';

  return (
    <div
      style={{
        direction: isRTL ? 'rtl' : 'ltr',
        minHeight: '100vh',
        background: '#FAF8F5',
        color: '#0F1923',
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          position: 'relative',
          height: '280px',
          background: `url(${propertyImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginBottom: '0',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '0',
            background: 'linear-gradient(180deg, rgba(15,25,35,0.3) 0%, rgba(15,25,35,0.8) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div style={{ textAlign: 'center', color: '#FFFFFF' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '2px', marginBottom: '4px' }}>
              HAVN
            </div>
            <div style={{ fontSize: '12px', letterSpacing: '1px', color: '#C5A55A' }}>
              STAYS
            </div>
          </div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '300',
              color: '#FFFFFF',
              marginTop: '20px',
              fontFamily: 'Cormorant Garamond, serif',
            }}
          >
            {t.welcome || 'Welcome'}, {guestFirstName}
          </h1>
          <p style={{ fontSize: '14px', color: '#D4B96A', marginTop: '8px', fontWeight: '500' }}>
            {reservation.listing?.name}
          </p>
        </div>
      </div>

      {/* Container */}
      <div
        style={{
          maxWidth: '430px',
          margin: '0 auto',
          padding: '0 12px',
        }}
      >
        {/* Stay Countdown Banner */}
        <div
          style={{
            background: '#0F1923',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '20px',
            marginBottom: '20px',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#8A8578', marginBottom: '4px' }}>
              {t.stayPeriod || 'Stay Period'}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '500' }}>
              {formatDate(reservation.checkIn, lang)} -{' '}
              {formatDate(reservation.checkOut, lang)}
            </div>
          </div>
          <div
            style={{
              background: '#C5A55A',
              color: '#0F1923',
              borderRadius: '4px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: '700',
              textAlign: 'center',
            }}
          >
            {daysLeft}
            <div style={{ fontSize: '10px', fontWeight: '400' }}>
              {daysLeft === 1 ? t.day : t.days} {t.left || 'left'}
            </div>
          </div>
        </div>

        {/* Property Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {/* Check-in/Check-out */}
          <div style={{ background: '#FFFFFF', borderRadius: '8px', padding: '16px', border: '1px solid #E8E0D5' }}>
            <div style={{ fontSize: '12px', color: '#8A8578', marginBottom: '8px' }}>
              {t.checkIn || 'Check-in'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
              {formatDate(reservation.checkIn, lang)}
            </div>
            <div style={{ fontSize: '12px', color: '#8A8578' }}>
              {reservation.listing?.checkInTime || '15:00'}
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '8px', padding: '16px', border: '1px solid #E8E0D5' }}>
            <div style={{ fontSize: '12px', color: '#8A8578', marginBottom: '8px' }}>
              {t.checkOut || 'Check-out'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
              {formatDate(reservation.checkOut, lang)}
            </div>
            <div style={{ fontSize: '12px', color: '#8A8578' }}>
              {reservation.listing?.checkOutTime || '11:00'}
            </div>
          </div>

          {/* WiFi */}
          <div style={{ background: '#FFFFFF', borderRadius: '8px', padding: '16px', border: '1px solid #E8E0D5' }}>
            <div style={{ fontSize: '12px', color: '#8A8578', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
              <Wifi size={14} style={{ marginRight: '4px' }} />
              WiFi
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', wordBreak: 'break-word', marginBottom: '4px' }}>
              {reservation.listing?.wifiPassword || 'havn-stays-2024'}
            </div>
            <CopyButton text={reservation.listing?.wifiPassword || 'havn-stays-2024'} lang={lang} />
          </div>

          {/* Access Code */}
          <div style={{ background: '#FFFFFF', borderRadius: '8px', padding: '16px', border: '1px solid #E8E0D5' }}>
            <div style={{ fontSize: '12px', color: '#8A8578', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
              <Lock size={14} style={{ marginRight: '4px' }} />
              {t.accessCode || 'Access Code'}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
              {reservation.listing?.accessCode || '4821'}
            </div>
            <CopyButton text={reservation.listing?.accessCode || '4821'} lang={lang} />
          </div>

          {/* Parking */}
          {reservation.listing?.parkingCode && (
            <div style={{ background: '#FFFFFF', borderRadius: '8px', padding: '16px', border: '1px solid #E8E0D5' }}>
              <div style={{ fontSize: '12px', color: '#8A8578', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <Car size={14} style={{ marginRight: '4px' }} />
                {t.parking || 'Parking'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                {reservation.listing?.parkingCode}
              </div>
              <CopyButton text={reservation.listing?.parkingCode} lang={lang} />
            </div>
          )}
        </div>

        {/* Weather Widget */}
        {guideContent?.weather && (
          <div style={{ background: '#0F1923', borderRadius: '8px', padding: '20px', marginBottom: '20px', color: '#FFFFFF' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
              <Cloud size={16} style={{ marginRight: '8px' }} />
              {t.weather || 'Weather'}
            </h3>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '48px', fontWeight: '300', marginBottom: '4px' }}>
                {guideContent.weather.current?.temp || '24'}°
              </div>
              <div style={{ fontSize: '13px', color: '#B8B0A4' }}>
                {guideContent.weather.current?.condition || 'Sunny'}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {(guideContent.weather.forecast || []).slice(0, 5).map((day, idx) => (
                <div
                  key={idx}
                  style={{
                    textAlign: 'center',
                    padding: '8px',
                    background: '#162230',
                    borderRadius: '4px',
                    fontSize: '11px',
                  }}
                >
                  <div style={{ marginBottom: '4px', color: '#8A8578' }}>
                    {new Date(day.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : 'en-US', {
                      weekday: 'short',
                    })}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>
                    {day.high}° / {day.low}°
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            {t.quickActions || 'Quick Actions'}
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { label: t.extendStay || 'Extend Stay', action: 'extend' },
              { label: t.lateCheckout || 'Late Checkout', action: 'checkout' },
              { label: t.cleaning || 'Extra Cleaning', action: 'cleaning' },
              { label: t.taxi || 'Taxi', action: 'taxi' },
            ].map((action) => (
              <button
                key={action.action}
                onClick={() => handleRequestService({ name: action.label })}
                style={{
                  padding: '8px 12px',
                  background: '#0F1923',
                  color: '#FFFFFF',
                  border: '1px solid #C5A55A',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#C5A55A';
                  e.target.style.color = '#0F1923';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#0F1923';
                  e.target.style.color = '#FFFFFF';
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Explore Grid */}
        {guideContent && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              {t.explore || 'Explore Marrakech'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { key: 'restaurants', icon: Utensils, label: t.restaurants || 'Restaurants' },
                { key: 'experiences', icon: Compass, label: t.experiences || 'Experiences' },
                { key: 'wellness', icon: Flower2, label: t.wellness || 'Wellness' },
                { key: 'shopping', icon: ShoppingBag, label: t.shopping || 'Shopping' },
                { key: 'nightlife', icon: Music, label: t.nightlife || 'Nightlife' },
                { key: 'culture', icon: Users, label: t.culture || 'Culture' },
              ].map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.key}
                    style={{
                      padding: '16px',
                      background: '#FFFFFF',
                      border: '1px solid #E8E0D5',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#C5A55A';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E8E0D5';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Icon size={24} style={{ color: '#C5A55A', marginBottom: '8px' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{category.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Restaurants Carousel */}
        {guideContent?.restaurants && guideContent.restaurants.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              {t.restaurants || 'Restaurants'}
            </h3>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '8px',
                scrollBehavior: 'smooth',
              }}
            >
              {guideContent.restaurants.map((restaurant, idx) => {
                const cuisineField = `cuisine_${lang}` || 'cuisine_en';
                const descField = `description_${lang}` || 'description_en';
                return (
                  <div
                    key={idx}
                    style={{
                      minWidth: '280px',
                      background: '#FFFFFF',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #E8E0D5',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        height: '160px',
                        background: `url(${restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <div style={{ padding: '12px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                        {restaurant.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#8A8578', marginBottom: '8px' }}>
                        {restaurant[cuisineField] || restaurant.cuisine_en}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              style={{
                                fill: i < Math.floor(restaurant.rating || 0) ? '#C5A55A' : '#E8E0D5',
                                color: '#C5A55A',
                              }}
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: '11px', color: '#8A8578' }}>
                          {restaurant.price_range || '$$'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Experiences Carousel */}
        {guideContent?.experiences && guideContent.experiences.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              {t.experiences || 'Experiences'}
            </h3>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '8px',
                scrollBehavior: 'smooth',
              }}
            >
              {guideContent.experiences.map((exp, idx) => {
                const nameField = `name_${lang}`;
                const descField = `description_${lang}`;
                return (
                  <div
                    key={idx}
                    style={{
                      minWidth: '260px',
                      background: '#FFFFFF',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #E8E0D5',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        height: '140px',
                        background: `url(${exp.image_url || 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&q=80'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <div style={{ padding: '12px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                        {exp[nameField] || exp.name_en}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#8A8578', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {exp[descField] || exp.description_en}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#C5A55A', fontWeight: '600' }}>
                          {exp.duration || ''}
                        </span>
                        <span style={{ fontSize: '11px', color: '#8A8578' }}>
                          {exp.price_range || ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Events */}
        {guideContent?.events && guideContent.events.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              {t.events || 'Events'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {guideContent.events.map((event, idx) => {
                const nameField = `name_${lang}` || 'name_en';
                const descField = `description_${lang}` || 'description_en';
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      background: '#FFFFFF',
                      border: '1px solid #E8E0D5',
                      borderRadius: '8px',
                      display: 'flex',
                      gap: '12px',
                    }}
                  >
                    <Ticket size={20} style={{ color: '#C5A55A', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                        {event[nameField] || event.name_en}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#8A8578', marginBottom: '4px' }}>
                        {event[descField] || event.description_en}
                      </p>
                      <div style={{ fontSize: '12px', color: '#C5A55A', fontWeight: '500' }}>
                        {event.date} • {event.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Services */}
        {guideContent?.services && guideContent.services.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              {t.concierge || 'Concierge Services'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {guideContent.services.map((service, idx) => {
                const nameField = `name_${lang}` || 'name_en';
                const descField = `description_${lang}` || 'description_en';
                const iconMap = {
                  spa: Flower2,
                  taxi: MapPin,
                  chef: Utensils,
                  guide: Compass,
                  massage: Heart,
                };
                const Icon = iconMap[service.icon] || Heart;

                return (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      background: '#FFFFFF',
                      border: '1px solid #E8E0D5',
                      borderRadius: '8px',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Icon size={20} style={{ color: '#C5A55A', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                        {service[nameField] || service.name_en}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#8A8578', marginBottom: '8px' }}>
                        {service[descField] || service.description_en}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#C5A55A' }}>
                          {service.price_label || 'Contact us'}
                        </span>
                        <button
                          onClick={() => handleRequestService(service)}
                          style={{
                            padding: '6px 12px',
                            background: 'transparent',
                            color: '#C5A55A',
                            border: '1px solid #C5A55A',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#C5A55A';
                            e.target.style.color = '#0F1923';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#C5A55A';
                          }}
                        >
                          {t.book || 'Book'} <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Host Card */}
        <div style={{ marginBottom: '20px', padding: '20px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E8E0D5' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            {t.hostSupport || 'Host Support'}
          </h3>
          <p style={{ fontSize: '13px', color: '#8A8578', marginBottom: '16px' }}>
            {t.hostSupportText || 'Have questions? Reach out to your host anytime.'}
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href={`tel:${reservation.listing?.hostPhone || '+212612345678'}`}
              style={{
                flex: 1,
                padding: '12px',
                background: '#0F1923',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Phone size={16} />
              {t.call || 'Call'}
            </a>
            <a
              href={`https://wa.me/${reservation.listing?.hostPhone?.replace(/\D/g, '') || '212612345678'}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: '12px',
                background: '#25D366',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>

        {/* House Rules */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            {t.houseRules || 'House Rules'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: t.poolHours || 'Pool Hours', value: '8am - 6pm' },
              { label: t.quietHours || 'Quiet Hours', value: '10pm - 8am' },
              { label: t.noSmoking || 'No Smoking', value: t.indoors || 'Indoors' },
              { label: t.shoes || 'Shoes', value: t.removeInBedrooms || 'Remove in bedrooms' },
            ].map((rule, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  background: '#FFFFFF',
                  border: '1px solid #E8E0D5',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: '500' }}>{rule.label}</span>
                <span style={{ fontSize: '12px', color: '#8A8578' }}>{rule.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Practical Info */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            {t.practicalInfo || 'Practical Information'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: t.currency || 'Currency', value: 'MAD' },
              { label: t.tipping || 'Tipping', value: t.notExpected || 'Not expected' },
              { label: t.dressCode || 'Dress Code', value: t.casual || 'Casual - respectful' },
              { label: t.water || 'Water', value: t.safeTodrink || 'Safe to drink' },
              { label: t.taxis || 'Taxis', value: 'Very affordable' },
              { label: t.pharmacy || 'Pharmacy', value: '500m nearby' },
            ].map((info, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  background: '#FFFFFF',
                  border: '1px solid #E8E0D5',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: '500' }}>{info.label}</span>
                <span style={{ fontSize: '12px', color: '#8A8578' }}>{info.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency */}
        <div style={{ marginBottom: '20px', padding: '16px', background: '#FFF5F5', borderRadius: '8px', border: '1px solid #FFE8E8' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} style={{ color: '#FF3B30' }} />
            {t.emergency || 'Emergency'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div>
              <strong>{t.police || 'Police'}:</strong> 19
            </div>
            <div>
              <strong>{t.ambulance || 'Ambulance'}:</strong> 15
            </div>
            <div>
              <strong>{t.fire || 'Fire'}:</strong> 15
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div style={{ marginBottom: '20px', padding: '16px', background: '#FFFFFF', border: '1px solid #E8E0D5', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            {t.howWasStay || "How's your stay?"}
          </h3>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {['😞', '😐', '😊', '😄', '🤩'].map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => handleFeedback(idx + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  opacity: feedbackRating === null || feedbackRating === idx + 1 ? 1 : 0.5,
                }}
                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.2)')}
                onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
              >
                {emoji}
              </button>
            ))}
          </div>
          {feedbackRating && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#C5A55A' }}>
              {t.thankYou || 'Thank you for your feedback!'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ paddingBottom: '100px', textAlign: 'center', borderTop: '1px solid #E8E0D5', paddingTop: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>
              HAVN STAYS
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.5px', color: '#8A8578' }}>
              by Medini Homes
            </div>
          </div>
          <button
            onClick={onBack}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              color: '#C5A55A',
              border: '1px solid #C5A55A',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            {t.changeReservation || 'Change Reservation'}
          </button>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${reservation.listing?.hostPhone?.replace(/\D/g, '') || '212612345678'}?text=${encodeURIComponent(
          `Hi, I have a question about my stay at ${reservation.listing?.name}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: isRTL ? 'auto' : '20px',
          left: isRTL ? '20px' : 'auto',
          width: '56px',
          height: '56px',
          background: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
          transition: 'all 0.3s',
          zIndex: 999,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
        }}
      >
        <MessageCircle size={28} color="#FFFFFF" />
      </a>

      {/* Service Request Modal */}
      {showServiceModal && selectedService && (
        <ServiceRequestModal
          service={selectedService}
          reservation={reservation}
          lang={lang}
          onClose={() => {
            setShowServiceModal(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// SERVICE REQUEST MODAL
// ============================================================================

const ServiceRequestModal = ({ service, reservation, lang, onClose }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const t = translations[lang] || translations.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await requestService({
        reservationId: reservation.id,
        guestName: reservation.guestName,
        guestPhone: reservation.guestPhone,
        listingName: reservation.listing?.name,
        serviceName: service.name,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Service request error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: '0',
        background: 'rgba(15, 25, 35, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
            {t.bookService || 'Book Service'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#8A8578',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✓</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F1923' }}>
              {t.requestSubmitted || 'Request submitted!'}
            </div>
            <div style={{ fontSize: '13px', color: '#8A8578', marginTop: '8px' }}>
              {t.hostWillConfirm || 'Your host will confirm shortly.'}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                {t.service || 'Service'}
              </label>
              <input
                type="text"
                value={service.name}
                disabled
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #E8E0D5',
                  borderRadius: '4px',
                  fontSize: '13px',
                  background: '#F5F0EB',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                {t.date || 'Date'}
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #E8E0D5',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                {t.time || 'Time'}
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #E8E0D5',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                {t.notes || 'Additional Notes'}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t.optionalInfo || 'Optional information...'}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #E8E0D5',
                  borderRadius: '4px',
                  fontSize: '13px',
                  minHeight: '80px',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: '1px solid #E8E0D5',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#0F1923',
                }}
              >
                {t.cancel || 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#C5A55A',
                  color: '#0F1923',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  opacity: loading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {loading ? t.submitting : t.submit} {!loading && <Send size={14} />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState('lookup');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReservationFound = (reservation, lang) => {
    setSelectedReservation(reservation);
    setCurrentLang(lang);
    setState('guide');
  };

  const handleBack = () => {
    setState('lookup');
    setSelectedReservation(null);
  };

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
  };

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#0F1923', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#C5A55A', fontSize: '24px', fontWeight: '700', letterSpacing: '3px' }}>HAVN STAYS</div>
      </div>
    );
  }

  return state === 'lookup' ? (
    <LookupScreen
      onReservationFound={handleReservationFound}
      onLanguageChange={handleLanguageChange}
      currentLang={currentLang}
    />
  ) : (
    <GuideScreen
      reservation={selectedReservation}
      onBack={handleBack}
      lang={currentLang}
    />
  );
}
