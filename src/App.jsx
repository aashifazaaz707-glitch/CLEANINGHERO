import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Check, 
  X, 
  ShoppingCart, 
  Phone, 
  ChevronRight, 
  Info, 
  ShieldCheck, 
  ThumbsUp, 
  Users, 
  Wrench, 
  Calendar, 
  MessageSquare 
} from 'lucide-react';

// Detailed catalog database modeled from Cleaning Hero current offerings
const SERVICES_DATA = [
  {
    id: "water_tank",
    name: "Water Tank Cleaning",
    category: "Cleaning Services",
    rating: 5.0,
    reviewsCount: 6,
    timeEstimate: "30-45 min",
    priceText: "₹499 onwards",
    icon: "🛢️",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
    description: "State-of-the-art machine-based deep cleaning & sanitization for your domestic drinking water tanks.",
    highlights: ["No-scratch scrubbing", "Sludge vacuuming", "UV disinfection"],
    whatsIncluded: [
      "Removal of sludge, dirt, and heavy particles using specialized vacuum pumps",
      "High-pressure jet cleaning to scrub away moss, algae, and stubborn scale",
      "Antibacterial spraying & chemical sanitization (100% safe for consumption after 1 hour)"
    ],
    whatsNotIncluded: [
      "Fixing damaged valves or structural leaks (can request plumber separately)",
      "Cleaning outer surface of the tank unless specifically requested"
    ],
    variants: [
      { id: "wt_500", name: "500 Liters Tank", price: 499 },
      { id: "wt_1000", name: "1000 Liters Tank", price: 799 },
      { id: "wt_1500", name: "1500 Liters Tank", price: 1099 },
      { id: "wt_2000", name: "2000 Liters Tank", price: 1399 }
    ]
  },
  {
    id: "bathroom_cleaning",
    name: "Bathroom Deep Cleaning",
    category: "Cleaning Services",
    rating: 4.9,
    reviewsCount: 28,
    timeEstimate: "60-90 min",
    priceText: "₹349 onwards",
    icon: "🧼",
    image: "https://images.unsplash.com/photo-1620626011161-997c51447094?auto=format&fit=crop&q=80&w=600",
    description: "Premium bathroom disinfection and stain removal to restore absolute shine and hygiene.",
    highlights: ["Hard water stain removal", "Tile scrubbing", "Sanitized fittings"],
    whatsIncluded: [
      "Thorough scrubbing of wall tiles, floors, and grout lines",
      "Removal of hard water stains & yellow spots from toilet bowl, sink, and bathtub",
      "Polishing of chrome fixtures, taps, shower heads, and mirrors"
    ],
    whatsNotIncluded: [
      "Cleaning personal belongings, toiletries, or inside cupboards",
      "Replacing worn-out grout or restoring broken tiles"
    ],
    variants: [
      { id: "bt_single", name: "Standard Bathroom (1 Unit)", price: 349 },
      { id: "bt_double", name: "2 Bathrooms Package (Save 10%)", price: 629 },
      { id: "bt_triple", name: "3 Bathrooms Full Deep Clean", price: 899 }
    ]
  },
  {
    id: "home_deep_clean",
    name: "Full Home Deep Cleaning",
    category: "Cleaning Services",
    rating: 4.8,
    reviewsCount: 45,
    timeEstimate: "4-5 Hours",
    priceText: "₹2,499 onwards",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1603712449591-2f7413d6b38c?auto=format&fit=crop&q=80&w=600",
    description: "Complete tip-to-toe deep scrubbing, dry vacuuming, and sanitization of your entire residence.",
    highlights: ["Professional machines", "Eco-friendly chemicals", "Cobweb removal"],
    whatsIncluded: [
      "Dry vacuuming of carpets, sofas, curtains, and dining chairs",
      "Deep cleaning of bathrooms (tiles, toilet, fittings, scaling)",
      "Kitchen cleaning: grease removal from exhaust/chimney exterior, countertops & cabinets exterior",
      "Floor scrubbing & mopping of the entire house, cobweb removal, ceiling fan dusting"
    ],
    whatsNotIncluded: [
      "Inside cabinet organization or utensil washing (available as custom add-on)",
      "Chandelier cleaning or structural repairs"
    ],
    variants: [
      { id: "hm_1bhk", name: "1 BHK Apartment Clean", price: 2499 },
      { id: "hm_2bhk", name: "2 BHK Apartment Clean", price: 3499 },
      { id: "hm_3bhk", name: "3 BHK Apartment/House Clean", price: 4499 },
      { id: "hm_4bhk", name: "4 BHK Large Villa Clean", price: 5999 }
    ]
  },
  {
    id: "ac_service",
    name: "AC Service & Jet Clean",
    category: "Cleaning Services",
    rating: 4.9,
    reviewsCount: 62,
    timeEstimate: "30-45 min",
    priceText: "₹399 onwards",
    icon: "❄️",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=600",
    description: "High-pressure power jet AC servicing to improve cooling performance and air quality instantly.",
    highlights: ["Power jet technology", "Filter wash", "Gas checkup"],
    whatsIncluded: [
      "Deep cleaning of indoor filters, cooling coils, drain tray, and outer panel",
      "High-pressure outdoor unit flushing to clear accumulated dust and debris",
      "Temperature, current draw, and refrigerant gas pressure check"
    ],
    whatsNotIncluded: [
      "Refilling of refrigerant gas (charged extra based on PSI level needed)",
      "Replacing copper piping or mounting brackets"
    ],
    variants: [
      { id: "ac_split", name: "Split AC Jet Service", price: 399 },
      { id: "ac_window", name: "Window AC Service", price: 299 },
      { id: "ac_repair", name: "AC Diagnostic & Repair Check", price: 199 }
    ]
  },
  {
    id: "sofa_cleaning",
    name: "Sofa Dry Cleaning",
    category: "Cleaning Services",
    rating: 4.9,
    reviewsCount: 19,
    timeEstimate: "60-90 min",
    priceText: "₹199 per seat",
    icon: "🛋️",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600",
    description: "Dry vacuuming and shampoo scrubbing to remove stains, food crumbs, and allergens from upholstery.",
    highlights: ["Shampoo treatment", "Stain extraction", "Eco chemicals"],
    whatsIncluded: [
      "High-suction vacuuming to pull out dust, lint, and hidden food particles",
      "Organic foam upholstery shampooing to loosen grease and body sweat stains",
      "Moisture extraction and sanitizing spray"
    ],
    whatsNotIncluded: [
      "Drying time is approx 2-4 hours (requires ceiling fan on)",
      "Leather sofa polishing (requires specialized polish, contact support)"
    ],
    variants: [
      { id: "sf_3seat", name: "3 Seater Sofa Cleaning", price: 599 },
      { id: "sf_5seat", name: "5 Seater Sofa Cleaning", price: 999 },
      { id: "sf_cushion", name: "Extra Cushion Cleaning (Per pc)", price: 99 }
    ]
  },
  {
    id: "septic_tank",
    name: "Septic Tank Cleaning",
    category: "Cleaning Services",
    rating: 4.9,
    reviewsCount: 14,
    timeEstimate: "4-5 Hours",
    priceText: "On Request",
    icon: "🚛",
    image: "https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&q=80&w=600",
    description: "Heavy-duty vacuum tanker service for complete septic tank clearance and sewage removal.",
    highlights: ["High-power suction", "Odor control", "Proper waste disposal"],
    whatsIncluded: [
      "High-power commercial suction vehicle deployment",
      "Complete evacuation of accumulated sludge and wastewater",
      "Basic flushing & chemical deodorizing of tank interior"
    ],
    whatsNotIncluded: [
      "Re-laying damaged concrete slabs or chamber lids",
      "Clearing internal main pipe blocks outside the tank area"
    ],
    variants: [
      { id: "sp_req", name: "Request Custom Call & Quote", price: 0, isOnRequest: true }
    ]
  },
  {
    id: "solar_panel",
    name: "Solar Panel Cleaning",
    category: "Cleaning Services",
    rating: 4.9,
    reviewsCount: 8,
    timeEstimate: "45-60 min",
    priceText: "₹399 onwards",
    icon: "☀️",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600",
    description: "Microfiber soft brush scratch-less cleaning to restore solar absorption and boost panel efficiency by 15-20%.",
    highlights: ["No-scratch soft brushes", "Purified water wash", "Efficiency report"],
    whatsIncluded: [
      "Microfiber wash using gentle eco-friendly glass cleaning solutions",
      "Gentle water pressure rinsing to avoid micro-cracks in solar cells",
      "Inspection and wiping down of dirty frame seals"
    ],
    whatsNotIncluded: [
      "Inverter repair or battery electrolyte topping (can request separately)",
      "Rewiring loose solar connectors"
    ],
    variants: [
      { id: "sl_small", name: "Up to 10 Panels Clean", price: 399 },
      { id: "sl_med", name: "11 to 25 Panels Clean", price: 799 },
      { id: "sl_large", name: "Commercial Solar System (Per panel rate)", price: 30 }
    ]
  },
  {
    id: "electrician",
    name: "Electrician Services",
    category: "Handyman Services",
    rating: 4.8,
    reviewsCount: 112,
    timeEstimate: "30-60 min",
    priceText: "₹99 onwards",
    icon: "⚡",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
    description: "Certified, background-verified technicians for instant wiring, socket, switches & light installs.",
    highlights: ["Verified experts", "30-day warranty", "Safety checkup"],
    whatsIncluded: [
      "Safe, insulation-tested electrical installations",
      "Troubleshooting of tripping MCBs, short-circuits & faulty wiring",
      "Professional mounting of fans, LED lights, and geysers"
    ],
    whatsNotIncluded: [
      "Cost of wires, conduits, switches, or decorative light fittings",
      "Heavy core drilling through structural pillars"
    ],
    variants: [
      { id: "el_switch", name: "Switch/Socket Install & Repair", price: 99 },
      { id: "el_fan", name: "Ceiling Fan Fitting/Replacement", price: 199 },
      { id: "el_geyser", name: "Geyser Installation Service", price: 349 },
      { id: "el_board", name: "Full Main Distribution Board Checkup", price: 299 }
    ]
  },
  {
    id: "ro_repair",
    name: "Water Purifier (RO) Repair",
    category: "Repair Services",
    rating: 4.8,
    reviewsCount: 54,
    timeEstimate: "30-45 min",
    priceText: "₹149 onwards",
    icon: "💧",
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=600",
    description: "Complete water purifier filter change, TDS level testing, and system diagnostic repair.",
    highlights: ["TDS meter calibration", "Genuine spares", "Leak-proof check"],
    whatsIncluded: [
      "In-depth filter check and TDS water quality testing",
      "Cleaning of RO storage tank and disinfection",
      "Fixing continuous drain water issue or low flow rate"
    ],
    whatsNotIncluded: [
      "Cost of new sediment filters, carbon filters, or RO membrane",
      "Installing heavy wall brackets if not provided with unit"
    ],
    variants: [
      { id: "ro_diagnose", name: "General Purifier Diagnosis", price: 149 },
      { id: "ro_filter", name: "Full Filter Replacement Service", price: 499 },
      { id: "ro_pump", name: "Booster Pump Replacement Service", price: 799 }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  
  // Checkout Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSlot, setBookingSlot] = useState("");

  const sliderRef = useRef(null);

  // Filter service category tabs
  const categories = ["All", "Cleaning Services", "Repair Services", "Handyman Services"];

  // Filter services by search & category
  const filteredServices = SERVICES_DATA.filter(service => {
    const matchesCategory = activeTab === "All" || service.category === activeTab;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate items count and subtotal
  const cartItems = Object.entries(cart).map(([key, item]) => {
    // Find service and variant details
    const [serviceId, variantId] = key.split('_v_');
    const service = SERVICES_DATA.find(s => s.id === serviceId);
    const variant = service?.variants.find(v => v.id === variantId);
    return {
      key,
      service,
      variant,
      quantity: item.quantity,
      price: variant ? variant.price : 0
    };
  }).filter(item => item.service && item.variant);

  const subtotal = cartItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const gstCharge = Math.round(subtotal * 0.18);
  const visitingCharge = subtotal > 0 ? 49 : 0;
  const totalAmount = subtotal + gstCharge + visitingCharge;
  const totalQty = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Cart operations
  const addToCart = (serviceId, variantId) => {
    const key = `${serviceId}_v_${variantId}`;
    setCart(prev => ({
      ...prev,
      [key]: {
        quantity: (prev[key]?.quantity || 0) + 1
      }
    }));
  };

  const removeFromCart = (serviceId, variantId) => {
    const key = `${serviceId}_v_${variantId}`;
    setCart(prev => {
      const updated = { ...prev };
      if (updated[key]) {
        if (updated[key].quantity <= 1) {
          delete updated[key];
        } else {
          updated[key] = { quantity: updated[key].quantity - 1 };
        }
      }
      return updated;
    });
  };

  const getVariantQty = (serviceId, variantId) => {
    const key = `${serviceId}_v_${variantId}`;
    return cart[key]?.quantity || 0;
  };

  // Drag handlers for before/after comparison slider
  const handleMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging]);

  // WhatsApp Checkout booking summary message
  const handleWhatsAppBooking = (e) => {
    e.preventDefault();
    if (!name || !phone || !address || !bookingDate || !bookingSlot) {
      alert("Please fill in all booking details!");
      return;
    }

    let itemsDescription = cartItems.map(item => 
      `• ${item.service.name} (${item.variant.name}) x ${item.quantity} - ₹${item.price * item.quantity}`
    ).join("\n");

    const message = `*NEW BOOKING REQUEST - CLEANING HERO*\n\n` +
      `*Client Details:*\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Address: ${address}\n\n` +
      `*Appointment Slot:*\n` +
      `Date: ${bookingDate}\n` +
      `Slot: ${bookingSlot}\n\n` +
      `*Services Ordered:*\n${itemsDescription}\n\n` +
      `*Estimated Cost Summary:*\n` +
      `Subtotal: ₹${subtotal}\n` +
      `Safety/GST fee: ₹${gstCharge}\n` +
      `Visiting fee: ₹${visitingCharge}\n` +
      `*Total Est. Bill: ₹${totalAmount}*\n\n` +
      `Please confirm my booking slot and technician details. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919031116900?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="app-container">
      {/* Sticky Header / Navbar */}
      <header className="navbar">
        <div className="nav-left">
          <div className="logo-container" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="logo-icon">CH</div>
            <span className="logo-text">Cleaning Hero</span>
          </div>
          <div className="location-picker">
            <MapPin size={16} color="#3b82f6" />
            <span>Serving Darbhanga, BR</span>
            <span className="location-dot"></span>
          </div>
        </div>

        <div className="nav-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for water tank, AC, deep cleaning..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="nav-actions">
          <a href="tel:+919031116900" className="btn-contact">
            <Phone size={16} />
            <span>Call +91 90311 16900</span>
          </a>
          
          <button className="btn-cart" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={18} />
            <span>Cart</span>
            {totalQty > 0 && <span className="cart-count">{totalQty}</span>}
          </button>
        </div>
      </header>

      {/* Hero Section & Quick grids */}
      <section className="hero-section">
        <div className="hero-layout">
          <div className="hero-text">
            <h1>Professional Home Cleaning & Repairs, <span>No-Brainer Booking</span></h1>
            <p>Get certified local experts in Darbhanga with high-end, eco-friendly equipment and Urban Company style transparent pricing. Safe, reliable, and rated 4.9 stars.</p>
            
            <div className="quick-grid-title">Quick Booking Services</div>
            <div className="quick-category-grid">
              <button className="category-item" onClick={() => { setActiveTab("Cleaning Services"); window.scrollTo({top: 750, behavior: 'smooth'}); }}>
                <div className="category-icon-wrapper">🛢️</div>
                <div className="category-name">Water Tank</div>
              </button>
              <button className="category-item" onClick={() => { setActiveTab("Cleaning Services"); window.scrollTo({top: 750, behavior: 'smooth'}); }}>
                <div className="category-icon-wrapper">❄️</div>
                <div className="category-name">AC Service</div>
              </button>
              <button className="category-item" onClick={() => { setActiveTab("Cleaning Services"); window.scrollTo({top: 750, behavior: 'smooth'}); }}>
                <div className="category-icon-wrapper">🛋️</div>
                <div className="category-name">Sofa Cleaning</div>
              </button>
              <button className="category-item" onClick={() => { setActiveTab("Cleaning Services"); window.scrollTo({top: 750, behavior: 'smooth'}); }}>
                <div className="category-icon-wrapper">🏠</div>
                <div className="category-name">Home Cleaning</div>
              </button>
              <button className="category-item" onClick={() => { setActiveTab("Handyman Services"); window.scrollTo({top: 750, behavior: 'smooth'}); }}>
                <div className="category-icon-wrapper">⚡</div>
                <div className="category-name">Electrician</div>
              </button>
              <button className="category-item" onClick={() => { setActiveTab("Repair Services"); window.scrollTo({top: 750, behavior: 'smooth'}); }}>
                <div className="category-icon-wrapper">💧</div>
                <div className="category-name">RO Repair</div>
              </button>
              <button className="category-item" onClick={() => { setActiveTab("Cleaning Services"); window.scrollTo({top: 750, behavior: 'smooth'}); }}>
                <div className="category-icon-wrapper">🚛</div>
                <div className="category-name">Septic Tank</div>
              </button>
              <button className="category-item" onClick={() => { setActiveTab("Cleaning Services"); window.scrollTo({top: 750, behavior: 'smooth'}); }}>
                <div className="category-icon-wrapper">☀️</div>
                <div className="category-name">Solar Panel</div>
              </button>
            </div>

            <div className="trust-stats">
              <div className="stat-item">
                <span className="stat-num">500+</span>
                <span className="stat-label">Happy<br/>Homes Served</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">4.9★</span>
                <span className="stat-label">Google<br/>Rating Average</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-label">Eco-friendly<br/>Chemicals Used</span>
              </div>
            </div>
          </div>

          {/* Interactive Before/After slider showcase */}
          <div className="slider-container">
            <div className="slider-header">
              <h2>See the Magic Cleaning Hero Result</h2>
              <p>Drag the slider bar to compare our sofa cleaning performance</p>
            </div>
            <div 
              className="slider-comparison"
              ref={sliderRef}
              onTouchMove={handleTouchMove}
            >
              {/* After cleaning image */}
              <div 
                className="slider-image-after"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800')` }}
              >
                <span className="slider-label label-after">Cleaned Result</span>
              </div>
              
              {/* Before cleaning image, overlay clip-path */}
              <div 
                className="slider-image-before"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800')`,
                  width: `${sliderPosition}%` 
                }}
              >
                <span className="slider-label label-before">Before Dust/Dirt</span>
              </div>

              {/* Slider boundary controller */}
              <div 
                className="slider-handle" 
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
              >
                <div className="slider-handle-button">↔</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content: Catalog grids */}
      <main className="main-wrapper">
        <div className="catalog-section-header">
          <div className="catalog-title">
            <h2>Book High-Quality Services</h2>
            <p>Simple pricing. Certified technicians. Super clean guarantee.</p>
          </div>

          <div className="catalog-tabs">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Service Grid */}
        <div className="services-grid">
          {filteredServices.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-card-image" style={{ backgroundImage: `url(${service.image})` }}>
                <span className="badge-tag">{service.category}</span>
              </div>
              <div className="service-card-body">
                <div className="service-card-header">
                  <h3 className="service-name">{service.name}</h3>
                  <div className="service-rating">
                    <Star size={14} fill="currentColor" />
                    <span>{service.rating}</span>
                  </div>
                </div>
                <p className="service-desc">{service.description}</p>
                <div className="service-footer">
                  <div className="service-price-block">
                    <span className="price-label">Starts from</span>
                    <span className="price-value">{service.priceText}</span>
                  </div>
                  <button className="btn-book" onClick={() => setSelectedService(service)}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quality assurances Badges */}
        <section className="quality-badges-section">
          <div className="badge-card">
            <div className="badge-icon-box"><ShieldCheck size={28} /></div>
            <h4 className="badge-title">Damage Insurance</h4>
            <p className="badge-desc">Rest assured, all work is done under insurance against accident damages.</p>
          </div>
          <div className="badge-card">
            <div className="badge-icon-box"><Sparkles size={28} /></div>
            <h4 className="badge-title">Eco-friendly Cleaners</h4>
            <p className="badge-desc">100% kid and pet safe cleaning solutions certified for organic composition.</p>
          </div>
          <div className="badge-card">
            <div className="badge-icon-box"><Users size={28} /></div>
            <h4 className="badge-title">Trained Professionals</h4>
            <p className="badge-desc">All workers are background checked and hold official job training badges.</p>
          </div>
          <div className="badge-card">
            <div className="badge-icon-box"><ThumbsUp size={28} /></div>
            <h4 className="badge-title">Satisfaction Match</h4>
            <p className="badge-desc">If you are not 100% happy with cleaning, we will wash again for free.</p>
          </div>
        </section>
      </main>

      {/* Details/Variants Selector Modal */}
      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-banner" style={{ backgroundImage: `url(${selectedService.image})` }}>
              <button className="modal-close-btn" onClick={() => setSelectedService(null)}>
                <X size={20} />
              </button>
              <div className="modal-title-info">
                <h3>{selectedService.name}</h3>
                <div className="service-rating" style={{ color: '#fbbf24', marginTop: '0.25rem' }}>
                  <Star size={16} fill="currentColor" />
                  <span style={{ fontWeight: 'bold', color: 'white', marginLeft: '0.25rem' }}>
                    {selectedService.rating} ({selectedService.reviewsCount} verified reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-meta-grid">
                <div className="meta-box">
                  <div className="meta-label">Duration</div>
                  <div className="meta-value">{selectedService.timeEstimate}</div>
                </div>
                <div className="meta-box">
                  <div className="meta-label">Rating</div>
                  <div className="meta-value">{selectedService.rating} ★</div>
                </div>
                <div className="meta-box">
                  <div className="meta-label">Team Type</div>
                  <div className="meta-value">Hero Pro Team</div>
                </div>
              </div>

              {selectedService.whatsIncluded && selectedService.whatsIncluded.length > 0 && (
                <div className="inclusions-grid">
                  <div className="inclusion-section">
                    <h4><Check size={16} color="#16a34a" /> What's Included</h4>
                    <ul className="inclusion-list">
                      {selectedService.whatsIncluded.map((inc, i) => (
                        <li key={i}>
                          <span className="list-icon-check">✓</span>
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="inclusion-section">
                    <h4><X size={16} color="#f43f5e" /> Excluded</h4>
                    <ul className="inclusion-list">
                      {selectedService.whatsNotIncluded.map((exc, i) => (
                        <li key={i}>
                          <span className="list-icon-cross">✗</span>
                          {exc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Sub-Service Selection Pricing Grid */}
              <div className="subservices-section">
                <h4>Select Custom Options for {selectedService.name}</h4>
                <div className="subservice-list">
                  {selectedService.variants.map(variant => {
                    const qty = getVariantQty(selectedService.id, variant.id);
                    return (
                      <div key={variant.id} className="subservice-row">
                        <div className="subservice-info">
                          <span className="subservice-name">{variant.name}</span>
                          <span className="subservice-price">
                            {variant.isOnRequest ? "Price on Quote" : `₹${variant.price}`}
                          </span>
                        </div>

                        {variant.isOnRequest ? (
                          <a 
                            href="tel:+919031116900" 
                            className="btn-add-item" 
                            style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}
                          >
                            Call For Quote
                          </a>
                        ) : (
                          <div className="booking-control">
                            {qty > 0 ? (
                              <div className="qty-selector">
                                <button className="qty-btn" onClick={() => removeFromCart(selectedService.id, variant.id)}>-</button>
                                <span className="qty-value">{qty}</span>
                                <button className="qty-btn" onClick={() => addToCart(selectedService.id, variant.id)}>+</button>
                              </div>
                            ) : (
                              <button className="btn-add-item" onClick={() => addToCart(selectedService.id, variant.id)}>
                                ADD
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Checkout Banner */}
      {totalQty > 0 && !isCartOpen && (
        <div className="checkout-bar-sticky">
          <div className="checkout-bar-left">
            <span className="checkout-bar-qty">{totalQty} items selected</span>
            <span className="checkout-bar-price">
              ₹{totalAmount} 
              <span className="checkout-bar-price-label"> (Incl. Visiting + GST)</span>
            </span>
          </div>
          <button className="btn-checkout-trigger" onClick={() => setIsCartOpen(true)}>
            <span>Proceed to Booking</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Cart / Booking Checkout Drawer Overlay */}
      {isCartOpen && (
        <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Confirm Booking Details</h3>
              <button className="drawer-close-btn" onClick={() => setIsCartOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form className="drawer-body" onSubmit={handleWhatsAppBooking}>
              {/* Selected items list */}
              <div>
                <div className="drawer-section-title">Selected Services</div>
                {cartItems.length === 0 ? (
                  <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>No items in cart yet.</p>
                ) : (
                  <div className="cart-items-list">
                    {cartItems.map(item => (
                      <div key={item.key} className="cart-item-row">
                        <div className="cart-item-details">
                          <span className="cart-item-name">{item.service.name}</span>
                          <span className="cart-item-category">{item.variant.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <div className="qty-selector">
                            <button type="button" className="qty-btn" onClick={() => removeFromCart(item.service.id, item.variant.id)}>-</button>
                            <span className="qty-value">{item.quantity}</span>
                            <button type="button" className="qty-btn" onClick={() => addToCart(item.service.id, item.variant.id)}>+</button>
                          </div>
                          <span className="cart-item-price">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking Slot selector */}
              <div>
                <div className="drawer-section-title">Select Booking Date & Slot</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input 
                    type="date" 
                    required
                    className="form-input" 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                  <div className="slots-grid">
                    {["8:00 AM - 11:00 AM (Morning)", "12:00 PM - 3:00 PM (Afternoon)", "4:00 PM - 7:00 PM (Evening)"].map(slot => (
                      <div 
                        key={slot}
                        className={`slot-btn ${bookingSlot === slot ? 'active' : ''}`}
                        onClick={() => setBookingSlot(slot)}
                      >
                        {slot.split(" ")[0]} {slot.includes("Morning") ? "AM" : "PM"}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User address & detail fields */}
              <div>
                <div className="drawer-section-title">Your Contact Details</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Asif Raza" 
                      required
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">WhatsApp Mobile Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. +91 90311 16900" 
                      required
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Address in Darbhanga</label>
                    <textarea 
                      placeholder="Street, Landmark, Near LNMU, Mirzapur, etc." 
                      required
                      rows={2}
                      className="form-input"
                      style={{ resize: 'none' }}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Bill Details */}
              {subtotal > 0 && (
                <div className="bill-summary">
                  <div className="bill-row">
                    <span>Items Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="bill-row">
                    <span>Safety / GST (18%)</span>
                    <span>₹{gstCharge}</span>
                  </div>
                  <div className="bill-row">
                    <span>Technician Visiting fee</span>
                    <span>₹{visitingCharge}</span>
                  </div>
                  <div className="bill-row bill-total">
                    <span>Total Est. Payable</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
              )}

              {/* Drawer Booking Submit */}
              <div className="drawer-footer">
                <button type="submit" className="btn-whatsapp-order">
                  <MessageSquare size={18} />
                  <span>Book Instantly on WhatsApp</span>
                </button>
                <p style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', textAlign: 'center', marginTop: '0.5rem' }}>
                  Clicking redirects to WhatsApp to finalize slot details. No advance payment required!
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <h4>Cleaning Hero</h4>
            <p>Darbhanga's premium cleaning and repair home utility brand. Certified specialists delivering safety, quality, and complete hygiene at competitive rates.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href="tel:+919031116900" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.85rem' }}>
                <Phone size={14} /> Call support
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Cleaning Services</h5>
            <ul className="footer-links">
              <li><a href="#catalogue">Water Tank Cleaning</a></li>
              <li><a href="#catalogue">Bathroom Scrubbing</a></li>
              <li><a href="#catalogue">Sofa Dry Wash</a></li>
              <li><a href="#catalogue">Full Home Deep Clean</a></li>
              <li><a href="#catalogue">Solar Panel Cleaning</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Repairs & Handyman</h5>
            <ul className="footer-links">
              <li><a href="#catalogue">AC Service & Jet Clean</a></li>
              <li><a href="#catalogue">Electrician Services</a></li>
              <li><a href="#catalogue">RO Filter Repair</a></li>
              <li><a href="#catalogue">Septic Tank Pumping</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Local Office Address</h5>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Cleaning Hero Office,<br />
              Mirzapur (Near LNMU campus),<br />
              Darbhanga, Bihar - 846004<br />
              India
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Cleaning Hero. Redesigned with ❤️. All rights reserved.</p>
          <p>Proudly Serving Darbhanga & Nearby Districts</p>
        </div>
      </footer>
    </div>
  );
}
