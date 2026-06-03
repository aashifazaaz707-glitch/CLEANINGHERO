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
  Info, 
  Sparkles,
  MessageSquare,
  Bookmark
} from 'lucide-react';

const CATEGORIES = [
  { id: "tank", label: "Tank Clean", icon: "🛢️" },
  { id: "ac", label: "AC Repair", icon: "❄️" },
  { id: "sofa", label: "Sofa Wash", icon: "🛋️" },
  { id: "home", label: "Deep Clean", icon: "🏠" },
  { id: "electric", label: "Electrician", icon: "⚡" },
  { id: "ro", label: "RO Purifier", icon: "💧" },
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
  const [selectedService, setSelectedService] = useState(null);
  const [cart, setCart] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  // Cart logic parsing
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

  // Slider controls
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
    e.preventDefault();
    if (!name || !phone || !address || !date || !timeSlot) {
      alert("Please fill out all location & contact fields.");
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
  };

  return (
    <div className="app-layout">
      {/* Mobile Sticky Header */}
      <header className="uc-header">
        <div className="uc-header-top">
          <div className="uc-location-container">
            <div className="uc-location-selector">
              <MapPin size={18} color="#3262ec" />
              <span>Mirzapur, LNMU Campus</span>
            </div>
            <div className="uc-location-sub">Darbhanga, Bihar 846004</div>
          </div>
          <a href="tel:+919031116900" className="uc-contact-icon">
            <Phone size={18} />
          </a>
        </div>

        <div className="uc-search-container">
          <Search size={18} className="uc-search-icon" />
          <input 
            type="text" 
            placeholder="Search for Water Tank, AC, Sofa Cleaning..." 
            className="uc-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Main Promo Banners */}
      <div className="uc-promo-section">
        <div 
          className="uc-promo-banner" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400')` }}
        >
          <div className="uc-promo-content">
            <div className="uc-promo-title">Up to 25% Off AC Service</div>
            <div className="uc-promo-subtitle">Clean filters and boost high cooling output instantly.</div>
          </div>
        </div>

        <div 
          className="uc-promo-banner" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400')` }}
        >
          <div className="uc-promo-content">
            <div className="uc-promo-title">Pure Tank Guarantee</div>
            <div className="uc-promo-subtitle">Full machine-based vacuum cleaning from ₹499.</div>
          </div>
        </div>
      </div>

      {/* Circular Grid Services */}
      <section className="uc-categories-container">
        <div className="uc-categories-grid">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              className="uc-category-btn"
              onClick={() => {
                const item = SERVICES_DATABASE.find(s => s.id === cat.id);
                if (item) setSelectedService(item);
              }}
            >
              <div className="uc-category-icon-box">{cat.icon}</div>
              <span className="uc-category-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Best Selling horizontal scroll section */}
      <section className="uc-section">
        <div className="uc-section-header">
          <h2 className="uc-section-title">Trending Home Services</h2>
          <span className="uc-section-more">See All</span>
        </div>

        <div className="uc-services-scroller">
          {displayedServices.map(service => (
            <div key={service.id} className="uc-scroller-card" onClick={() => setSelectedService(service)}>
              <div className="uc-scroller-img" style={{ backgroundImage: `url(${service.image})` }}></div>
              <div className="uc-scroller-info">
                <h3 className="uc-scroller-name">{service.name}</h3>
                <div className="uc-scroller-rating">
                  <Star size={10} fill="currentColor" />
                  <span>{service.rating} ({service.reviews})</span>
                </div>
                <div className="uc-scroller-footer">
                  <span className="uc-scroller-price">{service.priceText}</span>
                  <button className="uc-add-btn-small" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedService(service);
                  }}>ADD</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After Drag Slider widget */}
      <section className="uc-section">
        <div className="uc-section-header">
          <h2 className="uc-section-title">Our Magic Cleaning Results</h2>
        </div>

        <div className="uc-slider-card">
          <div 
            className="uc-slider-container"
            ref={sliderContainerRef}
            onTouchMove={handleTouch}
          >
            {/* After cleaned image */}
            <div 
              className="uc-slider-img"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=500')` }}
            ></div>
            
            {/* Before dirty image clipped */}
            <div 
              className="uc-slider-img"
              style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=500')`,
                width: `${sliderPos}%`
              }}
            ></div>

            {/* Slider bar overlay */}
            <div 
              className="uc-slider-bar"
              style={{ left: `${sliderPos}%` }}
              onMouseDown={() => setDragging(true)}
            >
              <div className="uc-slider-handle">↔</div>
            </div>
          </div>
          <div className="uc-slider-info">
            <h4 className="uc-slider-title">Expert Stain & Dust Extraction</h4>
            <p className="uc-slider-desc">Drag the white separator bar to see our sofa cleaning difference.</p>
          </div>
        </div>
      </section>

      {/* Trust & Safe badges */}
      <section className="uc-section">
        <div className="uc-section-header">
          <h2 className="uc-section-title">Why Cleaning Hero?</h2>
        </div>
        <div className="uc-trust-grid">
          <div className="uc-trust-item">
            <ShieldCheck size={20} className="uc-trust-icon" />
            <div className="uc-trust-info">
              <h5>100% Safe Work</h5>
              <p>Certified skin-safe non toxic solutions.</p>
            </div>
          </div>
          <div className="uc-trust-item">
            <Sparkles size={20} className="uc-trust-icon" />
            <div className="uc-trust-info">
              <h5>Premium Tools</h5>
              <p>High suction and jet power cleaners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Bottom Cart Bar */}
      {totalQty > 0 && !isDrawerOpen && (
        <div className="uc-action-bar">
          <div className="uc-action-details">
            <span className="uc-action-qty">{totalQty} service selected</span>
            <span className="uc-action-price">₹{grandTotal}</span>
          </div>
          <button className="uc-action-btn" onClick={() => setIsDrawerOpen(true)}>
            View Booking details
          </button>
        </div>
      )}

      {/* Details drawer overlay */}
      {selectedService && (
        <div className="uc-drawer-overlay" onClick={() => setSelectedService(null)}>
          <div className="uc-drawer-content" onClick={e => e.stopPropagation()}>
            <div className="uc-drawer-header">
              <h3 className="uc-drawer-title">{selectedService.name}</h3>
              <button onClick={() => setSelectedService(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="uc-drawer-meta">
              <div className="uc-meta-item">
                <Clock size={14} className="uc-meta-icon" />
                <span>{selectedService.time}</span>
              </div>
              <div className="uc-meta-item">
                <Star size={14} className="uc-meta-icon" style={{ color: '#fbbf24' }} />
                <span>{selectedService.rating} Rating</span>
              </div>
            </div>

            <div className="uc-inc-section">
              <div className="uc-inc-title">What's Included</div>
              <ul className="uc-inc-list">
                {selectedService.whatsIncluded.map((inc, i) => (
                  <li key={i}>
                    <Check size={14} className="uc-inc-check" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="uc-inc-section">
              <div className="uc-inc-title">Whats Excluded</div>
              <ul className="uc-inc-list">
                {selectedService.whatsExcluded.map((exc, i) => (
                  <li key={i}>
                    <X size={14} className="uc-inc-cross" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="uc-inc-title" style={{ marginTop: '1rem' }}>Select Option</div>
            {selectedService.variants.map(v => {
              const qty = getQty(selectedService.id, v.id);
              return (
                <div key={v.id} className="uc-variant-row">
                  <div>
                    <div className="uc-variant-name">{v.name}</div>
                    <div className="uc-variant-price">₹{v.price}</div>
                  </div>

                  <div>
                    {qty > 0 ? (
                      <div className="uc-qty-selector">
                        <button className="uc-qty-btn" onClick={() => updateCartQty(selectedService.id, v.id, -1)}>-</button>
                        <span className="uc-qty-val">{qty}</span>
                        <button className="uc-qty-btn" onClick={() => updateCartQty(selectedService.id, v.id, 1)}>+</button>
                      </div>
                    ) : (
                      <button className="uc-add-btn-small" onClick={() => updateCartQty(selectedService.id, v.id, 1)}>ADD</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cart Checkout Bottom Drawer */}
      {isDrawerOpen && (
        <div className="uc-drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="uc-drawer-content" onClick={e => e.stopPropagation()}>
            <div className="uc-drawer-header">
              <h3 className="uc-drawer-title">Booking Checkout</h3>
              <button onClick={() => setIsDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitBooking} className="uc-checkout-form">
              {/* Added items review */}
              <div className="uc-inc-title">Selected Items</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {addedItems.map(item => (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                      {item.service.name} <span style={{ color: 'var(--uc-gray-medium)' }}>({item.variant.name})</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div className="uc-qty-selector">
                        <button type="button" className="uc-qty-btn" onClick={() => updateCartQty(item.service.id, item.variant.id, -1)}>-</button>
                        <span className="uc-qty-val">{item.qty}</span>
                        <button type="button" className="uc-qty-btn" onClick={() => updateCartQty(item.service.id, item.variant.id, 1)}>+</button>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>₹{item.price * item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form entries */}
              <div className="uc-inc-title" style={{ marginTop: '1rem' }}>Delivery Slot & Address</div>
              
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
                  rows={2}
                  placeholder="Street, landmarks, house number..."
                  required
                  className="uc-input"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>

              {/* Pricing breakdown */}
              <div className="uc-bill-box">
                <div className="uc-bill-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="uc-bill-row">
                  <span>Convenience Fee</span>
                  <span>₹{convenienceFee}</span>
                </div>
                <div className="uc-bill-row uc-bill-total">
                  <span>Final Payable Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button type="submit" className="uc-btn-primary">
                <MessageSquare size={16} />
                <span>Confirm Booking via WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
