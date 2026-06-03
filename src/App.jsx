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
  Bookmark
} from 'lucide-react';

const CATEGORIES = [
  { id: "tank", label: "Tank Clean", icon: "🛢️" },
  { id: "ac", label: "AC Repair", icon: "❄️" },
  { id: "sofa", label: "Sofa Wash", icon: "🛋️" },
  { id: "ro", label: "RO Purifier", icon: "💧" },
  { id: "home", label: "Deep Clean", icon: "🏠" },
  { id: "electric", label: "Electrician", icon: "⚡" },
  { id: "septic", label: "Septic Tank", icon: "🚛" },
  { id: "solar", label: "Solar Panel", icon: "☀️" },
];

const SERVICES_DATABASE = [
  {
    id: "tank",
    name: "Water Tank Cleaning",
    rating: 5.0,
    reviews: 6,
    time: "30-45 min",
    priceText: "₹499 onwards",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
    description: "Deep chemical sanitization using state of the art vacuum pumping machine.",
    whatsIncluded: [
      "Sludge and sediment pumping",
      "High-pressure wall scrubbing",
      "Eco-friendly anti-bacterial coating"
    ],
    whatsExcluded: [
      "Plumbing repairs",
      "Exterior tank washing"
    ],
    variants: [
      { id: "t_500", name: "500L Tank Capacity", price: 499 },
      { id: "t_1000", name: "1000L Tank Capacity", price: 799 },
      { id: "t_1500", name: "1500L Tank Capacity", price: 1099 }
    ]
  },
  {
    id: "ac",
    name: "AC Jet Service",
    rating: 4.9,
    reviews: 62,
    time: "40 min",
    priceText: "₹399 onwards",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=400",
    description: "High pressure power-jet deep wash for filters and cooling coils.",
    whatsIncluded: [
      "Indoor filter & coil jet washing",
      "Drain pipe block clearance",
      "Refrigerant gas checkup"
    ],
    whatsExcluded: [
      "Gas refilling",
      "Spare part replacement"
    ],
    variants: [
      { id: "ac_split", name: "Split AC Jet Service", price: 399 },
      { id: "ac_window", name: "Window AC Service", price: 299 }
    ]
  },
  {
    id: "sofa",
    name: "Sofa Dry Cleaning",
    rating: 4.9,
    reviews: 19,
    time: "60-90 min",
    priceText: "₹199 / Seat",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=400",
    description: "Multi-stage shampoo wash to extract grease, sweat stains, and dust.",
    whatsIncluded: [
      "High-suction dry vacuuming",
      "Upholstery scrub shampooing",
      "Moisture extraction & deodorizer"
    ],
    whatsExcluded: [
      "Leather polishing"
    ],
    variants: [
      { id: "s_3seat", name: "3 Seater Sofa Cleaning", price: 599 },
      { id: "s_5seat", name: "5 Seater Sofa Cleaning", price: 999 }
    ]
  },
  {
    id: "ro",
    name: "RO Purifier Repair",
    rating: 4.8,
    reviews: 54,
    time: "30 min",
    priceText: "₹149 onwards",
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=400",
    description: "Complete TDS testing and multi-stage filter cleaning checkup.",
    whatsIncluded: [
      "TDS levels water evaluation",
      "Inside storage tank cleaning",
      "Leakage fix diagnostics"
    ],
    whatsExcluded: [
      "Membrane replacement spares cost"
    ],
    variants: [
      { id: "ro_diag", name: "RO General Diagnostics", price: 149 },
      { id: "ro_filt", name: "RO Filter Cartridge Clean", price: 499 }
    ]
  }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1); // Steps: 1 (Services), 2 (Schedule), 3 (Info), 4 (Summary)
  
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  // Form Details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const sliderContainerRef = useRef(null);

  // Filter trending list based on search bar query
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

  // Add default variant to cart on click
  const handleServiceAdd = (service) => {
    if (service.variants && service.variants.length > 0) {
      const firstVariant = service.variants[0];
      const key = `${service.id}_v_${firstVariant.id}`;
      // Add if not already selected
      if (!cart[key]) {
        updateCartQty(service.id, firstVariant.id, 1);
      }
    }
    setIsWizardOpen(true);
    setWizardStep(1);
  };

  const handleCategoryClick = (categoryId) => {
    const service = SERVICES_DATABASE.find(s => s.id === categoryId);
    if (service) {
      handleServiceAdd(service);
    } else {
      setIsWizardOpen(true);
      setWizardStep(1);
    }
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
    setIsWizardOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="uc-header">
        <div className="container">
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
          <button className="uc-book-now-btn" onClick={() => { setIsWizardOpen(true); setWizardStep(1); }}>
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
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600')` }}
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
                <div className="uc-category-icon-box">{cat.icon}</div>
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
              <div key={service.id} className="uc-scroller-card" onClick={() => handleServiceAdd(service)}>
                <div className="uc-scroller-img" style={{ backgroundImage: `url(${service.image})` }}></div>
                <div className="uc-scroller-info">
                  <h3 className="uc-scroller-name">{service.name}</h3>
                  <div className="uc-scroller-rating">
                    <Star size={12} fill="currentColor" />
                    <span>{service.rating} ({service.reviews} reviews)</span>
                  </div>
                  <div className="uc-scroller-footer">
                    <span className="uc-scroller-price">{service.priceText}</span>
                    <button className="uc-add-btn-small" onClick={(e) => {
                      e.stopPropagation();
                      handleServiceAdd(service);
                    }}>ADD</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After Drag Slider widget */}
      <section className="uc-section">
        <div className="container">
          <div className="uc-slider-layout">
            <div className="uc-slider-card">
              <div 
                className="uc-slider-container"
                ref={sliderContainerRef}
                onTouchMove={handleTouch}
              >
                <div 
                  className="uc-slider-img"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=600')` }}
                ></div>
                
                <div 
                  className="uc-slider-img"
                  style={{ 
                    backgroundImage: `url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600')`,
                    width: `${sliderPos}%`
                  }}
                ></div>

                <div 
                  className="uc-slider-bar"
                  style={{ left: `${sliderPos}%` }}
                  onMouseDown={() => setDragging(true)}
                >
                  <div className="uc-slider-handle">↔</div>
                </div>
              </div>
              <div className="uc-slider-info">
                <h4 className="uc-slider-title">Expert Sofa Stain & Dust Extraction</h4>
                <p className="uc-slider-desc">Drag the separator bar to see our sofa cleaning difference.</p>
              </div>
            </div>

            <div>
              <h2 className="uc-section-title" style={{ marginBottom: '1rem' }}>See the Cleaning Hero Magic</h2>
              <p style={{ color: 'var(--brand-gray-medium)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Our technician experts are armed with commercial high-suction extractors, cleaning shampoo disinfectants, and high-pressure steam washers. We don't just clean, we restore the factory shine of your home items.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="uc-btn-primary" onClick={() => { setIsWizardOpen(true); setWizardStep(1); }}>
                  <Sparkles size={16} /> Book Inspection
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

      {/* Shopify-Style Multistep Checkout Modal Overlay */}
      {isWizardOpen && (
        <div className="shopify-modal-overlay">
          <div className="shopify-modal-container">
            <div className="shopify-modal-header">
              <img src="https://cleaninghero.in/cleaning-hero-logo.png" className="shopify-modal-logo" alt="Logo" />
              <button className="shopify-modal-close" onClick={() => setIsWizardOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="shopify-wizard-layout">
              {/* Left Column: Multistep configuration form content */}
              <div className="shopify-wizard-left">
                {/* Step indicators */}
                <div className="shopify-steps-indicator">
                  <div className={`shopify-step-node ${wizardStep === 1 ? 'active' : ''} ${wizardStep > 1 ? 'completed' : ''}`}>
                    <div className="shopify-step-circle">1</div>
                    <span className="shopify-step-label">Services</span>
                  </div>
                  <div className={`shopify-step-node ${wizardStep === 2 ? 'active' : ''} ${wizardStep > 2 ? 'completed' : ''}`}>
                    <div className="shopify-step-circle">2</div>
                    <span className="shopify-step-label">Schedule</span>
                  </div>
                  <div className={`shopify-step-node ${wizardStep === 3 ? 'active' : ''} ${wizardStep > 3 ? 'completed' : ''}`}>
                    <div className="shopify-step-circle">3</div>
                    <span className="shopify-step-label">Info</span>
                  </div>
                  <div className={`shopify-step-node ${wizardStep === 4 ? 'active' : ''}`}>
                    <div className="shopify-step-circle">4</div>
                    <span className="shopify-step-label">Confirm</span>
                  </div>
                </div>

                {/* Form Step Content */}
                {wizardStep === 1 && (
                  <div>
                    <h3 className="shopify-form-title">Select Cleaning Services</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {SERVICES_DATABASE.map(service => (
                        <div key={service.id} className="shopify-service-row" style={{ display: 'block' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="shopify-service-details">
                              <h4>{service.name}</h4>
                              <p>{service.description}</p>
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-blue)' }}>
                              {service.priceText}
                            </span>
                          </div>

                          <div className="shopify-variants-box">
                            {service.variants.map(v => {
                              const qty = getQty(service.id, v.id);
                              return (
                                <div key={v.id} className="shopify-variant-line">
                                  <span>{v.name} (₹{v.price})</span>
                                  <div className="uc-qty-selector">
                                    <button type="button" className="uc-qty-btn" onClick={() => updateCartQty(service.id, v.id, -1)}>-</button>
                                    <span className="uc-qty-val">{qty}</span>
                                    <button type="button" className="uc-qty-btn" onClick={() => updateCartQty(service.id, v.id, 1)}>+</button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div>
                    <h3 className="shopify-form-title">Select Appointment Schedule</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="uc-input-group">
                        <label className="uc-input-label">Date</label>
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

                {wizardStep === 3 && (
                  <div>
                    <h3 className="shopify-form-title">Contact & Location Info</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div className="uc-input-group">
                        <label className="uc-input-label">Your Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Asif Raza" 
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

                {wizardStep === 4 && (
                  <div>
                    <h3 className="shopify-form-title">Review & Place Reservation</h3>
                    <p style={{ color: 'var(--brand-gray-medium)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                      Please review your booking details on the right summary panel. Click the confirmation button below to send your reservation request directly to our dispatch office via WhatsApp.
                    </p>
                    <div className="uc-trust-item" style={{ flexDirection: 'row', textAlign: 'left', gap: '1rem', padding: '1rem' }}>
                      <ShieldCheck size={28} className="uc-trust-icon" />
                      <div>
                        <h5 style={{ fontSize: '0.9rem' }}>No Advance Payment Required</h5>
                        <p style={{ fontSize: '0.75rem', marginTop: '0.15rem' }}>Payment is collected only after the service is fully completed at your doorstep.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer buttons actions inside wizard */}
                <div className="shopify-wizard-footer">
                  {wizardStep > 1 && (
                    <button type="button" className="btn-wizard-back" onClick={() => setWizardStep(prev => prev - 1)}>
                      Back
                    </button>
                  )}
                  {wizardStep < 4 ? (
                    <button 
                      type="button" 
                      className="btn-wizard-next" 
                      style={{ marginLeft: wizardStep === 1 ? 'auto' : '0' }}
                      onClick={() => {
                        if (wizardStep === 1 && totalQty === 0) {
                          alert("Please add at least one service variant to continue!");
                          return;
                        }
                        if (wizardStep === 2 && (!date || !timeSlot)) {
                          alert("Please select date and preferred time slot!");
                          return;
                        }
                        if (wizardStep === 3 && (!name || !phone || !address)) {
                          alert("Please fill out all address and contact details!");
                          return;
                        }
                        setWizardStep(prev => prev + 1);
                      }}
                    >
                      Continue
                    </button>
                  ) : (
                    <button type="button" className="btn-wizard-next" onClick={submitBooking}>
                      Place Booking Order
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Dynamic Shopify Style Cart Summary panel */}
              <div className="shopify-wizard-right">
                <h3 className="shopify-checkout-summary-title">Order Summary</h3>
                
                {addedItems.length === 0 ? (
                  <p style={{ color: 'var(--brand-gray-medium)', fontSize: '0.85rem' }}>No items selected yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: '1' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {addedItems.map(item => (
                        <div key={item.key} className="shopify-summary-item">
                          <div>
                            <span className="shopify-summary-item-name">{item.service.name}</span>
                            <div className="shopify-summary-item-desc">
                              {item.variant.name} (x{item.qty})
                            </div>
                          </div>
                          <span style={{ fontWeight: '800' }}>₹{item.price * item.qty}</span>
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
                        <div style={{ fontWeight: 800, marginBottom: '0.25rem' }}>Ship To</div>
                        <div>{name} ({phone})</div>
                        <div style={{ wordBreak: 'break-all' }}>{address}</div>
                      </div>
                    )}

                    <div className="shopify-summary-totals-box">
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
