import React, { useState, useEffect, useCallback, useRef } from 'react';

/*
 * אפליקציית לימוד קריאה לילדים - גרסה 7.1
 * עם גרפיקה מקצועית מלאה
 * תיקוני באגים: דליפות זיכרון, ניקוי timeouts, race conditions
 */

// ==================== ASSETS PATHS ====================
const ASSETS = {
  images: {
    // Mascots
    mascotHappy: '/assets/images/mascot_happy.png',
    mascotCelebrate: '/assets/images/mascot_celebrate.png',
    mascotThinking: '/assets/images/mascot_thinking.png',
    mascotEncourage: '/assets/images/mascot_encourage.png',
    // Backgrounds
    bgHome: '/assets/images/bg_home.png',
    bgLearn: '/assets/images/bg_learn.png',
    bgGame: '/assets/images/bg_game.png',
    // Buttons
    btnPrimary: '/assets/images/btn_primary.png',
    btnNav: '/assets/images/btn_nav.png',
    btnPlay: '/assets/images/btn_play.png',
    btnBack: '/assets/images/btn_back.png',
    // Icons
    iconHome: '/assets/images/icon_home.png',
    iconLearn: '/assets/images/icon_learn.png',
    iconStar: '/assets/images/icon_star.png',
    // Elements
    elementBubble: '/assets/images/element_bubble.png',
    elementCheck: '/assets/images/element_check.png',
    elementConfetti: '/assets/images/element_confetti.png',
    elementFrame: '/assets/images/element_frame.png',
    elementHeart: '/assets/images/element_heart.png',
  },
  audio: {
    success: '/assets/audio/sound_success.mp3',
    click: '/assets/audio/sound_click.mp3',
    wrong: '/assets/audio/sound_wrong.mp3',
  }
};

// ==================== LETTERS DATA ====================
const LETTERS = [
  { letter: 'א', name: 'אָלֶף', sound: 'אה', color: '#FF6B6B', words: [
    { text: 'אבא', emoji: '👨' },
    { text: 'אמא', emoji: '👩' },
    { text: 'אריה', emoji: '🦁' },
    { text: 'אבטיח', emoji: '🍉' },
  ]},
  { letter: 'ב', name: 'בֵּית', sound: 'בּ', color: '#4ECDC4', words: [
    { text: 'בית', emoji: '🏠' },
    { text: 'בננה', emoji: '🍌' },
    { text: 'בלון', emoji: '🎈' },
  ]},
  { letter: 'ג', name: 'גִימֶל', sound: 'גּ', color: '#FF69B4', words: [
    { text: 'גמל', emoji: '🐪' },
    { text: 'גלידה', emoji: '🍦' },
    { text: 'גזר', emoji: '🥕' },
  ]},
  { letter: 'ד', name: 'דָלֶת', sound: 'דּ', color: '#F39C12', words: [
    { text: 'דג', emoji: '🐟' },
    { text: 'דבש', emoji: '🍯' },
    { text: 'דלת', emoji: '🚪' },
  ]},
  { letter: 'ה', name: 'הֵא', sound: 'ה', color: '#1ABC9C', words: [
    { text: 'הר', emoji: '⛰️' },
    { text: 'היפופוטם', emoji: '🦛' },
  ]},
  { letter: 'ו', name: 'וָו', sound: 'ו', color: '#9B59B6', words: [
    { text: 'ורד', emoji: '🌹' },
    { text: 'וילון', emoji: '🪟' },
  ]},
  { letter: 'ז', name: 'זַיִן', sound: 'ז', color: '#3498DB', words: [
    { text: 'זברה', emoji: '🦓' },
    { text: 'זית', emoji: '🫒' },
  ]},
  { letter: 'ח', name: 'חֵית', sound: 'ח', color: '#E74C3C', words: [
    { text: 'חתול', emoji: '🐱' },
    { text: 'חלב', emoji: '🥛' },
    { text: 'חמור', emoji: '🫏' },
  ]},
  { letter: 'ט', name: 'טֵית', sound: 'ט', color: '#2ECC71', words: [
    { text: 'טלפון', emoji: '📱' },
    { text: 'טיל', emoji: '🚀' },
  ]},
  { letter: 'י', name: 'יוֹד', sound: 'י', color: '#E67E22', words: [
    { text: 'יד', emoji: '✋' },
    { text: 'ילד', emoji: '👦' },
    { text: 'ירח', emoji: '🌙' },
  ]},
  { letter: 'כ', name: 'כָּף', sound: 'כּ', color: '#8E44AD', words: [
    { text: 'כלב', emoji: '🐕' },
    { text: 'כוכב', emoji: '⭐' },
    { text: 'כדור', emoji: '⚽' },
  ]},
  { letter: 'ל', name: 'לָמֶד', sound: 'ל', color: '#16A085', words: [
    { text: 'לב', emoji: '❤️' },
    { text: 'לחם', emoji: '🍞' },
    { text: 'לימון', emoji: '🍋' },
  ]},
  { letter: 'מ', name: 'מֵם', sound: 'מ', color: '#D35400', words: [
    { text: 'מים', emoji: '💧' },
    { text: 'מלך', emoji: '👑' },
    { text: 'מטוס', emoji: '✈️' },
  ]},
  { letter: 'נ', name: 'נוּן', sound: 'נ', color: '#27AE60', words: [
    { text: 'נר', emoji: '🕯️' },
    { text: 'נמר', emoji: '🐆' },
    { text: 'נחש', emoji: '🐍' },
  ]},
  { letter: 'ס', name: 'סָמֶך', sound: 'ס', color: '#9370DB', words: [
    { text: 'סוס', emoji: '🐴' },
    { text: 'סירה', emoji: '⛵' },
  ]},
  { letter: 'ע', name: 'עַיִן', sound: 'ע', color: '#228B22', words: [
    { text: 'עץ', emoji: '🌳' },
    { text: 'עוגה', emoji: '🎂' },
    { text: 'ענן', emoji: '☁️' },
  ]},
  { letter: 'פ', name: 'פֵּא', sound: 'פּ', color: '#4169E1', words: [
    { text: 'פיל', emoji: '🐘' },
    { text: 'פרח', emoji: '🌸' },
    { text: 'פרפר', emoji: '🦋' },
  ]},
  { letter: 'צ', name: 'צָדִי', sound: 'צ', color: '#6B8E23', words: [
    { text: 'צב', emoji: '🐢' },
    { text: 'ציפור', emoji: '🐦' },
    { text: 'צפרדע', emoji: '🐸' },
  ]},
  { letter: 'ק', name: 'קוֹף', sound: 'ק', color: '#8B4513', words: [
    { text: 'קוף', emoji: '🐵' },
    { text: 'קשת', emoji: '🌈' },
    { text: 'קיפוד', emoji: '🦔' },
  ]},
  { letter: 'ר', name: 'רֵישׁ', sound: 'ר', color: '#DC143C', words: [
    { text: 'רכבת', emoji: '🚂' },
    { text: 'רגל', emoji: '🦶' },
    { text: 'רובוט', emoji: '🤖' },
  ]},
  { letter: 'ש', name: 'שִׁין', sound: 'שׁ', color: '#FFD700', words: [
    { text: 'שמש', emoji: '☀️' },
    { text: 'שועל', emoji: '🦊' },
    { text: 'שעון', emoji: '⏰' },
  ]},
  { letter: 'ת', name: 'תָּו', sound: 'תּ', color: '#FF4500', words: [
    { text: 'תפוח', emoji: '🍎' },
    { text: 'תות', emoji: '🍓' },
    { text: 'תרנגול', emoji: '🐓' },
  ]},
];

// ==================== STYLES ====================
const createStyles = () => ({
  // App Container - Full screen with background
  app: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    maxWidth: 500,
    margin: '0 auto',
    fontFamily: "'Rubik', 'Heebo', -apple-system, sans-serif",
    direction: 'rtl',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  // Background image layer
  bgLayer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
  },

  // Screen container
  screen: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 75,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
    overflow: 'hidden',
  },

  // Header
  header: {
    height: 65,
    minHeight: 65,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 15px',
    flexShrink: 0,
  },

  // Content area
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    overflow: 'hidden',
    minHeight: 0,
  },

  // Actions area - FIXED!
  actions: {
    height: 85,
    minHeight: 85,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: '0 15px',
    flexShrink: 0,
    background: 'rgba(255,255,255,0.3)',
  },

  // Navigation Bar
  navBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 75,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '25px 25px 0 0',
    boxShadow: '0 -5px 25px rgba(0,0,0,0.1)',
    padding: '0 10px',
    zIndex: 100,
  },

  // Nav button
  navBtn: {
    width: 60, height: 60,
    border: 'none',
    borderRadius: 18,
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.2s ease',
    padding: 5,
  },

  navBtnActive: {
    background: 'rgba(255,215,0,0.3)',
    transform: 'scale(1.1)',
  },

  navIcon: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },

  badge: {
    position: 'absolute',
    top: 2, right: 2,
    background: '#FF4081',
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    minWidth: 22, height: 22,
    borderRadius: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },

  // Image button (for primary actions)
  imgBtn: {
    height: 55,
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    padding: 0,
    transition: 'transform 0.1s ease',
  },

  imgBtnSmall: { height: 45 },
  imgBtnLarge: { height: 60 },

  // Mascot
  mascot: {
    width: 120,
    height: 120,
    objectFit: 'contain',
  },

  mascotSmall: { width: 80, height: 80 },
  mascotLarge: { width: 150, height: 150 },

  // Title
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2D3436',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    margin: '10px 0',
  },

  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },

  // Activity Cards
  activityCard: {
    width: '100%',
    maxWidth: 320,
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    padding: '12px 18px',
    marginBottom: 12,
    background: 'rgba(255,255,255,0.9)',
    borderRadius: 22,
    border: '3px solid',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },

  activityIcon: {
    width: 55, height: 55,
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    flexShrink: 0,
  },

  activityLabel: {
    fontSize: 20,
    fontWeight: 600,
    color: '#2D3436',
  },

  // Letter Display with Frame
  letterContainer: {
    position: 'relative',
    width: 180, height: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  letterFrame: {
    position: 'absolute',
    width: '100%', height: '100%',
    objectFit: 'contain',
    opacity: 0.9,
  },

  letterDisplay: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  letterChar: {
    fontSize: 85,
    fontWeight: 700,
    lineHeight: 1,
    textShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },

  letterName: {
    fontSize: 18,
    fontWeight: 500,
    color: '#555',
    marginTop: 5,
    background: 'rgba(255,255,255,0.8)',
    padding: '3px 12px',
    borderRadius: 10,
  },

  // Word display
  wordEmoji: {
    fontSize: 65,
    textAlign: 'center',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
  },

  wordText: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2D3436',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.8)',
    padding: '5px 20px',
    borderRadius: 15,
    marginTop: 5,
  },

  // Dots
  dots: {
    display: 'flex',
    gap: 10,
    marginTop: 10,
  },

  dot: {
    width: 12, height: 12,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.5)',
    border: '2px solid rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  },

  dotActive: {
    background: '#FFD93D',
    transform: 'scale(1.3)',
    boxShadow: '0 2px 8px rgba(255,217,61,0.5)',
  },

  // Options Grid
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 15,
    width: '100%',
    maxWidth: 300,
  },

  optionCard: {
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 55,
    fontWeight: 700,
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 22,
    border: '4px solid',
    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Progress box
  progressBox: {
    background: 'rgba(255,255,255,0.9)',
    padding: '8px 20px',
    borderRadius: 20,
    fontSize: 16,
    fontWeight: 600,
    color: '#555',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
  },

  // Stats
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.9)',
    padding: '12px 18px',
    borderRadius: 18,
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    minWidth: 80,
  },

  // Score display
  scoreBox: {
    background: 'rgba(255,255,255,0.95)',
    padding: '25px 50px',
    borderRadius: 28,
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    textAlign: 'center',
  },

  // Feedback overlay
  feedback: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    background: 'rgba(0,0,0,0.3)',
  },

  feedbackContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 30,
    borderRadius: 30,
    background: 'white',
    boxShadow: '0 10px 50px rgba(0,0,0,0.3)',
  },

  feedbackText: {
    fontSize: 28,
    fontWeight: 700,
    marginTop: 15,
  },

  // Small round button
  roundBtn: {
    width: 50, height: 50,
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'transform 0.1s',
  },

  roundBtnBlue: { background: 'linear-gradient(135deg, #4FC3F7, #2196F3)', color: 'white' },
  roundBtnGray: { background: 'linear-gradient(135deg, #BDBDBD, #9E9E9E)', color: 'white' },
});

const S = createStyles();

// ==================== HOOKS ====================

// FIX #6: Speech synthesis now cancels on unmount
function useSpeech() {
  const synth = useRef(null);
  useEffect(() => {
    synth.current = window.speechSynthesis;
    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);

  const speak = useCallback((text) => {
    if (!synth.current) return;
    synth.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'he-IL';
    u.rate = 0.85;
    synth.current.speak(u);
  }, []);

  return speak;
}

// FIX #1: Audio objects are now cached in a ref and reused
// FIX #5: Audio errors are logged to console instead of silently swallowed
function useSound() {
  const audioCache = useRef({});

  const play = useCallback((type) => {
    try {
      if (!audioCache.current[type]) {
        audioCache.current[type] = new Audio(ASSETS.audio[type]);
        audioCache.current[type].volume = 0.5;
      }
      const audio = audioCache.current[type];
      audio.currentTime = 0;
      audio.play().catch((e) => {
        console.warn('Audio playback failed for', type, e.message);
      });
    } catch (e) {
      console.warn('Audio creation failed for', type, e.message);
    }
  }, []);

  return play;
}

function useProgress() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('hebrew_app_v7');
      return saved ? JSON.parse(saved) : { learned: [], stars: 0, games: 0 };
    } catch { return { learned: [], stars: 0, games: 0 }; }
  });

  useEffect(() => {
    try { localStorage.setItem('hebrew_app_v7', JSON.stringify(data)); } catch {}
  }, [data]);

  const addLetter = useCallback((letter) => {
    setData(d => ({
      ...d,
      learned: d.learned.includes(letter) ? d.learned : [...d.learned, letter]
    }));
  }, []);

  const addStars = useCallback((n) => setData(d => ({ ...d, stars: d.stars + n })), []);
  const addGame = useCallback(() => setData(d => ({ ...d, games: d.games + 1 })), []);

  return { data, addLetter, addStars, addGame };
}

// ==================== COMPONENTS ====================

// Image-based button
function ImgButton({ src, onClick, size = 'medium', style, disabled }) {
  const sizeStyle = size === 'small' ? S.imgBtnSmall : size === 'large' ? S.imgBtnLarge : {};
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...S.imgBtn,
        ...sizeStyle,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <img src={src} alt="" style={{ height: '100%', objectFit: 'contain' }} />
    </button>
  );
}

// Round button with icon/emoji
function RoundButton({ children, onClick, color = 'gray', style }) {
  const colorStyle = color === 'blue' ? S.roundBtnBlue : S.roundBtnGray;
  return (
    <button onClick={onClick} style={{ ...S.roundBtn, ...colorStyle, ...style }}>
      {children}
    </button>
  );
}

// Navigation Bar
function NavBar({ current, onNavigate, stars }) {
  return (
    <div style={S.navBar}>
      <button
        style={{ ...S.navBtn, ...(current === 'achievements' ? S.navBtnActive : {}) }}
        onClick={() => onNavigate('achievements')}
      >
        <img src={ASSETS.images.iconStar} alt="הישגים" style={S.navIcon} />
        {stars > 0 && <span style={S.badge}>{stars > 99 ? '99+' : stars}</span>}
      </button>

      <button
        style={{ ...S.navBtn, ...(current === 'learn' ? S.navBtnActive : {}) }}
        onClick={() => onNavigate('learn')}
      >
        <img src={ASSETS.images.iconLearn} alt="לימוד" style={S.navIcon} />
      </button>

      <button
        style={{ ...S.navBtn, ...(current === 'home' ? S.navBtnActive : {}) }}
        onClick={() => onNavigate('home')}
      >
        <img src={ASSETS.images.iconHome} alt="בית" style={S.navIcon} />
      </button>
    </div>
  );
}

// Feedback Overlay
function Feedback({ type, onDone }) {
  const playSound = useSound();

  useEffect(() => {
    playSound(type === 'success' ? 'success' : 'wrong');
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone, playSound, type]);

  const mascot = type === 'success' ? ASSETS.images.mascotCelebrate : ASSETS.images.mascotEncourage;
  const text = type === 'success' ? 'כל הכבוד!' : 'ננסה שוב!';
  const color = type === 'success' ? '#4CAF50' : '#FF9800';

  return (
    <div style={S.feedback}>
      <div style={S.feedbackContent}>
        <img src={mascot} alt="" style={{ ...S.mascot, ...S.mascotLarge }} />
        <div style={{ ...S.feedbackText, color }}>{text}</div>
      </div>
    </div>
  );
}

// ==================== SCREENS ====================

// HOME SCREEN
// FIX #2: setTimeout in onClick wrapped with cleanup via ref
function HomeScreen({ onActivity, speak, progress }) {
  const playSound = useSound();
  const timerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => speak('שלום! בוא נלמד לקרוא!'), 600);
    return () => clearTimeout(t);
  }, [speak]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const activities = [
    { id: 'learn', icon: '📖', label: 'לימוד אותיות', color: '#4ECDC4' },
    { id: 'find', icon: '🔍', label: 'מצא את האות', color: '#FF6B6B' },
    { id: 'match', icon: '🎯', label: 'התאם לתמונה', color: '#FFD93D' },
  ];

  return (
    <div style={S.screen}>
      {/* Background */}
      <div style={{ ...S.bgLayer, backgroundImage: `url(${ASSETS.images.bgHome})` }} />

      {/* Header with Mascot */}
      <div style={{ ...S.header, justifyContent: 'center' }}>
        <img src={ASSETS.images.mascotHappy} alt="ינשוף" style={S.mascot} />
      </div>

      {/* Content */}
      <div style={S.content}>
        <h1 style={S.title}>לומדים לקרוא!</h1>

        {activities.map(act => (
          <div
            key={act.id}
            style={{ ...S.activityCard, borderColor: act.color }}
            onClick={() => {
              playSound('click');
              speak(act.label);
              if (timerRef.current) clearTimeout(timerRef.current);
              timerRef.current = setTimeout(() => onActivity(act.id), 400);
            }}
          >
            <div style={{ ...S.activityIcon, background: act.color, color: 'white' }}>
              {act.icon}
            </div>
            <span style={S.activityLabel}>{act.label}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ ...S.actions, background: 'transparent', gap: 15 }}>
        <div style={S.statBox}>
          <span style={{ fontSize: 26 }}>⭐</span>
          <span style={{ fontSize: 24, fontWeight: 700 }}>{progress.stars}</span>
          <span style={{ fontSize: 12, color: '#888' }}>כוכבים</span>
        </div>
        <div style={S.statBox}>
          <span style={{ fontSize: 26 }}>🔤</span>
          <span style={{ fontSize: 24, fontWeight: 700 }}>{progress.learned.length}</span>
          <span style={{ fontSize: 12, color: '#888' }}>אותיות</span>
        </div>
        <div style={S.statBox}>
          <span style={{ fontSize: 26 }}>🎮</span>
          <span style={{ fontSize: 24, fontWeight: 700 }}>{progress.games}</span>
          <span style={{ fontSize: 12, color: '#888' }}>משחקים</span>
        </div>
      </div>
    </div>
  );
}

// LEARN SCREEN
// FIX #4: speakNow added to useEffect dependency array
function LearnScreen({ speak, progress, addLetter, addStars, onBack }) {
  const [idx, setIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const playSound = useSound();

  const letter = LETTERS[idx];
  const word = letter.words[wordIdx];

  const speakNow = useCallback(() => {
    speak(`זו האות ${letter.name}. ${letter.name} אומרת ${letter.sound}. ${word.text}`);
  }, [speak, letter, word]);

  useEffect(() => {
    const t = setTimeout(speakNow, 500);
    return () => clearTimeout(t);
  }, [idx, wordIdx, speakNow]);

  const goNext = () => {
    if (wordIdx < letter.words.length - 1) {
      setWordIdx(w => w + 1);
    } else {
      setWordIdx(0);
      setIdx(i => (i + 1) % LETTERS.length);
    }
  };

  const goPrev = () => {
    if (wordIdx > 0) {
      setWordIdx(w => w - 1);
    } else if (idx > 0) {
      setIdx(i => i - 1);
      setWordIdx(0);
    }
  };

  const handleLearned = () => {
    playSound('click');
    addLetter(letter.letter);
    addStars(1);
    setFeedback('success');
  };

  return (
    <div style={S.screen}>
      {/* Background */}
      <div style={{ ...S.bgLayer, backgroundImage: `url(${ASSETS.images.bgLearn})` }} />

      {feedback && <Feedback type="success" onDone={() => { setFeedback(null); goNext(); }} />}

      {/* Header */}
      <div style={S.header}>
        <ImgButton src={ASSETS.images.btnBack} onClick={onBack} size="small" />
        <div style={S.progressBox}>{idx + 1} / {LETTERS.length}</div>
        <RoundButton onClick={speakNow} color="blue">🔊</RoundButton>
      </div>

      {/* Content */}
      <div style={S.content}>
        {/* Letter with frame */}
        <div style={S.letterContainer}>
          <img src={ASSETS.images.elementFrame} alt="" style={S.letterFrame} />
          <div style={S.letterDisplay}>
            <span style={{ ...S.letterChar, color: letter.color }}>{letter.letter}</span>
            <span style={S.letterName}>{letter.name}</span>
          </div>
        </div>

        {/* Word */}
        <div style={S.wordEmoji}>{word.emoji}</div>
        <div style={S.wordText}>{word.text}</div>

        {/* Dots */}
        <div style={S.dots}>
          {letter.words.map((_, i) => (
            <span key={i} style={{ ...S.dot, ...(i === wordIdx ? S.dotActive : {}) }} />
          ))}
        </div>
      </div>

      {/* Actions - ALWAYS VISIBLE */}
      <div style={S.actions}>
        <ImgButton src={ASSETS.images.btnNav} onClick={goPrev} size="small" style={{ transform: 'scaleX(-1)' }} />
        <ImgButton src={ASSETS.images.btnPrimary} onClick={handleLearned} size="large" />
        <ImgButton src={ASSETS.images.btnNav} onClick={goNext} size="small" />
      </div>
    </div>
  );
}

// FIND GAME SCREEN
// FIX #2 & #3: All timeouts tracked via ref and cleaned up on unmount;
// mounted ref prevents state updates after unmount
function FindGameScreen({ speak, addStars, addGame, onBack }) {
  const [phase, setPhase] = useState('intro');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const playSound = useSound();
  const TOTAL = 5;
  const timersRef = useRef([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const safeTimeout = useCallback((fn, delay) => {
    const id = setTimeout(() => {
      if (mountedRef.current) fn();
    }, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  const newRound = useCallback(() => {
    const shuffled = [...LETTERS].sort(() => Math.random() - 0.5);
    const t = shuffled[0];
    const opts = [t, ...shuffled.slice(1, 4)].sort(() => Math.random() - 0.5);
    setTarget(t);
    setOptions(opts);
    setSelected(null);
    setFeedback(null);
    safeTimeout(() => speak(`איפה האות ${t.name}?`), 400);
  }, [speak, safeTimeout]);

  const startGame = () => {
    playSound('click');
    setPhase('playing');
    setRound(0);
    setScore(0);
    newRound();
  };

  useEffect(() => {
    if (phase === 'intro') speak('מצא את האות!');
  }, [phase, speak]);

  const handlePick = (opt) => {
    if (selected) return;
    playSound('click');
    setSelected(opt.letter);

    if (opt.letter === target.letter) {
      setFeedback('success');
      setScore(s => s + 1);
      addStars(2);
      safeTimeout(() => {
        setFeedback(null);
        if (round + 1 < TOTAL) {
          setRound(r => r + 1);
          newRound();
        } else {
          addGame();
          setPhase('done');
          speak('מעולה! סיימת!');
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      safeTimeout(() => {
        setSelected(null);
        setFeedback(null);
        speak(`נסה שוב! איפה ${target.name}?`);
      }, 1500);
    }
  };

  // INTRO
  if (phase === 'intro') {
    return (
      <div style={S.screen}>
        <div style={{ ...S.bgLayer, backgroundImage: `url(${ASSETS.images.bgGame})` }} />
        <div style={S.header}>
          <ImgButton src={ASSETS.images.btnBack} onClick={onBack} size="small" />
          <div />
          <div />
        </div>
        <div style={{ ...S.content, gap: 20 }}>
          <img src={ASSETS.images.mascotHappy} alt="" style={{ ...S.mascot, ...S.mascotLarge }} />
          <div style={{ fontSize: 55 }}>🔍</div>
          <div style={S.title}>מצא את האות</div>
          <div style={S.subtitle}>שמע את שם האות ומצא אותה!</div>
        </div>
        <div style={S.actions}>
          <ImgButton src={ASSETS.images.btnPlay} onClick={startGame} size="large" />
        </div>
      </div>
    );
  }

  // DONE
  if (phase === 'done') {
    return (
      <div style={S.screen}>
        <div style={{ ...S.bgLayer, backgroundImage: `url(${ASSETS.images.bgGame})` }} />
        <div style={S.header} />
        <div style={{ ...S.content, gap: 20 }}>
          <img src={ASSETS.images.mascotCelebrate} alt="" style={{ ...S.mascot, ...S.mascotLarge }} />
          <div style={S.scoreBox}>
            <div style={{ fontSize: 22, color: '#666' }}>סיימת!</div>
            <div style={{ fontSize: 55, fontWeight: 700 }}>{score} / {TOTAL}</div>
            <div style={{ fontSize: 22, color: '#FFB800' }}>+{score * 2} ⭐</div>
          </div>
        </div>
        <div style={{ ...S.actions, flexDirection: 'column', gap: 10, height: 'auto', padding: '15px' }}>
          <ImgButton src={ASSETS.images.btnPlay} onClick={startGame} size="large" />
          <ImgButton src={ASSETS.images.btnBack} onClick={onBack} size="medium" />
        </div>
      </div>
    );
  }

  // PLAYING
  return (
    <div style={S.screen}>
      <div style={{ ...S.bgLayer, backgroundImage: `url(${ASSETS.images.bgGame})` }} />
      {feedback && <Feedback type={feedback} onDone={() => {}} />}

      <div style={S.header}>
        <ImgButton src={ASSETS.images.btnBack} onClick={onBack} size="small" />
        <div style={S.progressBox}>שאלה {round + 1} / {TOTAL}</div>
        <RoundButton onClick={() => speak(`איפה האות ${target?.name}?`)} color="blue">🔊</RoundButton>
      </div>

      <div style={S.content}>
        <img src={ASSETS.images.mascotThinking} alt="" style={{ ...S.mascot, ...S.mascotSmall, marginBottom: 10 }} />
        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 15, background: 'rgba(255,255,255,0.8)', padding: '8px 20px', borderRadius: 15 }}>
          איפה האות?
        </div>

        <div style={S.optionsGrid}>
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => handlePick(opt)}
              style={{
                ...S.optionCard,
                borderColor: opt.color,
                color: opt.color,
                background: selected === opt.letter
                  ? (opt.letter === target?.letter ? '#C8E6C9' : '#FFCDD2')
                  : 'rgba(255,255,255,0.95)',
              }}
            >
              {opt.letter}
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...S.actions, background: 'transparent' }}>
        <div style={{ ...S.progressBox, color: '#FFB800', fontWeight: 700, fontSize: 20 }}>⭐ {score * 2}</div>
      </div>
    </div>
  );
}

// MATCH GAME SCREEN
// FIX #2 & #3: Same timeout/mount safety as FindGameScreen
function MatchGameScreen({ speak, addStars, addGame, onBack }) {
  const [phase, setPhase] = useState('intro');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(null);
  const [word, setWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const playSound = useSound();
  const TOTAL = 5;
  const timersRef = useRef([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const safeTimeout = useCallback((fn, delay) => {
    const id = setTimeout(() => {
      if (mountedRef.current) fn();
    }, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  const newRound = useCallback(() => {
    const shuffled = [...LETTERS].sort(() => Math.random() - 0.5);
    const t = shuffled[0];
    const w = t.words[Math.floor(Math.random() * t.words.length)];
    const opts = [t, ...shuffled.slice(1, 4)].sort(() => Math.random() - 0.5);
    setTarget(t);
    setWord(w);
    setOptions(opts);
    setSelected(null);
    setFeedback(null);
    safeTimeout(() => speak(`${w.text}. באיזו אות מתחיל?`), 400);
  }, [speak, safeTimeout]);

  const startGame = () => {
    playSound('click');
    setPhase('playing');
    setRound(0);
    setScore(0);
    newRound();
  };

  useEffect(() => {
    if (phase === 'intro') speak('התאם את האות לתמונה!');
  }, [phase, speak]);

  const handlePick = (opt) => {
    if (selected || !target) return;
    playSound('click');
    setSelected(opt.letter);

    if (opt.letter === target.letter) {
      setFeedback('success');
      setScore(s => s + 1);
      addStars(2);
      safeTimeout(() => {
        setFeedback(null);
        if (round + 1 < TOTAL) {
          setRound(r => r + 1);
          newRound();
        } else {
          addGame();
          setPhase('done');
          speak('מעולה! סיימת!');
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      safeTimeout(() => {
        setSelected(null);
        setFeedback(null);
        speak(`נסה שוב!`);
      }, 1500);
    }
  };

  // INTRO
  if (phase === 'intro') {
    return (
      <div style={S.screen}>
        <div style={{ ...S.bgLayer, backgroundImage: `url(${ASSETS.images.bgGame})` }} />
        <div style={S.header}>
          <ImgButton src={ASSETS.images.btnBack} onClick={onBack} size="small" />
          <div />
          <div />
        </div>
        <div style={{ ...S.content, gap: 20 }}>
          <img src={ASSETS.images.mascotHappy} alt="" style={{ ...S.mascot, ...S.mascotLarge }} />
          <div style={{ fontSize: 55 }}>🎯</div>
          <div style={S.title}>התאם לתמונה</div>
          <div style={S.subtitle}>ראה את התמונה ובחר את האות!</div>
        </div>
        <div style={S.actions}>
          <ImgButton src={ASSETS.images.btnPlay} onClick={startGame} size="large" />
        </div>
      </div>
    );
  }

  // DONE
  if (phase === 'done') {
    return (
      <div style={S.screen}>
        <div style={{ ...S.bgLayer, backgroundImage: `url(${ASSETS.images.bgGame})` }} />
        <div style={S.header} />
        <div style={{ ...S.content, gap: 20 }}>
          <img src={ASSETS.images.mascotCelebrate} alt="" style={{ ...S.mascot, ...S.mascotLarge }} />
          <div style={S.scoreBox}>
            <div style={{ fontSize: 22, color: '#666' }}>סיימת!</div>
            <div style={{ fontSize: 55, fontWeight: 700 }}>{score} / {TOTAL}</div>
            <div style={{ fontSize: 22, color: '#FFB800' }}>+{score * 2} ⭐</div>
          </div>
        </div>
        <div style={{ ...S.actions, flexDirection: 'column', gap: 10, height: 'auto', padding: '15px' }}>
          <ImgButton src={ASSETS.images.btnPlay} onClick={startGame} size="large" />
          <ImgButton src={ASSETS.images.btnBack} onClick={onBack} size="medium" />
        </div>
      </div>
    );
  }

  // PLAYING
  return (
    <div style={S.screen}>
      <div style={{ ...S.bgLayer, backgroundImage: `url(${ASSETS.images.bgGame})` }} />
      {feedback && <Feedback type={feedback} onDone={() => {}} />}

      <div style={S.header}>
        <ImgButton src={ASSETS.images.btnBack} onClick={onBack} size="small" />
        <div style={S.progressBox}>שאלה {round + 1} / {TOTAL}</div>
        <RoundButton onClick={() => word && speak(`${word.text}. באיזו אות מתחיל?`)} color="blue">🔊</RoundButton>
      </div>

      <div style={S.content}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.95)',
          padding: '15px 40px',
          borderRadius: 25,
          boxShadow: '0 6px 25px rgba(0,0,0,0.12)',
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 65 }}>{word?.emoji}</span>
          <span style={{ fontSize: 24, fontWeight: 700, marginTop: 5 }}>{word?.text}</span>
        </div>

        <div style={S.optionsGrid}>
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => handlePick(opt)}
              style={{
                ...S.optionCard,
                borderColor: opt.color,
                color: opt.color,
                background: selected === opt.letter
                  ? (opt.letter === target?.letter ? '#C8E6C9' : '#FFCDD2')
                  : 'rgba(255,255,255,0.95)',
              }}
            >
              {opt.letter}
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...S.actions, background: 'transparent' }}>
        <div style={{ ...S.progressBox, color: '#FFB800', fontWeight: 700, fontSize: 20 }}>⭐ {score * 2}</div>
      </div>
    </div>
  );
}

// ACHIEVEMENTS SCREEN
function AchievementsScreen({ progress, speak, onBack }) {
  useEffect(() => {
    speak(`יש לך ${progress.stars} כוכבים!`);
  }, [speak, progress.stars]);

  return (
    <div style={S.screen}>
      <div style={{ ...S.bgLayer, backgroundImage: `url(${ASSETS.images.bgHome})` }} />

      <div style={S.header}>
        <ImgButton src={ASSETS.images.btnBack} onClick={onBack} size="small" />
        <div style={{ fontSize: 22, fontWeight: 700 }}>ההישגים שלי</div>
        <div style={{ width: 45 }} />
      </div>

      <div style={{ ...S.content, justifyContent: 'flex-start', paddingTop: 10, gap: 15, overflowY: 'auto' }}>
        {/* Mascot */}
        <img src={ASSETS.images.mascotCelebrate} alt="" style={S.mascot} />

        {/* Stars */}
        <div style={{
          width: '100%',
          maxWidth: 320,
          background: 'linear-gradient(135deg, #FFD93D, #F9A825)',
          borderRadius: 22,
          padding: 20,
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 6px 20px rgba(249,168,37,0.3)',
        }}>
          <div style={{ fontSize: 50, fontWeight: 700 }}>⭐ {progress.stars}</div>
          <div style={{ fontSize: 18 }}>כוכבים</div>
        </div>

        {/* Letters grid */}
        <div style={{
          width: '100%',
          maxWidth: 320,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 20,
          padding: 18,
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 16 }}>אותיות שלמדתי:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {LETTERS.map((l, i) => (
              <span
                key={i}
                style={{
                  width: 38, height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  borderRadius: 10,
                  background: progress.learned.includes(l.letter) ? l.color : '#e8e8e8',
                  color: progress.learned.includes(l.letter) ? 'white' : '#bbb',
                  boxShadow: progress.learned.includes(l.letter) ? '0 3px 8px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                {l.letter}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          width: '100%',
          maxWidth: 320,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 20,
          padding: 18,
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 16 }}>סטטיסטיקות:</div>
          <div style={{ fontSize: 16, marginBottom: 8 }}>🎮 משחקים: {progress.games}</div>
          <div style={{ fontSize: 16 }}>🔤 אותיות: {progress.learned.length} / {LETTERS.length}</div>
        </div>
      </div>

      <div style={S.actions} />
    </div>
  );
}

// ==================== MAIN APP ====================
function App() {
  const [view, setView] = useState('home');
  const speak = useSpeech();
  const { data, addLetter, addStars, addGame } = useProgress();

  const handleNav = (target) => {
    if (target === 'learn') setView('learn');
    else if (target === 'achievements') setView('achievements');
    else setView('home');
  };

  const handleActivity = (id) => setView(id);
  const handleBack = () => setView('home');

  const renderScreen = () => {
    switch (view) {
      case 'learn':
        return <LearnScreen speak={speak} progress={data} addLetter={addLetter} addStars={addStars} onBack={handleBack} />;
      case 'find':
        return <FindGameScreen speak={speak} addStars={addStars} addGame={addGame} onBack={handleBack} />;
      case 'match':
        return <MatchGameScreen speak={speak} addStars={addStars} addGame={addGame} onBack={handleBack} />;
      case 'achievements':
        return <AchievementsScreen progress={data} speak={speak} onBack={handleBack} />;
      default:
        return <HomeScreen onActivity={handleActivity} speak={speak} progress={data} />;
    }
  };

  const currentNav = view === 'achievements' ? 'achievements' : view === 'learn' ? 'learn' : 'home';

  return (
    <div style={S.app}>
      {renderScreen()}
      <NavBar current={currentNav} onNavigate={handleNav} stars={data.stars} />
    </div>
  );
}

export default App;
