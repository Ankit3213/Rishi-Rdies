import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Compass,
  Clock3,
  LocateFixed,
  MapPin,
  Menu,
  Navigation,
  Plus,
  Search,
  ShieldCheck,
  Minus,
  Users,
  X,
} from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Destination, destinations } from './data/destinations';

const apiBase = (import.meta as ImportMeta & { env: { VITE_API_BASE_URL?: string } }).env.VITE_API_BASE_URL?.replace(/\/$/, '');

export default function App() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<PassengerDashboard />} />
          <Route path="/welcome" element={<HomePage />} />
          <Route path="/dashboard" element={<PassengerDashboard />} />
          <Route path="/booking" element={<BookingPage />} />
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
      <MobileNav />
    </div>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/booking', label: 'Book a ride', end: true },
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
    if (!pickup.trim() || !dropoff.trim()) {
      setNotice(!pickup.trim() ? 'Add a pickup point before continuing.' : 'Add a destination before continuing.');
      return;
    }
    const params = new URLSearchParams({ pickup: pickup.trim(), destination: dropoff.trim(), passengers: String(partySize) });
    navigate(`/booking?${params.toString()}`);
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
        <button type="submit" className="book-submit">Continue to booking <ArrowRight size={16} /></button>
      </div>
      <p className="booking-fineprint"><ShieldCheck size={14} /> Requests are not sent until secure booking is available.</p>
    </form>
  );
}

function PassengerDashboard() {
  const featuredPlaces = destinations.filter((place) => place.photoUrl).slice(0, 3);
  const [livePosition, setLivePosition] = useState<GeolocationPosition | null>(null);
  const [locationMessage, setLocationMessage] = useState('');
  const watchId = useRef<number | null>(null);

  useEffect(() => () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
  }, []);

  const stopLocation = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setLivePosition(null);
    setLocationMessage('Live location sharing is off.');
  };

  const startLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location is not supported on this device or browser.');
      return;
    }
    setLocationMessage('Waiting for location permission…');
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        setLivePosition(position);
        setLocationMessage('');
      },
      (error) => {
        setLocationMessage(error.code === error.PERMISSION_DENIED
          ? 'Location permission was denied. You can enable it in your browser or device settings.'
          : error.code === error.TIMEOUT
            ? 'Could not get a location fix in time. Try again or check your device signal.'
            : 'Could not read your location. Check your device settings and try again.');
        if (watchId.current !== null) {
          navigator.geolocation.clearWatch(watchId.current);
          watchId.current = null;
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
    );
  };

  const coordinatePickup = livePosition
    ? `Current location (${livePosition.coords.latitude.toFixed(5)}, ${livePosition.coords.longitude.toFixed(5)})`
    : '';

  return (
    <div className="page-wrap dashboard-page">
      <section className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> YOUR RISHIRIDE</p>
          <h1>Good morning,<br /><em>Rider.</em></h1>
          <p className="page-deck">Your next local journey starts here. Pick a place and we’ll help with the rest.</p>
          <Link className="dashboard-primary" to="/booking">Plan a ride <ArrowRight size={16} /></Link>
        </div>
        <div className="dashboard-welcome-image">
          <img src={destinations[0].photoUrl ?? ''} alt="Evening aarti on the river at Triveni Ghat" />
          <span className="dashboard-image-caption"><MapPin size={14} /> RISHIKESH, UTTARAKHAND</span>
          <span className="dashboard-image-index">30°06′ N<br />78°18′ E</span>
        </div>
      </section>

      <section className="dashboard-shortcuts" aria-label="Passenger shortcuts">
        <Link to="/booking" className="shortcut-card"><span className="shortcut-icon"><Navigation size={19} /></span><span><strong>Book a ride</strong><small>Set pickup and destination</small></span><ArrowUpRight size={16} /></Link>
        <Link to="/destinations" className="shortcut-card"><span className="shortcut-icon"><Compass size={19} /></span><span><strong>Explore places</strong><small>Find a stop around town</small></span><ArrowUpRight size={16} /></Link>
        <Link to="/faqs" className="shortcut-card"><span className="shortcut-icon"><CircleHelp size={19} /></span><span><strong>Ride help</strong><small>How RishiRide works</small></span><ArrowUpRight size={16} /></Link>
      </section>

      <section className="live-location-card" aria-labelledby="live-location-title">
        <span className={`live-location-icon ${livePosition ? 'is-live' : ''}`}><LocateFixed size={20} /></span>
        <div className="live-location-copy">
          <p className="eyebrow">YOUR DEVICE LOCATION</p>
          <h2 id="live-location-title">{livePosition ? 'Live location is on' : 'Find your current location'}</h2>
          {livePosition
            ? <p>Updated {new Date(livePosition.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · Accuracy ±{Math.round(livePosition.coords.accuracy)} m<br />{livePosition.coords.latitude.toFixed(5)}, {livePosition.coords.longitude.toFixed(5)}</p>
            : <p>Turn this on to use your phone or laptop’s location. Your browser will ask permission first.</p>}
          {locationMessage && <p className="live-location-message" role="status">{locationMessage}</p>}
        </div>
        {livePosition
          ? <div className="live-location-actions"><Link className="location-use-link" to={`/booking?pickup=${encodeURIComponent(coordinatePickup)}`}>Use for booking <ArrowRight size={14} /></Link><button className="location-stop-button" onClick={stopLocation}>Stop sharing</button></div>
          : <button className="location-start-button" onClick={startLocation}><LocateFixed size={15} /> Share live location</button>}
      </section>

      <section className="dashboard-activity">
        <div className="dashboard-section-heading">
          <div><p className="eyebrow">YOUR JOURNEYS</p><h2>Upcoming rides</h2></div>
          <span className="preview-tag">PREVIEW</span>
        </div>
        <div className="activity-empty">
          <span className="activity-icon"><CalendarDays size={21} /></span>
          <div><strong>No rides planned yet</strong><p>When booking is available, your upcoming trips will show up here.</p></div>
          <Link className="text-link" to="/booking">Plan a ride <ArrowRight size={15} /></Link>
        </div>
        <p className="booking-fineprint"><ShieldCheck size={14} /> Booking is not connected yet. No ride requests are sent from this preview.</p>
      </section>

      <section className="dashboard-places">
        <div className="discover-head">
          <div><p className="eyebrow">A LITTLE INSPIRATION</p><h2>Good places to go.</h2></div>
          <Link className="text-link" to="/destinations">All destinations <ArrowRight size={15} /></Link>
        </div>
        <div className="feature-destinations">
          {featuredPlaces.map((place, index) => <DestinationCard key={place.slug} destination={place} index={index} />)}
        </div>
      </section>
    </div>
  );
}

function BookingPage() {
  const [searchParams] = useSearchParams();
  const [pickup, setPickup] = useState(searchParams.get('pickup') ?? '');
  const [dropoff, setDropoff] = useState(searchParams.get('destination') ?? '');
  const requestedPassengers = Number(searchParams.get('passengers'));
  const [partySize, setPartySize] = useState(Number.isInteger(requestedPassengers) && requestedPassengers >= 1 && requestedPassengers <= 6 ? requestedPassengers : 1);
  const [notice, setNotice] = useState('');
  const [locationBusy, setLocationBusy] = useState(false);
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
    setNotice('Ride booking is not available yet. Your request has not been sent.');
  };

  return (
    <div className="page-wrap inner-page booking-page">
      <Link to="/dashboard" className="back-link"><ArrowLeft size={15} /> Passenger dashboard</Link>
      <div className="booking-page-heading">
        <div><p className="eyebrow">A LOCAL RIDE, YOUR WAY</p><h1>Plan your <em>journey.</em></h1><p className="page-deck">Add your trip details to see the right ride for your group.</p></div>
        <span className="booking-step"><span>01</span> TRIP DETAILS</span>
      </div>
      <div className="booking-page-layout">
        <form className="booking-page-form" onSubmit={submitBooking}>
          <section className="booking-form-section">
            <div className="form-section-title"><span>01</span><div><h2>Where to?</h2><p>Choose your pickup and destination.</p></div></div>
            <label className="booking-page-field"><span className="route-point pickup-point" /><span><small>PICKUP POINT</small><input required value={pickup} onChange={(event) => setPickup(event.target.value)} placeholder="Enter your pickup location" autoComplete="street-address" /></span></label>
            <button type="button" className="location-text-action booking-location-action" onClick={requestLocation} disabled={locationBusy}><LocateFixed size={15} />{locationBusy ? 'Finding pickup…' : 'Use current location'}</button>
            <label className="booking-page-field"><span className="route-point destination-point" /><span><small>DESTINATION</small><input required value={dropoff} onChange={(event) => setDropoff(event.target.value)} placeholder="Where do you want to go?" autoComplete="off" /></span></label>
            {notice && <p className="form-notice booking-notice" role="alert">{notice}</p>}
          </section>
          <section className="booking-form-section">
            <div className="form-section-title"><span>02</span><div><h2>Ride details</h2><p>We’ll match the vehicle to your group.</p></div></div>
            <div className="ride-details-grid">
              <div className="ride-detail-control"><span className="detail-control-icon"><Users size={17} /></span><span><small>PASSENGERS</small><strong>{partySize} {partySize === 1 ? 'person' : 'people'}</strong></span><div className="stepper"><button type="button" aria-label="Remove passenger" disabled={partySize <= 1} onClick={() => setPartySize((size) => Math.max(1, size - 1))}><Minus size={13} /></button><button type="button" aria-label="Add passenger" disabled={partySize >= 6} onClick={() => setPartySize((size) => Math.min(6, size + 1))}><Plus size={13} /></button></div></div>
              <label className="ride-detail-control"><span className="detail-control-icon"><CalendarDays size={17} /></span><span><small>RIDE DATE</small><input type="date" min={new Date().toISOString().slice(0, 10)} aria-label="Ride date" /></span></label>
              <label className="ride-detail-control"><span className="detail-control-icon"><Clock3 size={17} /></span><span><small>RIDE TIME</small><input type="time" aria-label="Ride time" /></span></label>
            </div>
          </section>
          <button type="submit" className="booking-confirm-button">Check ride availability <ArrowRight size={16} /></button>
          <p className="booking-fineprint"><ShieldCheck size={14} /> No ride request is sent until secure booking is available.</p>
        </form>
        <aside className="booking-summary">
          <p className="eyebrow">YOUR RIDE</p><h2>Trip summary</h2>
          <div className="summary-route"><span className="route-point pickup-point" /><span className="summary-route-copy"><small>PICKUP</small><strong>{pickup.trim() || 'Add a pickup point'}</strong></span></div>
          <div className="summary-route"><span className="route-point destination-point" /><span className="summary-route-copy"><small>DESTINATION</small><strong>{dropoff.trim() || 'Choose a destination'}</strong></span></div>
          <div className="summary-divider" />
          <div className="summary-vehicle"><span className="vehicle-icon"><Navigation size={16} /></span><span><small>RECOMMENDED VEHICLE</small><strong>{vehicle}</strong></span></div>
          <p className="summary-capacity">{partySize <= 3 ? 'Comfortable for up to 3 passengers' : 'For groups of 4–6 passengers'}</p>
          <div className="summary-unavailable"><ShieldCheck size={16} /><span>Fare estimates and driver matching will appear when booking launches.</span></div>
        </aside>
      </div>
      <section className="booking-discover">
        <div className="discover-head"><div><p className="eyebrow">STILL DECIDING?</p><h2>Explore destinations.</h2></div><Link className="text-link" to="/destinations">Browse all places <ArrowRight size={15} /></Link></div>
        <div className="booking-destination-links">{destinations.slice(0, 4).map((place) => <Link key={place.slug} to={`/booking?destination=${encodeURIComponent(place.name)}`}><MapPin size={14} />{place.name}<ArrowUpRight size={14} /></Link>)}</div>
      </section>
    </div>
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
    <article className={`destination-card destination-card-${index % 3}`}>
      <Link className="destination-card-link" to={`/destinations/${destination.slug}`}>
        <div className="destination-image">
          {destination.photoUrl ? <img src={destination.photoUrl} alt={`${destination.name}, Rishikesh`} loading="lazy" /> : <div className="image-empty"><Compass size={25} /><span>PHOTO NOT AVAILABLE</span></div>}
          <span className="photo-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="card-open"><ArrowUpRight size={17} /></span>
        </div>
        <div className="destination-card-copy"><div><span className="category-label">{destination.category}</span><h2>{destination.name}</h2></div><span className="location-status">{destination.latitude !== null ? <><MapPin size={13} /> PIN VERIFIED</> : 'DETAILS PENDING'}</span></div>
      </Link>
      {destination.photoSource && <a className="image-source" href={destination.photoSource} target="_blank" rel="noreferrer">IMAGE SOURCE · COMMONS</a>}
    </article>
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
        <div className="detail-copy"><p className="eyebrow">{place.category.toUpperCase()} · RISHIKESH</p><h1>{place.name}</h1><p className="detail-description">{place.description ?? 'A verified description is not available yet.'}</p><dl className="detail-facts"><div><dt>LOCATION</dt><dd>{place.latitude !== null && place.longitude !== null ? 'Mapped pin confirmed' : 'Location pin not verified'}</dd></div><div><dt>RATING</dt><dd>{place.rating === null ? 'No verified rating' : `${place.rating} / 5`}</dd></div><div><dt>REVIEWS</dt><dd>{place.reviews === null ? 'No verified reviews' : place.reviews}</dd></div></dl>{place.latitude !== null && <p className="pin-caption"><MapPin size={15} /> Place name verified via OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Attribution</a></p>}<Link className="book-place" to={`/booking?destination=${encodeURIComponent(place.name)}`}>Set as destination <ArrowRight size={16} /></Link></div>
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

function MobileNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Passenger navigation">
      <NavLink to="/" end><Navigation size={18} /><span>Home</span></NavLink>
      <NavLink to="/destinations"><Compass size={18} /><span>Places</span></NavLink>
      <NavLink to="/booking"><span className="mobile-book-icon"><Plus size={19} /></span><span>Book</span></NavLink>
      <NavLink to="/faqs"><CircleHelp size={18} /><span>Help</span></NavLink>
    </nav>
  );
}