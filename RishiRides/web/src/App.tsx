import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Compass,
  LocateFixed,
  MapPin,
  Menu,
  Navigation,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Destination, destinations } from './data/destinations';

const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

export default function App() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:slug" element={<DestinationPage />} />
          <Route path="/sign-in" element={<AccountPage mode="sign-in" />} />
          <Route path="/sign-up" element={<AccountPage mode="sign-up" />} />
          <Route path="/about" element={<InfoPage title="About RishiRide" eyebrow="LOCAL BY NATURE" body="A locally focused way to plan a ride across Rishikesh. We are building the service around clear information, fair choices, and respectful travel." />} />
          <Route path="/services" element={<InfoPage title="Rides around Rishikesh" eyebrow="OUR SERVICE" body="RishiRide is being prepared for local passenger trips with e-rickshaws for groups of up to three and CNG auto-rickshaws for larger groups. Booking and route services are not available until securely connected." />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="/terms" element={<InfoPage title="Terms" eyebrow="THE DETAILS" body="Terms will be published before ride bookings are enabled. No booking can be made from this preview." />} />
          <Route path="/privacy" element={<InfoPage title="Privacy" eyebrow="YOUR INFORMATION" body="This preview does not submit a ride request or store account credentials. Location access is requested only when you choose to use your current location." />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { to: '/', label: 'Book a ride', end: true },
    { to: '/destinations', label: 'Places', end: false },
    { to: '/services', label: 'Services', end: false },
    { to: '/faqs', label: 'FAQs', end: false },
  ];
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="RishiRide home">
          <span className="brand-icon"><Navigation size={20} strokeWidth={2.7} /></span>
          <span className="brand-word">Rishi<span>Ride</span></span>
          <span className="brand-city">RISHIKESH</span>
        </Link>
        <button className="mobile-menu-button icon-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`primary-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
          {links.map((link) => <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setMenuOpen(false)}>{link.label}</NavLink>)}
          <div className="nav-account">
            <Link to="/sign-in" className="nav-sign-in">Sign in</Link>
            <Link to="/sign-up" className="nav-join">Join RishiRide <ArrowUpRight size={14} /></Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <div className="page-wrap home-page">
      <section className="home-intro">
        <div className="intro-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> RISHIKESH, UTTARAKHAND</p>
          <h1>Find your way<br /><em>through the valley.</em></h1>
          <p className="intro-deck">A local ride, beginning with a clear pickup and a place to go.</p>
          <div className="intro-foot"><span className="intro-mark">01</span><span>RISHI RIDE · LOCAL JOURNEYS</span><span className="intro-rule" /></div>
        </div>
        <div className="intro-art" aria-label="Photograph of Triveni Ghat in Rishikesh">
          <img src={destinations[0].photoUrl ?? ''} alt="Evening lamps at Triveni Ghat, Rishikesh" />
          <a className="photo-credit" href={destinations[0].photoSource ?? '#'} target="_blank" rel="noreferrer">TRIVENI GHAT <ArrowUpRight size={12} /></a>
          <div className="art-stamp"><span>30°</span><span>RISHIKESH</span></div>
        </div>
      </section>

      <section className="booking-section" aria-labelledby="booking-title">
        <div className="section-marker"><span>01</span><span>START HERE</span></div>
        <div className="booking-layout">
          <div className="booking-heading">
            <h2 id="booking-title">Where are you headed?</h2>
            <p>Enter a pickup and a destination to begin.</p>
          </div>
          <BookingForm />
        </div>
      </section>

      <section className="discover-section">
        <div className="discover-head">
          <div><p className="eyebrow">THE RIVER, THE GHATS, THE HILLS</p><h2>Places worth a stop.</h2></div>
          <Link className="text-link" to="/destinations">Explore all places <ArrowRight size={15} /></Link>
        </div>
        <div className="feature-destinations">
          {destinations.filter((place) => place.photoUrl).slice(0, 3).map((place, index) => <DestinationCard key={place.slug} destination={place} index={index} />)}
        </div>
      </section>
    </div>
  );
}

function BookingForm() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [locationBusy, setLocationBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const vehicle = partySize <= 3 ? 'E-rickshaw' : 'CNG auto-rickshaw';

  const requestLocation = () => {
    setNotice('');
    if (!navigator.geolocation) {
      setNotice('Location access is unavailable in this browser. Enter your pickup point instead.');
      return;
    }
    setLocationBusy(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      if (!apiBase) {
        setNotice('Location name unavailable because the geocoding service is not configured. Enter a pickup point or try again later.');
        setLocationBusy(false);
        return;
      }
      try {
        const response = await fetch(`${apiBase}/geo/reverse-geocode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ latitude: coords.latitude, longitude: coords.longitude }),
        });
        if (!response.ok) throw new Error('Reverse geocoding failed.');
        const result: { name?: string } = await response.json();
        if (!result.name?.trim()) throw new Error('No readable place name was returned.');
        setPickup(result.name);
        setNotice('Pickup set from your current location.');
      } catch {
        setNotice('Location name unavailable. Enter a pickup point or retry.');
      } finally {
        setLocationBusy(false);
      }
    }, (error) => {
      setLocationBusy(false);
      setNotice(error.code === error.PERMISSION_DENIED
        ? 'Location permission was denied. Enter a pickup point manually to continue.'
        : 'Could not determine your location. Enter a pickup point or retry.');
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 30000 });
  };

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(!pickup.trim()
      ? 'Add a pickup point before requesting a ride.'
      : !dropoff.trim()
        ? 'Add a destination before requesting a ride.'
        : 'Booking is not available yet. Your request has not been sent.');
  };

  return (
    <form className="booking-form" onSubmit={submitBooking}>
      <div className="booking-fields">
        <label className="booking-field">
          <span className="field-symbol pickup-symbol" aria-hidden="true" />
          <span className="field-copy"><span className="field-label">PICKUP</span><input value={pickup} onChange={(event) => setPickup(event.target.value)} placeholder="Enter a pickup point" autoComplete="street-address" /></span>
          <button type="button" className="location-action" onClick={requestLocation} disabled={locationBusy} aria-label="Use current location" title="Use current location"><LocateFixed size={19} /></button>
        </label>
        <label className="booking-field">
          <span className="field-symbol drop-symbol" aria-hidden="true" />
          <span className="field-copy"><span className="field-label">DESTINATION</span><input value={dropoff} onChange={(event) => setDropoff(event.target.value)} placeholder="Where do you want to go?" autoComplete="off" /></span>
          <ChevronDown size={18} className="field-chevron" />
        </label>
      </div>
      <button type="button" className="location-text-action" onClick={requestLocation} disabled={locationBusy}><LocateFixed size={15} />{locationBusy ? 'Finding pickup…' : 'Use current location'}</button>
      {notice && <p className="form-notice" role="alert">{notice}</p>}
      <div className="booking-controls">
        <div className="party-control">
          <span className="field-label">GROUP</span>
          <div className="stepper"><button type="button" aria-label="Remove passenger" onClick={() => setPartySize((size) => Math.max(1, size - 1))}>−</button><span aria-live="polite">{partySize}</span><button type="button" aria-label="Add passenger" onClick={() => setPartySize((size) => Math.min(6, size + 1))}>+</button></div>
        </div>
        <div className="vehicle-indicator"><span className="vehicle-icon"><Navigation size={16} /></span><span><span className="field-label">VEHICLE</span><strong>{vehicle}</strong></span></div>
        <button type="submit" className="book-submit">Check availability <ArrowRight size={16} /></button>
      </div>
      <p className="booking-fineprint"><ShieldCheck size={14} /> Requests are not sent until secure booking is available.</p>
    </form>
  );
}

function DestinationsPage() {
  const [query, setQuery] = useState('');
  const filtered = destinations.filter((place) => `${place.name} ${place.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="page-wrap inner-page">
      <div className="page-topline"><span>RISHIRIDE ATLAS</span><span>30°06′ N · 78°18′ E</span></div>
      <div className="page-title-row"><div><p className="eyebrow">THE PLACES AROUND US</p><h1>Rishikesh, <em>in places.</em></h1><p className="page-deck">Landmarks and river-side stops. Verified details are shown where available.</p></div><div className="place-total"><strong>{destinations.length.toString().padStart(2, '0')}</strong><span>PLACES</span></div></div>
      <div className="destination-toolbar"><label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a place" aria-label="Search destinations" />{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={15} /></button>}</label><span className="verified-note"><span /> OPENSTREETMAP + WIKIMEDIA COMMONS</span></div>
      {filtered.length ? <div className="destination-grid">{filtered.map((place, index) => <DestinationCard key={place.slug} destination={place} index={index} />)}</div> : <div className="empty-state"><Search size={23} /><h2>No places match that search.</h2><button onClick={() => setQuery('')}>Clear search</button></div>}
      <p className="data-note">Place pins, descriptions, ratings, and reviews are displayed only when a source confirms them. Map coordinates are not shown as a substitute for a place name.</p>
    </div>
  );
}

function DestinationCard({ destination, index }: { destination: Destination; index: number }) {
  return (
    <Link className={`destination-card destination-card-${index % 3}`} to={`/destinations/${destination.slug}`}>
      <div className="destination-image">
        {destination.photoUrl ? <img src={destination.photoUrl} alt={`${destination.name}, Rishikesh`} loading="lazy" /> : <div className="image-empty"><Compass size={25} /><span>PHOTO NOT AVAILABLE</span></div>}
        <span className="photo-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="card-open"><ArrowUpRight size={17} /></span>
      </div>
      <div className="destination-card-copy"><div><span className="category-label">{destination.category}</span><h2>{destination.name}</h2></div><span className="location-status">{destination.latitude !== null ? <><MapPin size={13} /> PIN VERIFIED</> : 'DETAILS PENDING'}</span></div>
      {destination.photoSource && <span className="image-source" onClick={(event) => event.preventDefault()}><a href={destination.photoSource} target="_blank" rel="noreferrer" aria-label={`View image source: ${destination.photoSourceName}`}>IMAGE SOURCE · COMMONS</a></span>}
    </Link>
  );
}

function DestinationPage() {
  const { slug } = useParams();
  const place = destinations.find((candidate) => candidate.slug === slug);
  if (!place) return <NotFoundPage />;
  return (
    <div className="page-wrap inner-page detail-page">
      <Link to="/destinations" className="back-link"><ArrowLeft size={15} /> All places</Link>
      <div className="detail-grid">
        <div className="detail-photo">{place.photoUrl ? <img src={place.photoUrl} alt={`${place.name}, Rishikesh`} /> : <div className="image-empty"><Compass size={27} /><span>PHOTO NOT AVAILABLE</span></div>}{place.photoSource && <a href={place.photoSource} target="_blank" rel="noreferrer" className="photo-credit">IMAGE: {place.photoSourceName?.toUpperCase()} <ArrowUpRight size={12} /></a>}</div>
        <div className="detail-copy"><p className="eyebrow">{place.category.toUpperCase()} · RISHIKESH</p><h1>{place.name}</h1><p className="detail-description">{place.description ?? 'A verified description is not available yet.'}</p><dl className="detail-facts"><div><dt>LOCATION</dt><dd>{place.latitude !== null && place.longitude !== null ? 'Mapped pin confirmed' : 'Location pin not verified'}</dd></div><div><dt>RATING</dt><dd>{place.rating === null ? 'No verified rating' : `${place.rating} / 5`}</dd></div><div><dt>REVIEWS</dt><dd>{place.reviews === null ? 'No verified reviews' : place.reviews}</dd></div></dl>{place.latitude !== null && <p className="pin-caption"><MapPin size={15} /> Place name verified via OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Attribution</a></p>}<Link className="book-place" to={`/?destination=${encodeURIComponent(place.name)}`}>Set as destination <ArrowRight size={16} /></Link></div>
      </div>
    </div>
  );
}

function AccountPage({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const [role, setRole] = useState<'passenger' | 'driver'>('passenger');
  const [message, setMessage] = useState('');
  const isSignUp = mode === 'sign-up';
  const roleName = role === 'passenger' ? 'Passenger' : 'Driver';
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(apiBase
      ? 'Authentication endpoint is not configured in this preview. No account action was taken.'
      : 'Account access is unavailable because secure authentication is not configured. No credentials were sent or stored.');
  };
  return (
    <div className="account-page">
      <div className="account-aside"><Link to="/" className="brand brand-light"><span className="brand-icon"><Navigation size={20} /></span><span className="brand-word">Rishi<span>Ride</span></span></Link><div className="account-aside-copy"><span>RISHIKESH, INDIA</span><p>Take the road<br /><em>that feels like yours.</em></p><small>Local journeys begin with a good first step.</small></div><div className="account-aside-image"><img src={destinations[3].photoUrl ?? ''} alt="Ram Jhula footbridge over the Ganges" /></div></div>
      <section className="account-content"><Link to="/" className="back-link"><ArrowLeft size={15} /> Back to booking</Link><div className="account-form-wrap"><p className="eyebrow">{isSignUp ? 'COME ON IN' : 'WELCOME BACK'}</p><h1>{isSignUp ? 'Create your account.' : 'Good to see you.'}</h1><p className="account-subtitle">Choose how you use RishiRide.</p><div className="role-toggle" role="group" aria-label="Account type"><button className={role === 'passenger' ? 'selected' : ''} onClick={() => setRole('passenger')}><span className="role-initial">P</span> Passenger</button><button className={role === 'driver' ? 'selected' : ''} onClick={() => setRole('driver')}><span className="role-initial">D</span> Driver</button></div><form className="account-form" onSubmit={submit}>{isSignUp && <label>Your name<input required autoComplete="name" placeholder="Name as you’d like to be known" /></label>}<label>Email address<input required type="email" autoComplete="email" placeholder="you@example.com" /></label><label>Password<input required type="password" autoComplete={isSignUp ? 'new-password' : 'current-password'} minLength={8} placeholder="At least 8 characters" /></label>{isSignUp && <label className="consent-check"><input type="checkbox" required /><span>I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.</span></label>}{message && <p className="form-notice account-notice" role="alert">{message}</p>}<button className="account-submit" type="submit">{isSignUp ? `Create ${roleName.toLowerCase()} account` : `Sign in as ${roleName.toLowerCase()}`}<ArrowRight size={16} /></button></form><p className="switch-account">{isSignUp ? 'Already registered?' : 'New to RishiRide?'} <Link to={isSignUp ? '/sign-in' : '/sign-up'}>{isSignUp ? 'Sign in' : 'Create an account'}</Link></p><p className="auth-privacy"><ShieldCheck size={14} /> Your credentials are not stored by this preview.</p></div></section>
    </div>
  );
}

function FaqPage() {
  const items = [
    ['Can I book a ride right now?', 'Not yet. Secure booking and driver matching are not configured, so no ride request can be sent from this preview.'],
    ['Which vehicle will suit my group?', 'The app selects an E-rickshaw for groups of up to three and a CNG auto-rickshaw for larger groups.'],
    ['Do you need my location?', 'Only if you choose Use current location. If you decline, you can enter a pickup manually.'],
    ['Where do destination details come from?', 'Place photos link to their Wikimedia Commons source. Pins and other details are shown only when verified.'],
  ];
  return <div className="page-wrap inner-page faq-page"><p className="eyebrow">GOOD TO KNOW</p><h1>Frequently asked<br /><em>questions.</em></h1><div className="faq-list">{items.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span className="faq-index">0{index + 1}</span>{question}<ChevronDown size={17} /></summary><p>{answer}</p></details>)}</div></div>;
}

function InfoPage({ title, eyebrow, body }: { title: string; eyebrow: string; body: string }) {
  return <div className="page-wrap inner-page info-page"><span className="eyebrow">{eyebrow}</span><h1>{title.split(' ').slice(0, -1).join(' ')} <em>{title.split(' ').slice(-1)}</em></h1><p className="page-deck">{body}</p><Link className="text-link" to="/">Return to ride booking <ArrowRight size={15} /></Link></div>;
}

function NotFoundPage() {
  return <div className="page-wrap inner-page not-found"><span className="eyebrow">OFF THE MAP</span><h1>This stop<br /><em>isn’t on our route.</em></h1><Link className="book-place" to="/">Back to RishiRide <ArrowRight size={16} /></Link></div>;
}

function SiteFooter() {
  return <footer className="site-footer"><div className="footer-inner"><Link to="/" className="brand"><span className="brand-icon"><Navigation size={18} /></span><span className="brand-word">Rishi<span>Ride</span></span></Link><span className="footer-note">A LOCAL RIDE THROUGH RISHIKESH</span><div className="footer-links"><Link to="/about">About</Link><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link></div><span className="copyright">© 2026 RishiRide</span></div></footer>;
}