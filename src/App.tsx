import React, { useState, useEffect, useLayoutEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Phone, Mail, MapPin, Clock, Menu, X, Sparkles, MessageSquare, 
  HelpCircle, ShieldCheck, Heart, ChefHat, CheckCircle2, ChevronRight, Copy, Palette,
  Instagram, Facebook, QrCode, Smartphone, Check, Landmark, Loader2, Star, Download, Printer,
  Mic, MicOff
} from 'lucide-react';

// Core Critical Components
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import CartDrawer from './components/CartDrawer';
import AIChat from './components/AIChat';
import OrderTracker from './components/OrderTracker';
import NotificationManager from './components/NotificationManager';
import FluidCursor from './components/FluidCursor';
import SmoothScroll from './components/SmoothScroll';
import CreativeStudioHero from './components/CreativeStudioHero';
import BranchLocations from './components/BranchLocations';
import FeaturedVideoReel from './components/FeaturedVideoReel';
import AmbientBakerySound from './components/AmbientBakerySound';
import NavSearchBar from './components/NavSearchBar';
import OfflineSyncBanner from './components/OfflineSyncBanner';
import TopQuickAccessBar from './components/TopQuickAccessBar';
import Header from './components/Header';
import NavigationSidebar from './components/NavigationSidebar';
import HomeEditorialSections from './components/HomeEditorialSections';
import StoryPage from './components/StoryPage';
import ContactPage from './components/ContactPage';
import FindUsPage from './components/FindUsPage';
import ThemeStudioPage from './components/ThemeStudioPage';
import SplitScreenSlider from './components/SplitScreenSlider';
import EditorialTextBridge from './components/EditorialTextBridge';
import EditorialSliderOutro from './components/EditorialSliderOutro';
import Interactive3DMuffinShowcase from './components/Interactive3DMuffinShowcase';

// Lazy-Loaded Heavy Components for Rapid Initial Page Load
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const KitchenReceipt = lazy(() => import('./components/KitchenReceipt'));
const KitchenTimeModal = lazy(() => import('./components/KitchenTimeModal'));
const ThemeSelectorModal = lazy(() => import('./components/ThemeSelectorModal'));

// Dynamic Confetti Trigger
const triggerConfetti = async (options: any) => {
  try {
    const confetti = (await import('canvas-confetti')).default;
    confetti(options);
  } catch (e) {
    console.warn('Confetti load error:', e);
  }
};

import { CartItem, Order } from './types';
import MuffinnsLogo from './components/MuffinnsLogo';
import { initFirestoreMenuSync } from './utils/menuStorage';
import { initOfflineOrderAutoSync } from './utils/offlineOrderDB';
import { addInquiryToFirestore } from './firebase/config';

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg 
    className={className} 
    fill="currentColor" 
    viewBox="0 0 24 24" 
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.32a6.33 6.33 0 0 0-1-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.28 8.28 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.01-.1z" />
  </svg>
);

export type AppView = 'home' | 'menu' | 'story' | 'contact' | 'find-us' | 'theme-studio' | 'tracker' | 'admin';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p.startsWith('/admin') || p.startsWith('/bwp-panel-7781')) {
        return 'admin';
      }
    }
    return 'home';
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  
  // Theme configuration states - Luxury Atelier (Main) & Muffin Galaxy
  const [theme, setTheme] = useState<string>('luxury_main');
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isKitchenTimeOpen, setIsKitchenTimeOpen] = useState(false);
  
  // Theme Transition Wipe effect state & preloading CSS variables
  const isInitialMountRef = useRef(true);
  const [themeTransition, setThemeTransition] = useState<{ label: string; themeKey: string } | null>(null);

  // Synchronize body class and preload theme CSS variables for seamless switching
  useLayoutEffect(() => {
    const root = document.documentElement;
    // Remove stale theme classes on html/body
    root.classList.forEach((cls) => {
      if (cls.startsWith('theme-')) {
        root.classList.remove(cls);
      }
    });
    root.classList.add(`theme-${theme}`);

    // Pre-load theme specific CSS variable overrides for instant smooth rendering
    const THEME_VARIABLE_MAP: Record<string, Record<string, string>> = {
      luxury_main: {
        '--color-brand-cream': '#FFFFFF',
        '--color-brand-sugar': '#FCFAF8',
        '--color-brand-caramel': '#E94F16',
        '--color-brand-honey': '#FF792B',
        '--color-brand-gold': '#F4B34D',
        '--color-brand-chocolate': '#32140D',
        '--color-brand-espresso': '#21100B',
        '--color-brand-marshmallow': '#FBF8F5',
        '--color-brand-glaze': 'rgba(233, 79, 22, 0.08)'
      },
      muffin_galaxy: {
        '--color-brand-cream': '#1A1423',
        '--color-brand-sugar': '#2A1B3D',
        '--color-brand-caramel': '#F4A261',
        '--color-brand-honey': '#E76F51',
        '--color-brand-gold': '#E9C46A',
        '--color-brand-chocolate': '#FFF8F0',
        '--color-brand-espresso': '#372254',
        '--color-brand-marshmallow': '#372254',
        '--color-brand-glaze': 'rgba(244, 162, 97, 0.22)'
      }
    };

    const vars = THEME_VARIABLE_MAP[theme];
    if (vars) {
      Object.entries(vars).forEach(([prop, value]) => {
        root.style.setProperty(prop, value);
      });
    }

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    const themeLabels: Record<string, string> = {
      luxury_main: 'Muffinns Luxury Atelier 👑',
      muffin_galaxy: 'Muffin Galaxy 🪐'
    };

    setThemeTransition({
      label: themeLabels[theme] || theme,
      themeKey: theme
    });

    const timer = setTimeout(() => {
      setThemeTransition(null);
    }, 850);

    return () => clearTimeout(timer);
  }, [theme]);

  // Sync menu items & photos with Firestore DB backend
  useEffect(() => {
    initFirestoreMenuSync();
  }, []);
  
  // Tracked order states
  const [newlyPlacedOrder, setNewlyPlacedOrder] = useState<Order | null>(null);
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [selectedTrackerId, setSelectedTrackerId] = useState('');
  
  // Navigation Search Query State
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // Trigger 'Celebrate!' confetti explosion effect when an order is newly placed
  // Listen and auto-sync offline orders stored in IndexedDB when internet reconnects
  useEffect(() => {
    const cleanupOfflineSync = initOfflineOrderAutoSync((syncedOrder) => {
      triggerConfetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 99999,
        colors: ['#10B981', '#34D399', '#059669', '#F59E0B']
      });
    });

    return () => {
      cleanupOfflineSync();
    };
  }, []);

  useEffect(() => {
    if (newlyPlacedOrder) {
      // Main center burst
      triggerConfetti({
        particleCount: 130,
        spread: 100,
        origin: { y: 0.55 },
        zIndex: 99999,
        colors: ['#D97706', '#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#3B82F6', '#EF4444']
      });

      // Left and right side celebration cannons
      const timer1 = setTimeout(() => {
        triggerConfetti({
          particleCount: 80,
          angle: 60,
          spread: 65,
          origin: { x: 0.1, y: 0.65 },
          zIndex: 99999,
          colors: ['#F59E0B', '#EC4899', '#10B981', '#3B82F6', '#D97706']
        });
        triggerConfetti({
          particleCount: 80,
          angle: 120,
          spread: 65,
          origin: { x: 0.9, y: 0.65 },
          zIndex: 99999,
          colors: ['#F59E0B', '#EC4899', '#10B981', '#3B82F6', '#D97706']
        });
      }, 220);

      // Final shower explosion
      const timer2 = setTimeout(() => {
        triggerConfetti({
          particleCount: 60,
          spread: 120,
          origin: { y: 0.4 },
          zIndex: 99999,
          scalar: 1.15,
          colors: ['#F43F5E', '#10B981', '#F59E0B', '#8B5CF6']
        });
      }, 480);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [newlyPlacedOrder]);

  // Inquiry Form states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryRating, setInquiryRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Speech Dictation states for Feedback & Complaints Form
  const [isDictating, setIsDictating] = useState(false);
  const [dictationError, setDictationError] = useState<string | null>(null);
  const [dictationSupported, setDictationSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API browser availability
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setDictationSupported(false);
    }
  }, []);

  const handleToggleDictation = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setDictationError("Web Speech API is not supported in this browser environment. Please type your message manually.");
      setDictationSupported(false);
      return;
    }

    if (isDictating) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('Stopping speech recognition:', e);
        }
      }
      setIsDictating(false);
      return;
    }

    setDictationError(null);

    // Optional microphone permission check via getUserMedia if supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the temporary track immediately after permission check
        stream.getTracks().forEach(track => track.stop());
      } catch (micErr: any) {
        console.warn('Microphone permission check warning:', micErr);
        if (micErr.name === 'NotAllowedError' || micErr.name === 'PermissionDeniedError') {
          setDictationError("Microphone permission denied. Please allow microphone access in your browser settings to use voice dictation.");
          setIsDictating(false);
          return;
        }
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // Keep track of text prior to start of current dictation session
      let initialText = inquiryMessage;

      recognition.onstart = () => {
        setIsDictating(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        const spacePrefix = initialText && !initialText.endsWith(' ') ? ' ' : '';
        setInquiryMessage(initialText ? `${initialText}${spacePrefix}${transcript}` : transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied' || event.error === 'service-not-allowed') {
          setDictationError("Microphone access blocked or permission denied. Please grant microphone access in browser settings or type your message manually.");
        } else if (event.error === 'no-speech') {
          setDictationError("No speech detected. Please speak clearly into your microphone.");
        } else if (event.error === 'aborted') {
          // Dictation stopped by user or system
        } else {
          setDictationError(`Voice dictation issue (${event.error}). Please type your message manually.`);
        }
        setIsDictating(false);
      };

      recognition.onend = () => {
        setIsDictating(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      setDictationError("Microphone access permission required. Please enable microphone access or type manually.");
      setIsDictating(false);
    }
  };

  // Cart Handlers
  const handleAddToCart = (newCartItem: CartItem) => {
    setCart(prevCart => {
      // Check if item with same ID, selected size, and same notes already exists
      const existingIndex = prevCart.findIndex(item => 
        item.item.id === newCartItem.item.id && 
        item.selectedSize?.label === newCartItem.selectedSize?.label &&
        item.notes === newCartItem.notes
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += newCartItem.quantity;
        return updated;
      }
      return [...prevCart, newCartItem];
    });
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    setCart(prevCart => {
      const updated = [...prevCart];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart(prevCart => prevCart.filter((_, idx) => idx !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleReorderAll = (itemsToReorder: CartItem[]) => {
    itemsToReorder.forEach(item => {
      handleAddToCart(item);
    });
    setIsCartOpen(true);
  };

  const handleOrderPlaced = (order: Order) => {
    setIsCartOpen(false);
    setNewlyPlacedOrder(order);
    
    // Save to tracked list so background polling can alert status changes
    try {
      const currentTracked = JSON.parse(localStorage.getItem('muffinns_tracked_orders') || '[]');
      if (!currentTracked.includes(order.id)) {
        currentTracked.unshift(order.id);
        localStorage.setItem('muffinns_tracked_orders', JSON.stringify(currentTracked));
      }
      
      // Save order snapshot to history array in localStorage
      const currentHistory: Order[] = JSON.parse(localStorage.getItem('muffinns_order_history') || '[]');
      const existingIdx = currentHistory.findIndex(o => o.id.toUpperCase() === order.id.toUpperCase());
      if (existingIdx > -1) {
        currentHistory[existingIdx] = order;
      } else {
        currentHistory.unshift(order);
      }
      localStorage.setItem('muffinns_order_history', JSON.stringify(currentHistory));

      // Save initial status to prevent false alarm on first load
      const currentStatuses = JSON.parse(localStorage.getItem('muffinns_order_statuses') || '{}');
      currentStatuses[order.id] = order.status;
      localStorage.setItem('muffinns_order_statuses', JSON.stringify(currentStatuses));
    } catch (e) {
      console.error('Error saving new order to localStorage tracking list:', e);
    }
  };

  const handleCopyInvoice = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  const handlePostInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus(null);
    setInquirySubmitting(true);

    const payload = {
      name: inquiryName.trim(),
      email: inquiryEmail.trim(),
      phone: inquiryPhone.trim(),
      subject: inquirySubject.trim(),
      message: inquiryMessage.trim(),
      rating: inquiryRating
    };

    try {
      let recorded = false;
      try {
        const response = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            recorded = true;
          }
        }
      } catch (fetchErr) {
        // Local /api/inquiries unavailable (e.g. Netlify static hosting)
      }

      // If server wasn't reachable or returned non-200, record directly to Firestore
      if (!recorded) {
        await addInquiryToFirestore(payload);
        recorded = true;
      }

      if (recorded) {
        setInquiryStatus({
          type: 'success',
          text: `Thank you, ${inquiryName}! Your ${inquiryRating}-Star feedback has been recorded. Our management team at Muffinnscomplain@gmail.com has been notified.`
        });
        // Clear form
        setInquiryName('');
        setInquiryEmail('');
        setInquiryPhone('');
        setInquirySubject('');
        setInquiryMessage('');
        setInquiryRating(5);
        setHoverRating(0);
      } else {
        setInquiryStatus({ type: 'error', text: 'Failed to submit feedback.' });
      }
    } catch (err) {
      setInquiryStatus({ type: 'error', text: 'Connection issue. Please email Muffinnscomplain@gmail.com directly.' });
    } finally {
      setInquirySubmitting(false);
    }
  };

  // Quick navigate & smooth scroll helper
  const scrollToSection = (sectionId: string) => {
    if (activeView !== 'home') {
      setActiveView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNavigate = (view: AppView | 'chat') => {
    if (view === 'chat') {
      setIsChatOpen(true);
      return;
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchNavigation = (query: string) => {
    setActiveSearchQuery(query);
    setActiveView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddFeaturedItem = (item: any) => {
    handleAddToCart(item);
    setRecentlyAddedId(item.id);
    setTimeout(() => setRecentlyAddedId(null), 2000);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden bg-brand-cream flex flex-col justify-between selection:bg-brand-caramel selection:text-brand-cream font-sans theme-${theme} relative`}>
      
      {/* Lenis Smooth Scrolling for whole page synced with GSAP */}
      <SmoothScroll />
      
      {/* Global Page-Wipe & Fade Overlay Effect on Theme Switch */}
      <AnimatePresence>
        {themeTransition && (
          <motion.div
            key={`theme-wipe-${themeTransition.themeKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden"
          >
            {/* Top curtain wiping down */}
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: ['-100%', '0%', '0%', '-100%'] }}
              transition={{ duration: 0.8, times: [0, 0.35, 0.65, 1], ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-brand-chocolate via-brand-chocolate to-amber-950 text-brand-cream border-b-2 border-brand-caramel/50 shadow-2xl"
            />
            
            {/* Bottom curtain wiping up */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: ['100%', '0%', '0%', '100%'] }}
              transition={{ duration: 0.8, times: [0, 0.35, 0.65, 1], ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-chocolate via-brand-chocolate to-amber-950 text-brand-cream border-t-2 border-brand-caramel/50 shadow-2xl"
            />

            {/* Glowing Center Aesthetic Badge */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: [0.7, 1.05, 1, 0.85], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.8, times: [0, 0.3, 0.7, 1] }}
              className="relative z-10 text-center space-y-2 p-6 px-8 rounded-3xl bg-brand-sugar/95 border-2 border-brand-caramel shadow-2xl text-brand-chocolate backdrop-blur-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-brand-caramel flex items-center justify-center mx-auto shadow-inner">
                <Palette className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-honey block">Switched Theme</span>
                <h3 className="font-serif font-black text-xl text-brand-chocolate tracking-tight">{themeTransition.label}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Luxury Atelier Ambient Background Light Atmosphere */}
      {theme === 'luxury_main' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#F4B34D]/8 via-[#E94F16]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 left-10 w-[700px] h-[700px] bg-gradient-to-tr from-[#FF792B]/6 via-[#32140D]/3 to-transparent rounded-full blur-3xl pointer-events-none" />
        </div>
      )}

      {/* Cosmic Space Nebula & Orbiting Muffin Asteroids System for Muffin Galaxy theme */}
      {theme === 'muffin_galaxy' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Ambient Cosmic Nebula Glow Clouds */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#F4A261]/20 via-[#E76F51]/15 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-gradient-to-tr from-[#2A1B3D]/80 via-[#E9C46A]/15 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" />
          
          {/* Twinkling Cosmic Stars & Floating Muffin Asteroids */}
          {[...Array(30)].map((_, i) => {
            const isMuffin = i % 5 === 0;
            const isLargeStar = i % 2 === 0;
            const size = isMuffin ? 24 : isLargeStar ? 6 : 3;
            const left = `${(i * 3.3) % 100}%`;
            const colors = ['#F4A261', '#E76F51', '#E9C46A', '#FFF8F0', '#E9C46A'];
            const color = colors[i % colors.length];

            return (
              <motion.div
                key={`galaxy-star-${i}`}
                initial={{ y: `${(i * 12) % 100}vh`, opacity: 0.2 }}
                animate={{ 
                  y: [`${(i * 12) % 100}vh`, `${((i * 12) + 100) % 110}vh`],
                  x: [0, (i % 2 === 0 ? 30 : -30)],
                  opacity: [0.2, 0.9, 0.3],
                  scale: isMuffin ? [0.9, 1.15, 0.9] : [0.8, 1.3, 0.8]
                }}
                transition={{
                  duration: isMuffin ? 18 + i : 8 + (i % 5),
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  left,
                  top: '0%',
                  width: size,
                  height: size,
                  filter: `drop-shadow(0 0 8px ${color})`,
                }}
              >
                {isMuffin ? (
                  <span className="text-lg leading-none select-none filter drop-shadow-[0_0_10px_rgba(244,162,97,0.8)]">
                    🧁
                  </span>
                ) : (
                  <div 
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      )}
      
      {/* ================= CLEAN EDITORIAL HEADER & SLIDE-OUT SIDEBAR ================= */}
      {/* On homepage, Hero's animated header seamlessly takes charge; on subpages, Header provides persistent navigation */}
      {activeView !== 'home' && (
        <Header
          activeView={activeView}
          onNavigate={handleNavigate}
          onOpenSidebar={() => setIsNavSidebarOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={totalCartCount}
        />
      )}

      <NavigationSidebar
        isOpen={isNavSidebarOpen}
        onClose={() => setIsNavSidebarOpen(false)}
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      {/* Persistent Offline Orders Synchronization Banner */}
      <OfflineSyncBanner 
        onNavigateToOrder={(orderId) => {
          setSelectedTrackerId(orderId);
          setActiveView('tracker');
        }}
        onOrderSynced={(order) => {
          setNewlyPlacedOrder(order);
        }}
      />

      {/* ================= PRIMARY APP VIEWPORT ================= */}
      <main className="flex-grow w-full max-w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div
              key="view-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-0"
            >
              <Hero 
                onNavigate={handleNavigate} 
                onOpenOrderNow={() => handleNavigate('menu')}
                onOpenSidebar={() => setIsNavSidebarOpen(true)}
                onOpenCart={() => setIsCartOpen(true)}
                cartCount={totalCartCount}
                theme={theme}
              />
              
              {/* Bespoke Creative Studio Hero & Showcase with proper distance and minimal elegance */}
              <div className="relative w-full my-16 sm:my-28">
                <CreativeStudioHero onNavigate={handleNavigate} />
              </div>

              {/* Editorial Text Bridge with generous gap before scroll animation */}
              <EditorialTextBridge onNavigate={handleNavigate} />
              
              {/* Pinned Split-Screen Reel Showreel */}
              <SplitScreenSlider onNavigate={handleNavigate} />
              
              {/* Editorial Outro with generous gap and curated catalogue introduction */}
              <EditorialSliderOutro onNavigate={handleNavigate} />

              {/* Complete Home Editorial Sections with generous breathing room */}
              <HomeEditorialSections
                onNavigate={handleNavigate}
                onAddToCart={handleAddFeaturedItem}
                addedItemId={recentlyAddedId}
              />
            </motion.div>
          )}

          {activeView === 'menu' && (
            <motion.div
              key="view-menu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Editorial Menu Title Header */}
              <div className="pt-24 pb-10 bg-brand-sugar border-b border-brand-caramel/10 text-center px-4">
                <span className="text-[11px] uppercase tracking-[0.3em] text-brand-honey font-bold block">
                  Artisanal Catalogue · Bahawalpur
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl text-brand-chocolate font-bold mt-2">
                  Complete Bakery Catalogue
                </h1>
                <p className="text-xs sm:text-sm text-brand-chocolate/70 max-w-xl mx-auto mt-2.5 font-sans leading-relaxed">
                  Browse all 120+ freshly baked breads, signature sweets, customized celebration cakes, and savory afternoon snacks.
                </p>
              </div>

              <div id="menu-section" className="w-full">
                <MenuSection 
                  onAddToCart={handleAddToCart} 
                  onNavigateToCart={() => setIsCartOpen(true)}
                  initialSearchQuery={activeSearchQuery}
                  onSearchChange={setActiveSearchQuery}
                />
              </div>
            </motion.div>
          )}

          {activeView === 'story' && (
            <motion.div
              key="view-story"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <StoryPage onNavigateToMenu={() => handleNavigate('menu')} />
            </motion.div>
          )}

          {activeView === 'contact' && (
            <motion.div
              key="view-contact"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ContactPage />
            </motion.div>
          )}

          {activeView === 'find-us' && (
            <motion.div
              key="view-find-us"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <FindUsPage />
            </motion.div>
          )}

          {activeView === 'theme-studio' && (
            <motion.div
              key="view-theme-studio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ThemeStudioPage
                currentTheme={theme}
                onSelectTheme={(t) => setTheme(t as any)}
                onNavigateHome={() => handleNavigate('home')}
              />
            </motion.div>
          )}

          {activeView === 'tracker' && (
            <motion.div
              key="view-tracker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <OrderTracker 
                initialOrderId={selectedTrackerId}
                onAddToCart={handleAddToCart}
                onReorderAll={handleReorderAll}
                onOpenCart={() => setIsCartOpen(true)}
                onNavigateToMenu={() => setActiveView('menu')}
              />
            </motion.div>
          )}

          {activeView === 'admin' && (
            <motion.div
              key="view-admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Suspense fallback={
                <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-10 h-10 text-brand-caramel animate-spin" />
                  <p className="text-sm font-medium text-brand-chocolate/70">Loading Admin Dashboard...</p>
                </div>
              }>
                <AdminDashboard />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= SECONDARY PAGES EDITORIAL FOOTER ================= */}
      {activeView !== 'home' && (
        <footer className="bg-brand-chocolate text-brand-cream border-t border-brand-caramel/15 py-12 mt-16 font-sans">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MuffinnsLogo size={32} className="text-brand-honey" />
                <span className="font-serif font-black text-xl text-brand-cream">Muffinns</span>
                <span className="font-sans text-xs text-brand-honey font-bold" dir="rtl">پتاشے</span>
              </div>
              <p className="text-xs text-brand-cream/60 leading-relaxed font-sans">
                Artisanal confectionery & craft baking across Bahawalpur since 1988. Slow fermented doughs, pure desi ghee sweets, and custom celebrations.
              </p>
              <p className="text-[10px] text-brand-honey font-mono uppercase tracking-widest">
                Patashay Sweets & Bakers
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <h5 className="font-mono text-[11px] uppercase tracking-widest text-brand-honey font-bold">Navigation</h5>
              <div className="flex flex-col space-y-2 text-brand-cream/80 text-[11px] font-mono">
                <button onClick={() => handleNavigate('home')} className="hover:text-brand-caramel transition-colors cursor-pointer text-left">01 Home</button>
                <button onClick={() => handleNavigate('story')} className="hover:text-brand-caramel transition-colors cursor-pointer text-left">02 Our Story</button>
                <button onClick={() => handleNavigate('menu')} className="hover:text-brand-caramel transition-colors cursor-pointer text-left">03 Complete Menu</button>
                <button onClick={() => handleNavigate('find-us')} className="hover:text-brand-caramel transition-colors cursor-pointer text-left">04 Branches (Bahawalpur)</button>
                <button onClick={() => handleNavigate('contact')} className="hover:text-brand-caramel transition-colors cursor-pointer text-left">05 Contact & Inquiries</button>
                <button onClick={() => handleNavigate('theme-studio')} className="hover:text-brand-caramel transition-colors cursor-pointer text-left">06 Theme Studio</button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h5 className="font-mono text-[11px] uppercase tracking-widest text-brand-honey font-bold">Bahawalpur Hotlines</h5>
              <div className="space-y-1.5 text-xs text-brand-cream/80 font-mono">
                <p>0302 6567774 (Primary & WhatsApp)</p>
                <p>0332 6567774 (Order Desk)</p>
                <p>0331 6567780 (Inquiries)</p>
                <p className="text-[11px] text-brand-cream/50 pt-1">Email: info@muffinns.com</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h5 className="font-mono text-[11px] uppercase tracking-widest text-brand-honey font-bold">Hours & Oven Timings</h5>
              <p className="text-xs text-brand-cream/70 leading-relaxed font-sans">
                Ovens hot daily: 06:00 AM – 12:00 Midnight. Express home deliveries across all 7 Bahawalpur branch sectors.
              </p>
            </div>
          </div>
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-8 pt-6 border-t border-brand-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-brand-cream/40 font-mono">
            <p>© {new Date().getFullYear()} Muffinns Sweets & Bakers (Patashay), Bahawalpur. All rights reserved.</p>
            <p>Crafted with pure ingredients</p>
          </div>
        </footer>
      )}

      {/* ================= FLOATING ACTION ASSISTANCE ELEMENTS ================= */}
      
      {/* WhatsApp chat bubble */}
      <div className="fixed left-4 bottom-4 z-40 group">
        <div className="absolute left-0 bottom-16 bg-brand-chocolate text-brand-cream rounded-2xl p-3 shadow-2xl border border-brand-honey/30 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 w-64 space-y-2">
          <div className="text-[11px] font-bold text-brand-honey flex items-center gap-1.5 font-mono uppercase tracking-wider">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </div>
          <a
            href="https://wa.me/923026567774"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-white text-xs font-semibold transition-colors"
          >
            <span>Primary: 0302 6567774</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500 rounded text-emerald-950 font-bold">Chat</span>
          </a>
          <a
            href="https://wa.me/923326567774"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2 rounded-xl bg-emerald-700/30 hover:bg-emerald-700/50 text-white text-xs font-semibold transition-colors"
          >
            <span>Orders: 0332 6567774</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-400 rounded text-emerald-950 font-bold">Chat</span>
          </a>
        </div>

        <motion.a
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          href="https://wa.me/923026567774"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl relative cursor-pointer"
          title="WhatsApp Support (0302 6567774 / 0332 6567774)"
        >
          <Phone className="w-6 h-6 shrink-0" />
        </motion.a>
      </div>

      {/* Butler AI button launcher */}
      <div className="fixed right-4 bottom-4 z-40">
        <motion.button
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-brand-caramel hover:bg-brand-chocolate rounded-full flex items-center justify-center text-brand-cream shadow-2xl relative group cursor-pointer border border-brand-honey/35"
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-pulse" />}
          <span className="absolute right-16 bg-brand-chocolate text-brand-cream text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow border border-brand-honey/25 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
            Ask Sweet Butler AI
          </span>
        </motion.button>
      </div>

      {/* ================= CART OVERLAY DRAWER ================= */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
        onAddToCart={handleAddToCart}
        theme={theme}
      />

      {/* ================= SPECIAL VIRTUAL BUTLER CHATBOT WINDOW ================= */}
      <AIChat
        currentCart={cart}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onNavigateToMenu={() => handleNavigate('menu')}
        theme={theme}
      />

      {/* ================= ORDER SUCCESS COMPLETED DIALOG ================= */}
      <AnimatePresence>
        {newlyPlacedOrder && (
          <motion.div
            key="placed-order-dialog-backdrop"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-brand-chocolate/65 flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 75, scale: 0.88, rotateX: 6 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: -24, scale: 0.92, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
              transition={{
                type: 'spring',
                stiffness: 340,
                damping: 26,
                mass: 0.85
              }}
              className="bg-brand-sugar max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl border-2 border-brand-caramel/20 p-6 shadow-2xl text-center space-y-5 text-brand-chocolate transform-gpu"
            >
              {/* Header Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.15 }}
                className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-emerald-200 animate-bounce"
              >
                <CheckCircle2 className="w-9 h-9" />
              </motion.div>

              <div className="space-y-1">
                <h4 className="text-2xl font-serif font-black text-brand-chocolate">Bakery Order Placed!</h4>
                <p className="text-xs text-brand-chocolate/70 leading-relaxed font-sans">
                  The Muffinns bakers are pre-heating the stone ovens. Your invoice has been created:
                </p>
              </div>

              {/* Invoice Copier Box */}
              <div className="bg-brand-cream p-3.5 rounded-2xl border border-brand-caramel/10 flex items-center justify-between font-mono text-sm shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-brand-caramel tracking-widest font-sans">Invoice ID</span>
                  <span className="font-black text-brand-chocolate tracking-wider">{newlyPlacedOrder.id}</span>
                </div>
                <button
                  onClick={() => handleCopyInvoice(newlyPlacedOrder.id)}
                  className="p-1.5 hover:bg-brand-caramel/10 rounded-lg text-brand-chocolate hover:text-brand-caramel transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedInvoice ? <span className="text-[10px] text-emerald-600 font-sans font-bold">Copied!</span> : <Copy className="w-4 h-4 text-brand-caramel" />}
                </button>
              </div>

              {/* Status Note */}
              {newlyPlacedOrder.paymentMethod === 'Bank Transfer' ? (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-left space-y-1">
                  <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Bank Transfer Verification Pending</span>
                  </p>
                  <p className="text-[11px] text-brand-chocolate/80 leading-relaxed">
                    Please share your transaction screenshot with our bakery team on WhatsApp (<strong>0320 2587047</strong>) to expedite baking and dispatch.
                  </p>
                </div>
              ) : newlyPlacedOrder.paymentMethod === 'Cash on Delivery' ? (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-left space-y-1">
                  <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cash on Delivery Active</span>
                  </p>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Please have <strong>Rs. {newlyPlacedOrder.totalAmount.toLocaleString()}</strong> ready in cash at your doorstep upon delivery.
                  </p>
                </div>
              ) : null}

              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    const { generateReceiptPDF } = await import('./utils/pdfReceipt');
                    generateReceiptPDF(newlyPlacedOrder);
                  }}
                  className="px-4 py-3 bg-brand-cream hover:bg-brand-caramel/10 border border-brand-caramel/25 text-brand-chocolate font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-brand-caramel" />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    setNewlyPlacedOrder(null);
                  }}
                  className="px-4 py-3 bg-brand-cream hover:bg-brand-caramel/10 border border-brand-caramel/25 text-brand-chocolate font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  title="Print Kitchen & POS Receipt"
                >
                  <Printer className="w-3.5 h-3.5 text-brand-caramel" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTrackerId(newlyPlacedOrder.id);
                    setActiveView('tracker');
                    setNewlyPlacedOrder(null);
                  }}
                  className="flex-1 py-3 bg-brand-caramel hover:bg-brand-chocolate text-brand-cream font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Track Order Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setNewlyPlacedOrder(null)}
                  className="px-4 py-3 text-brand-chocolate hover:text-brand-caramel font-semibold text-xs rounded-xl transition-all border border-brand-caramel/10 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Kitchen Receipt for Browser Native Printing */}
      <Suspense fallback={null}>
        {newlyPlacedOrder && <KitchenReceipt order={newlyPlacedOrder} />}
      </Suspense>

      {/* Live Kitchen Time & Baking Schedule Modal */}
      <Suspense fallback={null}>
        {isKitchenTimeOpen && (
          <KitchenTimeModal
            isOpen={isKitchenTimeOpen}
            onClose={() => setIsKitchenTimeOpen(false)}
            onOrderNow={() => scrollToSection('menu-section')}
          />
        )}
      </Suspense>

      {/* Bakery 11-Theme Palette Selector Modal */}
      <Suspense fallback={null}>
        {isThemeModalOpen && (
          <ThemeSelectorModal
            isOpen={isThemeModalOpen}
            onClose={() => setIsThemeModalOpen(false)}
            currentTheme={theme}
            onSelectTheme={(newTheme) => setTheme(newTheme)}
          />
        )}
      </Suspense>

      {/* Global Push/Toast Notification Manager */}
      <NotificationManager 
        onNavigateToOrder={(orderId) => {
          setSelectedTrackerId(orderId);
          setActiveView('tracker');
          // Smooth scroll to tracking section if needed
          setTimeout(() => {
            document.getElementById('tracker-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }} 
      />

      {/* GPU Fluid Cursor Solver with difference ink swirls */}
      <FluidCursor />

    </div>
  );
}
