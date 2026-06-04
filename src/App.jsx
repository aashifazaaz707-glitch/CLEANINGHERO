import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Search, 
  Star, 
  Clock, 
  Check, 
  X, 
  ShoppingCart, 
  Phone, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  Info, 
  Sparkles,
  MessageSquare,
  Bookmark,
  Trash2,
  MessageCircle,
  Users,
  CheckCircle2
} from 'lucide-react';

const CATEGORIES = [
  { id: "tank", label: "Tank Clean", image: "https://images.unsplash.com/photo-1584486520270-19eca1efcce5?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "ac", label: "AC Repair", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "sofa", label: "Sofa Wash", image: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "ro", label: "RO Purifier", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "home", label: "Deep Clean", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "electric", label: "Electrician", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "septic", label: "Septic Tank", image: "https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "solar", label: "Solar Panel", image: "https://images.unsplash.com/photo-1509391366360-1e97d5261688?auto=format&fit=crop&w=150&h=150&q=80" },
];

const SERVICES_DATABASE = [
  {
    id: "sofa",
    name: "Sofa Cleaning",
    rating: 4.9,
    reviews: 124,
    time: "60-90 Min",
    teamSize: "1 Hero Pro Team",
    priceText: "Starts from ₹499",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=400",
    description: "Multi-stage shampoo wash to extract grease, sweat stains, and dust.",
    badges: ["Best Value", "Same Day"],
    highlights: ["Deep Scrubbing", "Sanitization"],
    variants: [
      { id: "s_3seat", name: "3 Seater Sofa", price: 499 },
      { id: "s_5seat", name: "5 Seater Sofa", price: 899 }
    ]
  },
  {
    id: "septic",
    name: "Septic Tank Cleaning",
    rating: 4.9,
    reviews: 82,
    time: "4-5 Hour",
    teamSize: "3 Hero Pro Team",
    priceText: "Starts from ₹1999",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
    description: "Professional sludge pumping and safe disposal.",
    badges: ["Best Value", "Same Day"],
    highlights: ["Deep Scrubbing", "Sanitization"],
    variants: [
      { id: "septic_std", name: "Standard Tank", price: 1999 },
      { id: "septic_lrg", name: "Large Tank", price: 2999 }
    ]
  },
  {
    id: "solar",
    name: "Solar Panel Cleaning",
    rating: 4.9,
    reviews: 51,
    time: "45-60 Min",
    teamSize: "2 Hero Pro Team",
    priceText: "Starts from ₹799",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400",
    description: "Increase energy efficiency with dust and debris removal.",
    badges: ["Best Value", "Same Day"],
    highlights: ["Professional Equipment", "Eco-friendly Chemicals"],
    variants: [
      { id: "solar_1", name: "Up to 5 Panels", price: 799 },
      { id: "solar_2", name: "6 to 10 Panels", price: 1299 }
    ]
  },
  {
    id: "aquarium",
    name: "Aquarium Cleaning",
    rating: 5.0,
    reviews: 19,
    time: "30-45 Minutes",
    teamSize: "1 Hero Pro Team",
    priceText: "Starts from ₹499",
    image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=400",
    description: "Comprehensive tank wash and water conditioning.",
    badges: ["Trending"],
    highlights: ["Deep Scrubbing", "Sanitization"],
    variants: [
      { id: "aq_sml", name: "Small Tank", price: 499 },
      { id: "aq_lrg", name: "Large Tank", price: 799 }
    ]
  },
  {
    id: "tank",
    name: "Water Tank Cleaning",
    rating: 5.0,
    reviews: 6,
    time: "30-45 min",
    teamSize: "2 Hero Pro Team",
    priceText: "Starts from ₹499",
    image: "https://pub-b10e6c23639e487cbdffb78ad4b06d68.r2.dev/clean-tank-img.jpeg",
    description: "Deep chemical sanitization using state of the art vacuum pumping machine.",
    badges: ["Bestseller", "Same Day"],
    highlights: ["Sludge pumping", "Anti-bacterial coating"],
    variants: [
      { id: "t_500", name: "500L Tank", price: 499 },
      { id: "t_1000", name: "1000L Tank", price: 799 },
      { id: "t_1500", name: "1500L Tank", price: 1099 }
    ]
  }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // Checkout checkout modal
  const [checkoutStep, setCheckoutStep] = useState(1); // Steps: 1 (Schedule), 2 (Info), 3 (Confirm Summary)
  
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  // Scroll tracking for header
  const [isScrolled, setIsScrolled] = useState(false);

  // Form Details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const sliderContainerRef = useRef(null);

  // Filter trending list based on search query
  const displayedServices = SERVICES_DATABASE.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Cart parsing logic
  const addedItems = Object.entries(cart).map(([key, item]) => {
    const [serviceId, variantId] = key.split('_v_');
    const service = SERVICES_DATABASE.find(s => s.id === serviceId);
    const variant = service?.variants.find(v => v.id === variantId);
    return {
      key,
      service,
      variant,
      qty: item.qty,
      price: variant ? variant.price : 0
    };
  }).filter(item => item.service && item.variant);

  const subtotal = addedItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const totalQty = addedItems.reduce((acc, curr) => acc + curr.qty, 0);
  const convenienceFee = subtotal > 0 ? 39 : 0;
  const grandTotal = subtotal + convenienceFee;

  const updateCartQty = (serviceId, variantId, change) => {
    const key = `${serviceId}_v_${variantId}`;
    setCart(prev => {
      const updated = { ...prev };
      const currentQty = updated[key]?.qty || 0;
      const newQty = currentQty + change;
      if (newQty <= 0) {
        delete updated[key];
      } else {
        updated[key] = { qty: newQty };
      }
      return updated;
    });
  };

  const getQty = (serviceId, variantId) => {
    const key = `${serviceId}_v_${variantId}`;
    return cart[key]?.qty || 0;
  };

  const handleCategoryClick = (categoryId) => {
    setIsCheckoutOpen(true);
    setCheckoutStep(1);
  };

  // Slider actions
  const handleSliderMove = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouch = (e) => {
    if (e.touches && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setDragging(false);
    const handleMouseMove = (e) => {
      if (dragging) {
        handleSliderMove(e.clientX);
      }
    };
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dragging]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 80) {
        setIsScrolled(true);
      } else if (scrollY < 20) {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const submitBooking = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!name || !phone || !address || !date || !timeSlot) {
      alert("Please complete the slot selection and customer information details first.");
      return;
    }

    const itemsSummary = addedItems.map(i => 
      `• ${i.service.name} (${i.variant.name}) x${i.qty} - ₹${i.price * i.qty}`
    ).join("\n");

    const messageText = `*CLEANING HERO BOOKING DETAILS*\n\n` +
      `*Customer Info:*\n` +
      `Name: ${name}\n` +
      `Contact: ${phone}\n` +
      `Location: ${address}\n\n` +
      `*Preferred Slot:*\n` +
      `Date: ${date}\n` +
      `Time: ${timeSlot}\n\n` +
      `*Services Requested:*\n${itemsSummary}\n\n` +
      `*Convenience Fee:* ₹${convenienceFee}\n` +
      `*Final Est. Billing: ₹${grandTotal}*\n\n` +
      `Kindly confirm this booking reservation request.`;

    window.open(`https://wa.me/919031116900?text=${encodeURIComponent(messageText)}`, '_blank');
    
    // Clear state
    setCart({});
    setName("");
    setPhone("");
    setAddress("");
    setDate("");
    setTimeSlot("");
    setIsCheckoutOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Header */}
      <header className={`uc-header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="container header-grid-anim">
          <a href="#" className="uc-brand-logo">
            <img src="https://cleaninghero.in/cleaning-hero-logo.png" className="uc-logo-img" alt="Cleaning Hero Logo" />
          </a>

          {/* Compact search bar */}
          <div className="uc-search-container">
            <Search size={16} className="uc-search-icon" />
            <input 
              type="text" 
              placeholder="Search services..." 
              className="uc-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Top Right Book Now Button */}
          <button className="uc-book-now-btn" onClick={() => {
            setIsCheckoutOpen(true);
            setCheckoutStep(1);
          }}>
            Book Now
          </button>
        </div>
      </header>

      {/* Promo Banners Grid */}
      <section className="uc-promo-section">
        <div className="container">
          <div className="uc-promo-grid">
            <div 
              className="uc-promo-banner" 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600')` }}
            >
              <div className="uc-promo-content">
                <div className="uc-promo-title">Up to 25% Off AC Service</div>
                <div className="uc-promo-subtitle">Clean filters and boost cooling output instantly.</div>
              </div>
            </div>

            <div 
              className="uc-promo-banner" 
              style={{ backgroundImage: `url('https://pub-b10e6c23639e487cbdffb78ad4b06d68.r2.dev/clean-tank-img.jpeg')` }}
            >
              <div className="uc-promo-content">
                <div className="uc-promo-title">Pure Tank Guarantee</div>
                <div className="uc-promo-subtitle">Full machine-based vacuum cleaning from ₹499.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Services Categories */}
      <section className="uc-categories-container">
        <div className="container">
          <div className="uc-categories-grid">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id} 
                className="uc-category-btn"
                onClick={() => handleCategoryClick(cat.id)}
              >
                <div className="uc-category-icon-box" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={cat.image} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span className="uc-category-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Services Grid */}
      <section className="uc-section">
        <div className="container">
          <div className="uc-section-header">
            <h2 className="uc-section-title">Trending Home Services</h2>
          </div>

          <div className="uc-services-grid">
            {displayedServices.map(service => (
              <div key={service.id} className="uc-scroller-card" onClick={() => { setIsCheckoutOpen(true); setCheckoutStep(1); }}>
                <div className="uc-scroller-img-wrap">
                  <div className="uc-scroller-img" style={{ backgroundImage: `url(${service.image})` }}></div>
                  {service.badges && service.badges.length > 0 && (
                    <div className="uc-badges-container">
                      {service.badges.map(b => (
                        <span key={b} className={b === 'Same Day' ? "uc-badge time" : "uc-badge"}>{b}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="uc-scroller-info">
                  <div className="uc-scroller-header">
                    <h3 className="uc-scroller-name">{service.name}</h3>
                    <div className="uc-scroller-rating">
                      <Star size={12} fill="currentColor" /> {service.rating}
                    </div>
                  </div>
                  
                  {service.highlights && (
                    <ul className="uc-highlights">
                      {service.highlights.map((hl, i) => (
                        <li key={i}><CheckCircle2 size={12} className="highlight-icon" /> {hl}</li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="uc-meta-row">
                    <span className="meta-item"><Clock size={12} /> {service.time}</span>
                    <span className="meta-item"><Users size={12} /> {service.teamSize || "1 Hero Pro Team"}</span>
                  </div>
                  
                  <div className="uc-scroller-footer">
                    <div className="price-block">
                      <small>Starts from</small>
                      <span className="uc-scroller-price">{service.priceText.replace("Starts from ", "")}</span>
                    </div>
                    <button className="uc-book-btn-premium" onClick={(e) => {
                      e.stopPropagation();
                      setIsCheckoutOpen(true);
                      setCheckoutStep(1);
                    }}>Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After Drag Slider widget (Water Tank Cleaned vs Dirty comparison) */}
      <section className="uc-section">
        <div className="container">
          <div className="uc-slider-layout">
            <div className="uc-slider-card">
              <div 
                className="uc-slider-container"
                ref={sliderContainerRef}
                onTouchMove={handleTouch}
              >
                {/* Background: Dirty tank (Before) */}
                <img 
                  className="uc-slider-img-background"
                  src="https://pub-b10e6c23639e487cbdffb78ad4b06d68.r2.dev/dirty-tank-img.jpeg"
                  alt="Dirty Tank Before"
                  draggable={false}
                />
                
                {/* Foreground: Clean tank (After) with clip path */}
                <img 
                  className="uc-slider-img-foreground"
                  src="https://pub-b10e6c23639e487cbdffb78ad4b06d68.r2.dev/clean-tank-img.jpeg"
                  alt="Clean Tank After"
                  draggable={false}
                  style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                />

                <div 
                  className="uc-slider-bar"
                  style={{ left: `${sliderPos}%` }}
                  onMouseDown={() => setDragging(true)}
                >
                  <div className="uc-slider-handle">↔</div>
                </div>
              </div>
              <div className="uc-slider-info">
                <h4 className="uc-slider-title">Expert Water Tank Deep Cleaning</h4>
                <p className="uc-slider-desc">Drag the separator bar to see our water tank cleaning difference.</p>
              </div>
            </div>

            <div>
              <h2 className="uc-section-title" style={{ marginBottom: '1rem' }}>See the Cleaning Hero Magic</h2>
              <p style={{ color: 'var(--brand-gray-medium)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Our technician experts are armed with commercial high-suction extractors, cleaning shampoo disinfectants, and high-pressure steam washers. We don't just clean, we restore the factory shine of your home items.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="uc-btn-primary" onClick={() => {
                  setIsCheckoutOpen(true);
                  setCheckoutStep(1);
                }}>
                  <Sparkles size={16} /> Select Cleaning Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safe badges */}
      <section className="uc-section">
        <div className="container">
          <div className="uc-section-header">
            <h2 className="uc-section-title">Safe and Certified Quality Assurances</h2>
          </div>
          <div className="uc-trust-grid">
            <div className="uc-trust-item">
              <ShieldCheck size={28} className="uc-trust-icon" />
              <div className="uc-trust-info">
                <h5>100% Safe Work</h5>
                <p>Skin-safe non toxic solutions verified for babies and pets.</p>
              </div>
            </div>
            <div className="uc-trust-item">
              <Sparkles size={28} className="uc-trust-icon" />
              <div className="uc-trust-info">
                <h5>Premium Tools</h5>
                <p>Equipped with vacuum pumps and jet systems.</p>
              </div>
            </div>
            <div className="uc-trust-item">
              <ShieldCheck size={28} className="uc-trust-icon" />
              <div className="uc-trust-info">
                <h5>Insured Clean</h5>
                <p>Rest assured, all work is done under damage insurance protection.</p>
              </div>
            </div>
            <div className="uc-trust-item">
              <Sparkles size={28} className="uc-trust-icon" />
              <div className="uc-trust-info">
                <h5>Re-wash Guarantee</h5>
                <p>If not 100% satisfied, we will re-wash for free.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Can't Find What You're Looking For / WhatsApp CTA */}
      <section className="uc-section" style={{ backgroundColor: 'var(--brand-white)' }}>
        <div className="container">
          <div className="uc-whatsapp-cta">
            <div className="uc-whatsapp-content">
              <h3>Can't find what you are looking for?</h3>
              <p>Connect with our expert support team directly on WhatsApp for custom requests and immediate assistance.</p>
            </div>
            <a 
              href="https://wa.me/919031116900?text=Hi%20Cleaning%20Hero,%20I%20have%20a%20custom%20service%20request." 
              target="_blank" 
              rel="noreferrer"
              className="uc-whatsapp-btn"
            >
              <MessageCircle size={20} />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="uc-footer">
        <div className="container">
          <div className="uc-footer-grid">
            <div className="uc-footer-brand">
              <h4>Cleaning Hero</h4>
              <p>Darbhanga's professional home services utility booking application. Serving Mirzapur, LNMU Campus, and surrounding Bihar neighborhoods with reliable work.</p>
              <div style={{ marginTop: '1.25rem' }}>
                <a href="tel:+919031116900" style={{ color: 'var(--brand-blue)', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} /> <span>Customer Care Support: +91 90311 16900</span>
                </a>
              </div>
            </div>
            <div className="uc-footer-col">
              <h5>Services</h5>
              <ul className="uc-footer-links">
                <li><a href="#">Water Tank Cleaning</a></li>
                <li><a href="#">AC Jet Servicing</a></li>
                <li><a href="#">Sofa Dry Clean</a></li>
              </ul>
            </div>
            <div className="uc-footer-col">
              <h5>Repairs</h5>
              <ul className="uc-footer-links">
                <li><a href="#">RO Purifier Repair</a></li>
                <li><a href="#">Electrician Fitting</a></li>
                <li><a href="#">Septic Tank Suction</a></li>
              </ul>
            </div>
            <div className="uc-footer-col">
              <h5>Head Office</h5>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                Cleaning Hero Office,<br />
                Mirzapur Road (Near LNMU),<br />
                Darbhanga, Bihar 846004
              </p>
            </div>
          </div>
          <div className="uc-footer-bottom">
            <p>© 2026 Cleaning Hero. Designed to be premium and fully responsive.</p>
            <p>Support: +91 90311 16900</p>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Cart Bar */}
      {totalQty > 0 && !isCheckoutOpen && (
        <div className="checkout-bar-sticky">
          <div className="checkout-bar-left">
            <span className="checkout-bar-qty">{totalQty} item selected</span>
            <span className="checkout-bar-price">₹{grandTotal}</span>
          </div>
          <button className="btn-checkout-trigger" onClick={() => { setIsCheckoutOpen(true); setCheckoutStep(1); }}>
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* Shopify-Style Multistep Checkout Modal Overlay */}
      {isCheckoutOpen && (
        <div className="checkout-modal-overlay">
          <div className="checkout-modal-container">
            <div className="checkout-modal-header">
              <img src="https://cleaninghero.in/cleaning-hero-logo.png" className="checkout-logo" alt="Logo" />
              <button className="checkout-close-btn" onClick={() => setIsCheckoutOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="checkout-wizard-grid">
              {/* Left Column: Multistep configuration form content */}
              <div className="checkout-wizard-body">
                {/* Step indicator header */}
                <div className="checkout-step-progress-header">
                  <span>Step {checkoutStep} of 4</span>
                  <span>
                    {checkoutStep === 1 && "Choose Services"}
                    {checkoutStep === 2 && "Choose Appointment Slot"}
                    {checkoutStep === 3 && "Billing Address"}
                    {checkoutStep === 4 && "Confirm Booking"}
                  </span>
                </div>

                {/* Form Step Content */}
                {checkoutStep === 1 && (
                  <div>
                    <h3 className="checkout-step-title">Select Services</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '55vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                      {SERVICES_DATABASE.map(service => (
                        <div key={service.id} style={{ border: '1px solid var(--brand-border)', borderRadius: 'var(--radius-md)', padding: '1rem', backgroundColor: 'var(--brand-gray-light)' }}>
                          <h4 style={{ fontWeight: 800, marginBottom: '0.75rem', color: 'var(--brand-navy)' }}>{service.name}</h4>
                          {service.variants.map(v => {
                            const qty = cart[`${service.id}_v_${v.id}`]?.qty || 0;
                            return (
                              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', backgroundColor: 'var(--brand-white)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{v.name} - ₹{v.price}</span>
                                {qty > 0 ? (
                                  <div className="uc-qty-selector">
                                    <button className="uc-qty-btn" onClick={() => updateCartQty(service.id, v.id, -1)}>-</button>
                                    <span className="uc-qty-val">{qty}</span>
                                    <button className="uc-qty-btn" onClick={() => updateCartQty(service.id, v.id, 1)}>+</button>
                                  </div>
                                ) : (
                                  <button className="uc-add-btn-small" onClick={() => updateCartQty(service.id, v.id, 1)}>ADD</button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div>
                    <h3 className="checkout-step-title">Select Appointment Schedule</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="uc-input-group">
                        <label className="uc-input-label">Preferred Date</label>
                        <input 
                          type="date" 
                          required
                          className="uc-input"
                          value={date}
                          onChange={e => setDate(e.target.value)}
                        />
                      </div>

                      <div className="uc-input-group">
                        <label className="uc-input-label">Preferred Time Slot</label>
                        <div className="uc-slots-grid">
                          {["Morning (8AM-11AM)", "Afternoon (12PM-3PM)", "Evening (4PM-7PM)"].map(slot => (
                            <div 
                              key={slot}
                              className={`uc-slot-btn ${timeSlot === slot ? 'active' : ''}`}
                              onClick={() => setTimeSlot(slot)}
                            >
                              {slot.split(" ")[0]}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div>
                    <h3 className="checkout-step-title">Contact & Location Info</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div className="uc-input-group">
                        <label className="uc-input-label">Your Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Your Name" 
                          required
                          className="uc-input"
                          value={name}
                          onChange={e => setName(e.target.value)}
                        />
                      </div>

                      <div className="uc-input-group">
                        <label className="uc-input-label">WhatsApp Mobile Number</label>
                        <input 
                          type="tel" 
                          placeholder="e.g. 9031116900" 
                          required
                          className="uc-input"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                        />
                      </div>

                      <div className="uc-input-group">
                        <label className="uc-input-label">Full Address in Darbhanga</label>
                        <textarea 
                          rows={3}
                          placeholder="Street, landmarks, house number..."
                          required
                          className="uc-input"
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {checkoutStep === 4 && (
                  <div>
                    <h3 className="checkout-step-title">Review & Place Reservation</h3>
                    <div className="uc-trust-item" style={{ flexDirection: 'row', textAlign: 'left', gap: '1rem', padding: '1rem' }}>
                      <ShieldCheck size={28} className="uc-trust-icon" />
                      <div>
                        <h5 style={{ fontSize: '0.9rem' }}>No Advance Payment Required</h5>
                        <p style={{ fontSize: '0.75rem', marginTop: '0.15rem' }}>Payment is collected only after the service is fully completed at your doorstep.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer buttons actions inside wizard (Steps 1, 2, & 3 only) */}
                {checkoutStep < 4 && (
                  <div className="checkout-wizard-footer">
                    {checkoutStep > 1 ? (
                      <button type="button" className="btn-wizard-back" onClick={() => setCheckoutStep(prev => prev - 1)}>
                        Back
                      </button>
                    ) : (
                      <button type="button" className="btn-wizard-back" onClick={() => setIsCheckoutOpen(false)}>
                        Cancel
                      </button>
                    )}
                    <button 
                      type="button" 
                      className="btn-wizard-next" 
                      onClick={() => {
                        if (checkoutStep === 1 && totalQty === 0) {
                          alert("Please select at least one service to continue!");
                          return;
                        }
                        if (checkoutStep === 2 && (!date || !timeSlot)) {
                          alert("Please select a date and preferred time slot!");
                          return;
                        }
                        if (checkoutStep === 3 && (!name || !phone || !address)) {
                          alert("Please fill out all address and contact details!");
                          return;
                        }
                        setCheckoutStep(prev => prev + 1);
                      }}
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Dynamic Shopify Style Cart Summary panel */}
              <div className={`checkout-wizard-sidebar ${checkoutStep < 4 ? 'mobile-hidden' : ''}`}>
                <h3 className="shopify-checkout-summary-title">Order Summary</h3>
                
                {addedItems.length === 0 ? (
                  <p style={{ color: 'var(--brand-gray-medium)', fontSize: '0.85rem' }}>No items selected yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: '1' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {addedItems.map(item => (
                        <div key={item.key} className="shopify-summary-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span className="shopify-summary-item-name" style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.service.name}</span>
                            <div className="shopify-summary-item-desc" style={{ color: 'var(--brand-gray-medium)', fontSize: '0.8rem' }}>
                              {item.variant.name} (x{item.qty})
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontWeight: '800' }}>₹{item.price * item.qty}</span>
                            <button 
                              onClick={() => updateCartQty(item.service.id, item.variant.id, -item.qty)}
                              style={{ color: '#ef4444', display: 'flex', alignItems: 'center' }}
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Schedule detail recap */}
                    {(date || timeSlot) && (
                      <div style={{ borderTop: '1px solid var(--brand-border)', paddingTop: '1rem', fontSize: '0.8rem' }}>
                        <div style={{ fontWeight: 800, marginBottom: '0.25rem' }}>Schedule Slot</div>
                        {date && <div>Date: {date}</div>}
                        {timeSlot && <div>Time: {timeSlot}</div>}
                      </div>
                    )}

                    {/* Customer detail recap */}
                    {name && (
                      <div style={{ borderTop: '1px solid var(--brand-border)', paddingTop: '1rem', fontSize: '0.8rem' }}>
                        <div style={{ fontWeight: 800, marginBottom: '0.25rem' }}>Booking Address</div>
                        <div>{name} ({phone})</div>
                        <div style={{ wordBreak: 'break-all' }}>{address}</div>
                      </div>
                    )}

                    <div className="uc-bill-box">
                      <div className="uc-bill-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="uc-bill-row">
                        <span>Convenience fee</span>
                        <span>₹{convenienceFee}</span>
                      </div>
                      <div className="uc-bill-row uc-bill-total">
                        <span>Total Payable</span>
                        <span>₹{grandTotal}</span>
                      </div>
                    </div>

                      {checkoutStep === 4 && (
                        <div className="checkout-wizard-footer" style={{ marginTop: 'auto', backgroundColor: 'var(--brand-gray-light)' }}>
                        <button type="button" className="btn-wizard-back" onClick={() => setCheckoutStep(prev => prev - 1)}>
                          Back
                        </button>
                        <button type="button" className="btn-wizard-next" onClick={submitBooking}>
                          Place Booking Order
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
