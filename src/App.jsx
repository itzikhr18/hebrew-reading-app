import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/*
 * אפליקציית לימוד קריאה לילדים - גרסה 11.0
 * אוצר מילים מורחב + ערבוב חכם
 */

// ==================== ASSETS ====================
const ASSETS = {
  images: {
    mascotHappy: './assets/images/mascot_happy.png',
    mascotCelebrate: './assets/images/mascot_celebrate.png',
    mascotThinking: './assets/images/mascot_thinking.png',
    mascotEncourage: './assets/images/mascot_encourage.png',
  },
  audio: {
    success: './assets/audio/sound_success.mp3',
    click: './assets/audio/sound_click.mp3',
    wrong: './assets/audio/sound_wrong.mp3',
  }
};

// ==================== LETTERS DATA ====================
const LETTERS = [
  { letter: 'א', name: 'אָלֶף', sound: 'אה', color: '#FF6B6B', words: [
    { text: 'אבא', emoji: '👨' }, { text: 'אמא', emoji: '👩' }, { text: 'אריה', emoji: '🦁' }, { text: 'אבטיח', emoji: '🍉' },
    { text: 'אוטובוס', emoji: '🚌' }, { text: 'אגוז', emoji: '🥜' }, { text: 'אופניים', emoji: '🚲' }, { text: 'ארנב', emoji: '🐇' },
  ]},
  { letter: 'ב', name: 'בֵּית', sound: 'בּ', color: '#4ECDC4', words: [
    { text: 'בית', emoji: '🏠' }, { text: 'בננה', emoji: '🍌' }, { text: 'בלון', emoji: '🎈' },
    { text: 'ברווז', emoji: '🦆' }, { text: 'בקבוק', emoji: '🍼' }, { text: 'בובה', emoji: '🧸' }, { text: 'ברק', emoji: '⚡' },
  ]},
  { letter: 'ג', name: 'גִימֶל', sound: 'גּ', color: '#FF69B4', words: [
    { text: 'גמל', emoji: '🐪' }, { text: 'גלידה', emoji: '🍦' }, { text: 'גזר', emoji: '🥕' },
    { text: 'גשם', emoji: '🌧️' }, { text: 'גלגל', emoji: '🛞' }, { text: 'גיטרה', emoji: '🎸' },
  ]},
  { letter: 'ד', name: 'דָלֶת', sound: 'דּ', color: '#F39C12', words: [
    { text: 'דג', emoji: '🐟' }, { text: 'דבש', emoji: '🍯' }, { text: 'דלת', emoji: '🚪' },
    { text: 'דובדבן', emoji: '🍒' }, { text: 'דינוזאור', emoji: '🦕' }, { text: 'דגל', emoji: '🏳️' }, { text: 'דוב', emoji: '🐻' },
  ]},
  { letter: 'ה', name: 'הֵא', sound: 'ה', color: '#1ABC9C', words: [
    { text: 'הר', emoji: '⛰️' }, { text: 'היפופוטם', emoji: '🦛' },
    { text: 'הגה', emoji: '🎡' }, { text: 'המבורגר', emoji: '🍔' }, { text: 'הפתעה', emoji: '🎁' }, { text: 'הליכון', emoji: '👟' },
  ]},
  { letter: 'ו', name: 'וָו', sound: 'ו', color: '#9B59B6', words: [
    { text: 'ורד', emoji: '🌹' }, { text: 'וילון', emoji: '🪟' },
    { text: 'וואפל', emoji: '🧇' }, { text: 'וידאו', emoji: '📹' }, { text: 'ויולה', emoji: '🎻' }, { text: 'ולקן', emoji: '🌋' },
  ]},
  { letter: 'ז', name: 'זַיִן', sound: 'ז', color: '#3498DB', words: [
    { text: 'זברה', emoji: '🦓' }, { text: 'זית', emoji: '🫒' },
    { text: 'זיקוקים', emoji: '🎆' }, { text: 'זנב', emoji: '🐕' }, { text: 'זרע', emoji: '🌱' }, { text: 'זמר', emoji: '🎤' },
  ]},
  { letter: 'ח', name: 'חֵית', sound: 'ח', color: '#E74C3C', words: [
    { text: 'חתול', emoji: '🐱' }, { text: 'חלב', emoji: '🥛' }, { text: 'חמור', emoji: '🫏' },
    { text: 'חלון', emoji: '🪟' }, { text: 'חיפושית', emoji: '🐞' }, { text: 'חמניה', emoji: '🌻' }, { text: 'חצוצרה', emoji: '🎺' },
  ]},
  { letter: 'ט', name: 'טֵית', sound: 'ט', color: '#2ECC71', words: [
    { text: 'טלפון', emoji: '📱' }, { text: 'טיל', emoji: '🚀' },
    { text: 'טלוויזיה', emoji: '📺' }, { text: 'טבעת', emoji: '💍' }, { text: 'טוס', emoji: '🦅' }, { text: 'טנק', emoji: '🪖' },
  ]},
  { letter: 'י', name: 'יוֹד', sound: 'י', color: '#E67E22', words: [
    { text: 'יד', emoji: '✋' }, { text: 'ילד', emoji: '👦' }, { text: 'ירח', emoji: '🌙' },
    { text: 'יען', emoji: '🦃' }, { text: 'ינשוף', emoji: '🦉' }, { text: 'יהלום', emoji: '💎' }, { text: 'יונה', emoji: '🕊️' },
  ]},
  { letter: 'כ', name: 'כָּף', sound: 'כּ', color: '#8E44AD', words: [
    { text: 'כלב', emoji: '🐕' }, { text: 'כוכב', emoji: '⭐' }, { text: 'כדור', emoji: '⚽' },
    { text: 'כובע', emoji: '🎩' }, { text: 'כרית', emoji: '🛏️' }, { text: 'כנף', emoji: '🪽' }, { text: 'כיסא', emoji: '🪑' },
  ]},
  { letter: 'ל', name: 'לָמֶד', sound: 'ל', color: '#16A085', words: [
    { text: 'לב', emoji: '❤️' }, { text: 'לחם', emoji: '🍞' }, { text: 'לימון', emoji: '🍋' },
    { text: 'לביא', emoji: '🦁' }, { text: 'לגו', emoji: '🧱' }, { text: 'לוח', emoji: '📋' }, { text: 'לטאה', emoji: '🦎' },
  ]},
  { letter: 'מ', name: 'מֵם', sound: 'מ', color: '#D35400', words: [
    { text: 'מים', emoji: '💧' }, { text: 'מלך', emoji: '👑' }, { text: 'מטוס', emoji: '✈️' },
    { text: 'מכונית', emoji: '🚗' }, { text: 'מטריה', emoji: '☂️' }, { text: 'מגדלור', emoji: '🗼' }, { text: 'מפתח', emoji: '🔑' },
  ]},
  { letter: 'נ', name: 'נוּן', sound: 'נ', color: '#27AE60', words: [
    { text: 'נר', emoji: '🕯️' }, { text: 'נמר', emoji: '🐆' }, { text: 'נחש', emoji: '🐍' },
    { text: 'נמלה', emoji: '🐜' }, { text: 'נעל', emoji: '👟' }, { text: 'נשר', emoji: '🦅' }, { text: 'נסיכה', emoji: '👸' },
  ]},
  { letter: 'ס', name: 'סָמֶך', sound: 'ס', color: '#9370DB', words: [
    { text: 'סוס', emoji: '🐴' }, { text: 'סירה', emoji: '⛵' },
    { text: 'סנאי', emoji: '🐿️' }, { text: 'סוכריה', emoji: '🍬' }, { text: 'סלט', emoji: '🥗' }, { text: 'ספר', emoji: '📖' },
  ]},
  { letter: 'ע', name: 'עַיִן', sound: 'ע', color: '#228B22', words: [
    { text: 'עץ', emoji: '🌳' }, { text: 'עוגה', emoji: '🎂' }, { text: 'ענן', emoji: '☁️' },
    { text: 'עכביש', emoji: '🕷️' }, { text: 'עגלה', emoji: '🛒' }, { text: 'עפיפון', emoji: '🪁' }, { text: 'עיניים', emoji: '👀' },
  ]},
  { letter: 'פ', name: 'פֵּא', sound: 'פּ', color: '#4169E1', words: [
    { text: 'פיל', emoji: '🐘' }, { text: 'פרח', emoji: '🌸' }, { text: 'פרפר', emoji: '🦋' },
    { text: 'פינגווין', emoji: '🐧' }, { text: 'פיצה', emoji: '🍕' }, { text: 'פנס', emoji: '🔦' }, { text: 'פסנתר', emoji: '🎹' },
  ]},
  { letter: 'צ', name: 'צָדִי', sound: 'צ', color: '#6B8E23', words: [
    { text: 'צב', emoji: '🐢' }, { text: 'ציפור', emoji: '🐦' }, { text: 'צפרדע', emoji: '🐸' },
    { text: 'צבע', emoji: '🎨' }, { text: 'צלחת', emoji: '🍽️' }, { text: 'צעצוע', emoji: '🧸' },
  ]},
  { letter: 'ק', name: 'קוֹף', sound: 'ק', color: '#8B4513', words: [
    { text: 'קוף', emoji: '🐵' }, { text: 'קשת', emoji: '🌈' }, { text: 'קיפוד', emoji: '🦔' },
    { text: 'קרח', emoji: '🧊' }, { text: 'קוביה', emoji: '🎲' }, { text: 'קרן', emoji: '🦄' }, { text: 'קסם', emoji: '🪄' },
  ]},
  { letter: 'ר', name: 'רֵישׁ', sound: 'ר', color: '#DC143C', words: [
    { text: 'רכבת', emoji: '🚂' }, { text: 'רגל', emoji: '🦶' }, { text: 'רובוט', emoji: '🤖' },
    { text: 'רוח', emoji: '💨' }, { text: 'רימון', emoji: '🫐' }, { text: 'רקטה', emoji: '🚀' },
  ]},
  { letter: 'ש', name: 'שִׁין', sound: 'שׁ', color: '#FFD700', words: [
    { text: 'שמש', emoji: '☀️' }, { text: 'שועל', emoji: '🦊' }, { text: 'שעון', emoji: '⏰' },
    { text: 'שוקולד', emoji: '🍫' }, { text: 'שלג', emoji: '❄️' }, { text: 'שושנה', emoji: '🌺' }, { text: 'שמלה', emoji: '👗' },
  ]},
  { letter: 'ת', name: 'תָּו', sound: 'תּ', color: '#FF4500', words: [
    { text: 'תפוח', emoji: '🍎' }, { text: 'תות', emoji: '🍓' }, { text: 'תרנגול', emoji: '🐓' },
    { text: 'תנין', emoji: '🐊' }, { text: 'תמנון', emoji: '🐙' }, { text: 'תה', emoji: '🍵' }, { text: 'תכלת', emoji: '🔵' },
  ]},
];

// Letters that look or sound similar - used to pick harder distractors
const CONFUSABLES = {
  'ב': ['כ', 'פ', 'ד'],
  'כ': ['ב', 'ד', 'ר'],
  'ד': ['ר', 'כ', 'ב'],
  'ר': ['ד', 'כ', 'ו'],
  'ו': ['ר', 'ז', 'י'],
  'ז': ['ו', 'ג', 'נ'],
  'ג': ['נ', 'ז'],
  'נ': ['ג', 'ז'],
  'ס': ['ש', 'צ', 'ע'],
  'ש': ['ס', 'צ'],
  'צ': ['ס', 'ש', 'ע'],
  'ע': ['א', 'ס', 'צ'],
  'א': ['ע', 'ה'],
  'ה': ['א', 'ח', 'ע'],
  'ח': ['ה', 'כ', 'ת'],
  'ת': ['ח', 'ט'],
  'ט': ['ת', 'מ'],
  'מ': ['נ', 'ט'],
  'פ': ['ב', 'כ'],
  'ק': ['כ'],
  'י': ['ו'],
  'ל': ['כ'],
};

// Pick smart distractors: prefer confusable letters, then random
function pickDistractors(target, count) {
  const confusable = (CONFUSABLES[target.letter] || [])
    .map(l => LETTERS.find(x => x.letter === l))
    .filter(Boolean)
    .sort(() => Math.random() - 0.5);
  const others = LETTERS.filter(l => l.letter !== target.letter && !confusable.includes(l))
    .sort(() => Math.random() - 0.5);
  const pool = [...confusable, ...others];
  return pool.slice(0, count);
}

const ENCOURAGEMENTS = [
  'כל הכבוד! 🎉', 'מצוין! 🌟', 'אלוף! 🏆', 'וואו! 🤩', 'נהדר! ✨', 'סחתיין! 💪',
  'יופי! 🥳', 'מדהים! 🔥', 'עפנו! 🚀', 'תותח! 💥',
];

const RETRY_MESSAGES = [
  'ננסה שוב! 💪', 'כמעט! 🤏', 'אל תוותר! 💫', 'עוד פעם! 🔄', 'בוא ננסה! 😊',
];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ==================== HOOKS ====================
function useSpeech() {
  const synth = useRef(null);
  const hebrewVoice = useRef(null);

  useEffect(() => {
    synth.current = window.speechSynthesis;

    const findHebrewVoice = () => {
      const voices = synth.current.getVoices();
      // Prefer he-IL voices, prioritize female voices for children's app
      const heVoices = voices.filter(v => v.lang === 'he-IL' || v.lang === 'he');
      if (heVoices.length > 0) {
        hebrewVoice.current = heVoices.find(v => /female|carmit|lihi/i.test(v.name)) || heVoices[0];
      }
    };

    findHebrewVoice();
    synth.current.addEventListener('voiceschanged', findHebrewVoice);
    return () => {
      if (synth.current) {
        synth.current.removeEventListener('voiceschanged', findHebrewVoice);
        synth.current.cancel();
      }
    };
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (!synth.current) return;
    synth.current.cancel();

    // Split on periods/dots to create natural pauses between sentences
    const segments = text.split(/[.]+/).map(s => s.trim()).filter(Boolean);

    let delay = 0;
    segments.forEach((segment, i) => {
      setTimeout(() => {
        if (!synth.current) return;
        const u = new SpeechSynthesisUtterance(segment);
        u.lang = 'he-IL';
        if (hebrewVoice.current) u.voice = hebrewVoice.current;
        // Single letters/sounds get slower, more deliberate speech
        const isShort = segment.length <= 3;
        u.rate = options.rate || (isShort ? 0.65 : 0.8);
        u.pitch = options.pitch || (isShort ? 1.1 : 1.0);
        u.volume = 1.0;
        synth.current.speak(u);
      }, delay);
      // Add pause between segments
      delay += Math.max(600, segment.length * 120) + 300;
    });
  }, []);

  return speak;
}

function useSound() {
  const audioCache = useRef({});
  const play = useCallback((type) => {
    try {
      if (!audioCache.current[type]) {
        audioCache.current[type] = new Audio(ASSETS.audio[type]);
        audioCache.current[type].volume = 0.5;
      }
      const a = audioCache.current[type];
      a.currentTime = 0;
      a.play().catch((e) => console.warn('Audio failed:', type, e.message));
    } catch (e) { console.warn('Audio error:', type, e.message); }
  }, []);
  return play;
}

function useProgress() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('hebrew_app_v9');
      return saved ? JSON.parse(saved) : { learned: [], stars: 0, games: 0, streak: 0, bestStreak: 0, level: 1 };
    } catch { return { learned: [], stars: 0, games: 0, streak: 0, bestStreak: 0, level: 1 }; }
  });
  useEffect(() => {
    try { localStorage.setItem('hebrew_app_v9', JSON.stringify(data)); } catch {}
  }, [data]);
  const addLetter = useCallback((letter) => {
    setData(d => ({ ...d, learned: d.learned.includes(letter) ? d.learned : [...d.learned, letter] }));
  }, []);
  const addStars = useCallback((n) => setData(d => {
    const newStars = d.stars + n;
    const newLevel = Math.floor(newStars / 20) + 1;
    return { ...d, stars: newStars, level: Math.max(d.level, newLevel) };
  }), []);
  const addGame = useCallback(() => setData(d => ({ ...d, games: d.games + 1 })), []);
  const addStreak = useCallback(() => setData(d => {
    const s = d.streak + 1;
    return { ...d, streak: s, bestStreak: Math.max(s, d.bestStreak) };
  }), []);
  const resetStreak = useCallback(() => setData(d => ({ ...d, streak: 0 })), []);
  return { data, addLetter, addStars, addGame, addStreak, resetStreak };
}

function useSafeTimeouts() {
  const timers = useRef([]);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; timers.current.forEach(clearTimeout); timers.current = []; };
  }, []);
  const safeTimeout = useCallback((fn, delay) => {
    const id = setTimeout(() => { if (mounted.current) fn(); }, delay);
    timers.current.push(id);
    return id;
  }, []);
  return safeTimeout;
}

// ==================== UI COMPONENTS ====================

function FloatingParticles() {
  const particles = useMemo(() => {
    const emojis = ['⭐', '✨', '💫', '🌟', '🎵', '❤️', '🌈'];
    return Array.from({ length: 8 }, (_, i) => ({
      emoji: emojis[i % emojis.length],
      left: `${10 + (i * 12) % 80}%`,
      delay: i * 0.7,
      duration: 4 + (i % 3),
      size: 14 + (i % 3) * 4,
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {particles.map((p, i) => (
        <span key={i} style={{
          position: 'absolute', top: `${10 + (i * 15) % 70}%`, left: p.left,
          fontSize: p.size, opacity: 0.15,
          animation: `float ${p.duration}s ease infinite`,
          animationDelay: `${p.delay}s`,
        }}>{p.emoji}</span>
      ))}
    </div>
  );
}

function ConfettiEffect({ active }) {
  const pieces = useMemo(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#FF69B4', '#9B59B6', '#3498DB', '#2ECC71'];
    return Array.from({ length: 30 }, (_, i) => ({
      color: colors[i % colors.length],
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      size: 6 + Math.random() * 8,
    }));
  }, []);

  if (!active) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 3000 }}>
      {pieces.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: -10, left: p.left,
          width: p.size, height: p.size, borderRadius: i % 2 ? '50%' : '2px',
          background: p.color,
          animation: `confettiDrop ${p.duration}s ease forwards`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

function StreakBadge({ streak }) {
  if (streak < 2) return null;
  const fire = streak >= 5 ? '🔥🔥' : streak >= 3 ? '🔥' : '⚡';
  return (
    <div style={{
      position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
      background: streak >= 5 ? 'linear-gradient(135deg, #FF6B00, #FF4500)' : 'linear-gradient(135deg, #FFD93D, #FF9800)',
      color: 'white', padding: '4px 14px', borderRadius: 20,
      fontSize: 13, fontWeight: 700, fontFamily: "'Rubik', sans-serif",
      boxShadow: '0 3px 12px rgba(255,152,0,0.4)',
      animation: 'popIn 0.3s ease', zIndex: 50, whiteSpace: 'nowrap',
    }}>
      {fire} רצף {streak}!
    </div>
  );
}

function Button({ children, onClick, color = '#4ECDC4', size = 'medium', icon, disabled, style }) {
  const sizes = {
    small: { padding: '8px 16px', fontSize: 14, borderRadius: 16 },
    medium: { padding: '12px 28px', fontSize: 18, borderRadius: 20 },
    large: { padding: '16px 40px', fontSize: 22, borderRadius: 24 },
  };
  const s = sizes[size] || sizes.medium;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        ...s, border: 'none',
        background: `linear-gradient(145deg, ${color}, ${color}dd)`,
        color: 'white', fontFamily: "'Rubik', sans-serif", fontWeight: 700,
        cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1,
        boxShadow: `0 6px 20px ${color}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
        transition: 'transform 0.15s, box-shadow 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        whiteSpace: 'nowrap', letterSpacing: '0.3px', ...style,
      }}
    >
      {icon && <span style={{ fontSize: s.fontSize + 4 }}>{icon}</span>}
      {children}
    </button>
  );
}

function IconButton({ children, onClick, color = '#aaa', style }) {
  return (
    <button onClick={onClick}
      style={{
        width: 44, height: 44, borderRadius: '50%', border: 'none',
        background: color, color: 'white', fontSize: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
        transition: 'transform 0.15s', ...style,
      }}
    >{children}</button>
  );
}

function NavBar({ current, onNavigate, stars, level }) {
  const items = [
    { id: 'achievements', label: 'הישגים', icon: '🏆' },
    { id: 'learn', label: 'לימוד', icon: '📖' },
    { id: 'home', label: 'בית', icon: '🏠' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 70,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '22px 22px 0 0',
      boxShadow: '0 -4px 30px rgba(0,0,0,0.06)', zIndex: 100,
    }}>
      {items.map(item => {
        const isActive = current === item.id;
        return (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '6px 18px', borderRadius: 14,
              backgroundColor: isActive ? '#FFF3E0' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 24, transition: 'transform 0.2s', transform: isActive ? 'scale(1.15)' : 'scale(1)' }}>
              {item.icon}
            </span>
            <span style={{
              fontSize: 11, fontWeight: isActive ? 700 : 500,
              color: isActive ? '#FF6B00' : '#999',
              fontFamily: "'Rubik', sans-serif",
            }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Feedback({ type, message }) {
  const playSound = useSound();
  useEffect(() => {
    playSound(type === 'success' ? 'success' : 'wrong');
  }, [playSound, type]);

  const isSuccess = type === 'success';
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, background: 'rgba(0,0,0,0.4)', animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '30px 45px', borderRadius: 30, background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.5) inset',
        animation: 'popIn 0.35s ease',
      }}>
        <img
          src={isSuccess ? ASSETS.images.mascotCelebrate : ASSETS.images.mascotEncourage}
          alt="" style={{ width: 110, height: 110, objectFit: 'contain' }}
        />
        <div style={{
          fontSize: 26, fontWeight: 700, marginTop: 10,
          color: isSuccess ? '#4CAF50' : '#FF9800', fontFamily: "'Rubik', sans-serif",
        }}>
          {message || (isSuccess ? randomFrom(ENCOURAGEMENTS) : randomFrom(RETRY_MESSAGES))}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ current, total, color }) {
  return (
    <div style={{
      width: '100%', maxWidth: 280, height: 10, borderRadius: 5,
      background: 'rgba(0,0,0,0.08)', overflow: 'hidden',
    }}>
      <div style={{
        width: `${(current / total) * 100}%`, height: '100%', borderRadius: 5,
        background: color || 'linear-gradient(90deg, #FFD93D, #FF6B00)',
        transition: 'width 0.5s ease',
      }} />
    </div>
  );
}

function LevelBadge({ level }) {
  const titles = ['', 'מתחיל', 'חוקר', 'יודע', 'מומחה', 'גאון', 'אלוף'];
  const colors = ['', '#78909C', '#4ECDC4', '#2196F3', '#9C27B0', '#FF6B00', '#FFD700'];
  const l = Math.min(level, 6);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: `${colors[l]}22`, color: colors[l],
      padding: '3px 10px', borderRadius: 10,
      fontSize: 12, fontWeight: 700, fontFamily: "'Rubik', sans-serif",
    }}>
      רמה {l}: {titles[l]}
    </div>
  );
}

// ==================== SCREENS ====================

function HomeScreen({ onActivity, speak, progress }) {
  const playSound = useSound();
  const timerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => speak('שלום! בוא נלמד לקרוא!'), 600);
    return () => clearTimeout(t);
  }, [speak]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const activities = [
    { id: 'learn', icon: '📖', label: 'לימוד אותיות', desc: 'למד את האותיות, הצלילים והמילים', color: '#4ECDC4', gradient: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)' },
    { id: 'find', icon: '🔍', label: 'מצא את האות', desc: 'שמע את שם האות ומצא אותה!', color: '#FF6B6B', gradient: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)' },
    { id: 'match', icon: '🎯', label: 'התאם לתמונה', desc: 'ראה תמונה ובחר את האות הנכונה', color: '#9B59B6', gradient: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)' },
    { id: 'sound', icon: '🎵', label: 'זהה את הצליל', desc: 'שמע צליל ובחר איזו אות עושה אותו', color: '#FF9800', gradient: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)' },
  ];

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      overflow: 'auto', zIndex: 1,
    }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        background: 'linear-gradient(180deg, #FFF8E7 0%, #FFE8EC 50%, #E8F4FD 100%)',
      }} />
      <FloatingParticles />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 420,
        padding: '15px 20px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Mascot & Title */}
        <img src={ASSETS.images.mascotHappy} alt="ינשוף" style={{
          width: 100, height: 100, objectFit: 'contain',
          animation: 'float 3s ease infinite', marginBottom: 5,
        }} />
        <h1 style={{
          fontSize: 34, fontWeight: 700, color: '#2D3436', textAlign: 'center',
          fontFamily: "'Rubik', sans-serif", margin: '0 0 2px',
          textShadow: '0 2px 4px rgba(0,0,0,0.08)',
        }}>לומדים לקרוא! 🦉</h1>
        <LevelBadge level={progress.level} />
        <p style={{ fontSize: 15, color: '#888', marginTop: 6, marginBottom: 16, fontFamily: "'Rubik', sans-serif" }}>
          בחר פעילות להתחיל
        </p>

        {/* Activity Cards */}
        {activities.map((act, i) => (
          <div
            key={act.id}
            onClick={() => {
              playSound('click');
              speak(act.label);
              if (timerRef.current) clearTimeout(timerRef.current);
              timerRef.current = setTimeout(() => onActivity(act.id), 400);
            }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px 20px', marginBottom: 12,
              background: act.gradient, borderRadius: 22,
              border: `1.5px solid ${act.color}28`,
              boxShadow: `0 6px 20px ${act.color}15, 0 2px 6px rgba(0,0,0,0.03)`,
              cursor: 'pointer', transition: 'transform 0.2s',
              animation: `fadeInUp 0.4s ease forwards`,
              animationDelay: `${i * 0.1}s`, opacity: 0,
            }}
          >
            <div style={{
              width: 54, height: 54, borderRadius: 17,
              background: 'rgba(255,255,255,0.9)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 28, flexShrink: 0,
              boxShadow: `0 4px 14px ${act.color}20`,
              border: `1px solid rgba(255,255,255,0.7)`,
            }}>
              {act.icon}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif" }}>{act.label}</div>
              <div style={{ fontSize: 12, color: '#888', fontFamily: "'Rubik', sans-serif", marginTop: 2 }}>{act.desc}</div>
            </div>
            <span style={{ marginRight: 'auto', fontSize: 18, color: '#ccc' }}>❮</span>
          </div>
        ))}

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginTop: 12, width: '100%' }}>
          {[
            { icon: '⭐', val: progress.stars, label: 'כוכבים', color: '#FFB800' },
            { icon: '🔤', val: `${progress.learned.length}/${LETTERS.length}`, label: 'אותיות', color: '#4ECDC4' },
            { icon: '🔥', val: progress.bestStreak, label: 'שיא רצף', color: '#FF6B00' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)',
              padding: '12px 6px', borderRadius: 18,
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.6)',
              animation: `fadeInUp 0.4s ease forwards`, animationDelay: `${0.4 + i * 0.1}s`, opacity: 0,
            }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'Rubik', sans-serif" }}>{s.val}</span>
              <span style={{ fontSize: 10, color: '#aaa', fontFamily: "'Rubik', sans-serif" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LearnScreen({ speak, progress, addLetter, addStars, onBack }) {
  const [idx, setIdx] = useState(() => {
    if (progress.learned.length > 0) {
      const nextIdx = LETTERS.findIndex(l => !progress.learned.includes(l.letter));
      return nextIdx >= 0 ? nextIdx : 0;
    }
    return 0;
  });
  const [wordIdx, setWordIdx] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState([]);
  const [quizSelected, setQuizSelected] = useState(null);
  const playSound = useSound();
  const safeTimeout = useSafeTimeouts();
  const pickerRef = useRef(null);

  const letter = LETTERS[idx];
  const word = letter.words[wordIdx];

  const speakNow = useCallback(() => {
    speak(`זו האות ${letter.name}. ${letter.name} אומרת ${letter.sound}. ${word.text}`);
  }, [speak, letter, word]);

  useEffect(() => {
    if (!quizMode) {
      const t = setTimeout(speakNow, 500);
      return () => clearTimeout(t);
    }
  }, [idx, wordIdx, speakNow, quizMode]);

  // Scroll letter picker to show current letter
  useEffect(() => {
    if (pickerRef.current) {
      const btn = pickerRef.current.children[idx];
      if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [idx]);

  const jumpToLetter = (i) => {
    playSound('click');
    setIdx(i);
    setWordIdx(0);
    setQuizMode(false);
    setQuizSelected(null);
  };

  const goNext = () => {
    if (wordIdx < letter.words.length - 1) setWordIdx(w => w + 1);
    else { setWordIdx(0); setIdx(i => (i + 1) % LETTERS.length); }
  };

  const goPrev = () => {
    if (wordIdx > 0) setWordIdx(w => w - 1);
    else if (idx > 0) { setIdx(i => i - 1); setWordIdx(0); }
  };

  const startQuiz = () => {
    playSound('click');
    const distractors = pickDistractors(letter, 2);
    const opts = [letter, ...distractors].sort(() => Math.random() - 0.5);
    setQuizOptions(opts);
    setQuizSelected(null);
    setQuizMode(true);
    safeTimeout(() => speak(letter.sound), 300);
  };

  const handleQuizPick = (opt) => {
    if (quizSelected) return;
    playSound('click');
    setQuizSelected(opt.letter);
    if (opt.letter === letter.letter) {
      addLetter(letter.letter);
      addStars(2);
      setShowFeedback(true);
      setShowConfetti(true);
      safeTimeout(() => {
        setShowFeedback(false);
        setShowConfetti(false);
        setQuizMode(false);
        setQuizSelected(null);
        setWordIdx(0);
        setIdx(i => (i + 1) % LETTERS.length);
      }, 1800);
    } else {
      safeTimeout(() => {
        setQuizSelected(null);
        speak(`לא, נסה שוב! ${letter.sound}`);
      }, 1200);
    }
  };

  const renderWord = () => {
    const first = word.text[0];
    const rest = word.text.slice(1);
    return (
      <span style={{ fontSize: 30, fontWeight: 700, fontFamily: "'Rubik', sans-serif" }}>
        <span style={{ color: letter.color, fontSize: 34 }}>{first}</span>
        <span style={{ color: '#2D3436' }}>{rest}</span>
      </span>
    );
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
      display: 'flex', flexDirection: 'column', zIndex: 1,
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        background: `linear-gradient(180deg, ${letter.color}11 0%, #FFF8E7 100%)`,
      }} />
      <FloatingParticles />
      <ConfettiEffect active={showConfetti} />
      {showFeedback && <Feedback type="success" />}

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <IconButton onClick={onBack} color="#ccc">✕</IconButton>
        <div style={{
          background: 'white', padding: '5px 14px', borderRadius: 20,
          fontSize: 14, fontWeight: 600, color: '#555', fontFamily: "'Rubik', sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          אות {idx + 1} מתוך {LETTERS.length}
        </div>
        <IconButton onClick={speakNow} color="#2196F3">🔊</IconButton>
      </div>

      {/* Letter Picker Strip */}
      <div ref={pickerRef} style={{
        display: 'flex', gap: 6, padding: '6px 12px', overflowX: 'auto', overflowY: 'hidden',
        position: 'relative', zIndex: 1, flexShrink: 0,
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}>
        {LETTERS.map((l, i) => {
          const learned = progress.learned.includes(l.letter);
          const isCurrent = i === idx;
          return (
            <button key={i} onClick={() => jumpToLetter(i)} style={{
              width: 34, height: 34, minWidth: 34, borderRadius: 10, border: 'none',
              background: isCurrent ? l.color : learned ? `${l.color}33` : '#eee',
              color: isCurrent ? 'white' : learned ? l.color : '#bbb',
              fontSize: 15, fontWeight: 700, fontFamily: "'Rubik', sans-serif",
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: isCurrent ? `0 3px 10px ${l.color}55` : 'none',
              transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{l.letter}</button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 20px 0', position: 'relative', zIndex: 1 }}>
        <ProgressBar current={idx + 1} total={LETTERS.length} color={letter.color} />
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '8px 20px', position: 'relative', zIndex: 1, minHeight: 0,
      }}>
        {quizMode ? (
          /* Quiz Mode */
          <>
            <div style={{
              fontSize: 18, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif",
              marginBottom: 14, textAlign: 'center',
            }}>
              איזו אות עושה את הצליל הזה? 🎯
            </div>
            <div style={{
              width: 70, height: 70, borderRadius: '50%', margin: '0 auto 16px',
              background: `linear-gradient(145deg, ${letter.color}, ${letter.color}bb)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30, cursor: 'pointer',
              boxShadow: `0 6px 20px ${letter.color}44`,
              animation: 'pulse 2s ease infinite',
            }} onClick={() => speak(letter.sound)}>
              🔊
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%', maxWidth: 260 }}>
              {quizOptions.map((opt, i) => {
                const isSelected = quizSelected === opt.letter;
                const isCorrect = opt.letter === letter.letter;
                let bg = 'white';
                if (isSelected) bg = isCorrect ? '#C8E6C9' : '#FFCDD2';
                return (
                  <div key={i} onClick={() => handleQuizPick(opt)} style={{
                    aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 44, fontWeight: 700, color: opt.color,
                    background: isSelected ? bg : `linear-gradient(145deg, white, #fafafa)`,
                    borderRadius: 20,
                    border: `3px solid ${isSelected ? (isCorrect ? '#4CAF50' : '#F44336') : opt.color + '66'}`,
                    boxShadow: isSelected
                      ? (isCorrect ? '0 0 20px rgba(76,175,80,0.3)' : '0 0 20px rgba(244,67,54,0.3)')
                      : `0 4px 15px ${opt.color}18`,
                    cursor: quizSelected ? 'default' : 'pointer',
                    transition: 'all 0.2s', fontFamily: "'Rubik', sans-serif",
                    animation: `fadeInUp 0.3s ease ${i * 0.05}s forwards`, opacity: 0,
                  }}>{opt.letter}</div>
                );
              })}
            </div>
          </>
        ) : (
          /* Learn Mode */
          <>
            <div style={{
              width: 130, height: 130, borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, white 0%, #fafafa 100%)`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 10px 40px ${letter.color}40, 0 0 0 4px ${letter.color}, 0 0 0 8px ${letter.color}22`,
              marginBottom: 10, animation: 'popIn 0.4s ease',
            }}>
              <span style={{ fontSize: 62, fontWeight: 700, color: letter.color, lineHeight: 1 }}>{letter.letter}</span>
              <span style={{ fontSize: 13, color: '#777', fontFamily: "'Rubik', sans-serif", marginTop: 2 }}>{letter.name}</span>
            </div>

            <div style={{
              background: `${letter.color}15`, padding: '5px 16px', borderRadius: 14,
              marginBottom: 8, animation: 'fadeInUp 0.4s ease 0.1s forwards', opacity: 0,
            }}>
              <span style={{ fontSize: 14, color: letter.color, fontWeight: 600, fontFamily: "'Rubik', sans-serif" }}>
                🔈 האות אומרת: &quot;{letter.sound}&quot;
              </span>
            </div>

            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
              padding: '14px 30px', borderRadius: 22,
              boxShadow: '0 8px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.6)',
              animation: 'fadeInUp 0.4s ease 0.2s forwards', opacity: 0,
            }}>
              <span style={{ fontSize: 48, animation: 'bounce 2s ease infinite', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.1))' }}>{word.emoji}</span>
              <div style={{ marginTop: 6 }}>{renderWord()}</div>
              <span style={{ fontSize: 12, color: '#aaa', marginTop: 3, fontFamily: "'Rubik', sans-serif" }}>
                מתחיל באות <span style={{ color: letter.color, fontWeight: 700 }}>{letter.letter}</span>
              </span>
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {letter.words.map((_, i) => (
                <span key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: i === wordIdx ? letter.color : '#ddd',
                  transition: 'all 0.3s',
                  transform: i === wordIdx ? 'scale(1.4)' : 'scale(1)',
                  boxShadow: i === wordIdx ? `0 0 8px ${letter.color}66` : 'none',
                }} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom Actions */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 10, padding: '8px 20px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        {quizMode ? (
          <Button onClick={() => { setQuizMode(false); setQuizSelected(null); }} color="#BDBDBD" size="medium" icon="←">חזרה ללימוד</Button>
        ) : (
          <>
            <Button onClick={goPrev} color="#BDBDBD" size="small" icon="→">הקודם</Button>
            <Button onClick={startQuiz} color="#4CAF50" size="large" icon="❓">בחן אותי!</Button>
            <Button onClick={goNext} color="#BDBDBD" size="small" icon="←">הבא</Button>
          </>
        )}
      </div>
    </div>
  );
}

// Game wrapper for shared logic between Find, Match, and Sound games
function GameScreen({ speak, addStars, addGame, addStreak, resetStreak, onBack, progress, gameConfig }) {
  const { title, icon, color, bgGradient, generateRound, questionText, getOptions, TOTAL } = gameConfig;
  const [phase, setPhase] = useState('intro');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [roundData, setRoundData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);
  const playSound = useSound();
  const safeTimeout = useSafeTimeouts();
  const prevTarget = useRef(null);

  const numOptions = progress.level >= 3 ? 4 : progress.level >= 2 ? 3 : 2;

  const newRound = useCallback(() => {
    const data = generateRound(numOptions, prevTarget.current);
    prevTarget.current = data.target.letter;
    setRoundData(data);
    setSelected(null);
    setFeedback(null);
    safeTimeout(() => speak(data.speakText), 400);
  }, [speak, safeTimeout, generateRound, numOptions]);

  const startGame = () => {
    playSound('click');
    setPhase('playing');
    setRound(0);
    setScore(0);
    setStreak(0);
    newRound();
  };

  useEffect(() => { if (phase === 'intro') speak(title); }, [phase, speak, title]);

  const handlePick = (opt) => {
    if (selected || !roundData) return;
    playSound('click');
    setSelected(opt.letter);

    if (opt.letter === roundData.target.letter) {
      setFeedback('success');
      setScore(s => s + 1);
      setStreak(s => s + 1);
      const bonus = streak >= 4 ? 5 : streak >= 2 ? 3 : 2;
      addStars(bonus);
      addStreak();
      safeTimeout(() => {
        setFeedback(null);
        if (round + 1 < TOTAL) { setRound(r => r + 1); newRound(); }
        else {
          addGame();
          setShowConfetti(true);
          setPhase('done');
          speak('מעולה! סיימת!');
          safeTimeout(() => setShowConfetti(false), 3000);
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      setStreak(0);
      resetStreak();
      safeTimeout(() => {
        setSelected(null);
        setFeedback(null);
        speak(roundData.retryText || 'נסה שוב!');
      }, 1500);
    }
  };

  const screenStyle = {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
    display: 'flex', flexDirection: 'column', zIndex: 1,
  };
  const bgStyle = {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
    background: bgGradient,
  };

  if (phase === 'intro') {
    return (
      <div style={screenStyle}>
        <div style={bgStyle} />
        <FloatingParticles />
        <div style={{ display: 'flex', padding: '12px 16px', position: 'relative', zIndex: 1 }}>
          <IconButton onClick={onBack} color="#ccc">✕</IconButton>
        </div>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 14, position: 'relative', zIndex: 1,
        }}>
          <img src={ASSETS.images.mascotHappy} alt="" style={{ width: 120, height: 120, objectFit: 'contain', animation: 'float 3s ease infinite' }} />
          <span style={{ fontSize: 50, animation: 'popIn 0.4s ease' }}>{icon}</span>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif", animation: 'fadeInUp 0.4s ease 0.1s forwards', opacity: 0 }}>{title}</h2>
          <p style={{
            fontSize: 15, color: '#777', fontFamily: "'Rubik', sans-serif",
            textAlign: 'center', padding: '0 30px', animation: 'fadeInUp 0.4s ease 0.2s forwards', opacity: 0,
          }}>
            {gameConfig.description}
          </p>
          <div style={{ animation: 'fadeInUp 0.4s ease 0.3s forwards', opacity: 0, marginTop: 5 }}>
            <Button onClick={startGame} color={color} size="large" icon="▶">התחל משחק</Button>
          </div>
          <div style={{ animation: 'fadeInUp 0.4s ease 0.4s forwards', opacity: 0 }}>
            <LevelBadge level={progress.level} />
            <span style={{ fontSize: 12, color: '#aaa', marginRight: 8, fontFamily: "'Rubik', sans-serif" }}>
              ({numOptions} אפשרויות)
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const totalStars = score * 2 + Math.max(0, streak - 2) * 2;
    return (
      <div style={screenStyle}>
        <div style={bgStyle} />
        <ConfettiEffect active={showConfetti} />
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 14, position: 'relative', zIndex: 1,
        }}>
          <img src={ASSETS.images.mascotCelebrate} alt="" style={{ width: 120, height: 120, objectFit: 'contain', animation: 'bounce 1s ease infinite' }} />
          <div style={{
            background: 'white', padding: '25px 45px', borderRadius: 26,
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)', textAlign: 'center',
            animation: 'popIn 0.4s ease',
          }}>
            <div style={{ fontSize: 18, color: '#888', fontFamily: "'Rubik', sans-serif" }}>
              {score === TOTAL ? 'מושלם! 🌟' : score >= TOTAL - 1 ? 'כמעט מושלם!' : 'סיימת!'}
            </div>
            <div style={{ fontSize: 50, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif" }}>{score} / {TOTAL}</div>
            <div style={{ fontSize: 20, color: '#FFB800', fontFamily: "'Rubik', sans-serif" }}>⭐ +{totalStars}</div>
            {score === TOTAL && <div style={{ fontSize: 14, color: '#4CAF50', marginTop: 5, fontFamily: "'Rubik', sans-serif" }}>בונוס ציון מושלם! 🎯</div>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <Button onClick={startGame} color={color} size="large" icon="🔄">שחק שוב</Button>
            <Button onClick={onBack} color="#BDBDBD" size="medium" icon="🏠">חזרה הביתה</Button>
          </div>
        </div>
      </div>
    );
  }

  // PLAYING
  return (
    <div style={screenStyle}>
      <div style={bgStyle} />
      <FloatingParticles />
      {feedback && <Feedback type={feedback} />}
      <StreakBadge streak={streak} />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <IconButton onClick={onBack} color="#ccc">✕</IconButton>
        <div style={{
          background: 'white', padding: '5px 14px', borderRadius: 20,
          fontSize: 14, fontWeight: 600, color: '#555', fontFamily: "'Rubik', sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          שאלה {round + 1} מתוך {TOTAL}
        </div>
        <IconButton onClick={() => roundData && speak(roundData.speakText)} color="#2196F3">🔊</IconButton>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        <ProgressBar current={round + 1} total={TOTAL} color={color} />
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '8px 20px', position: 'relative', zIndex: 1,
      }}>
        {/* Question area - custom per game */}
        {roundData && questionText(roundData)}

        {/* Options grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: numOptions <= 2 ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
          gap: 12, width: '100%', maxWidth: 280,
        }}>
          {roundData && getOptions(roundData).map((opt, i) => {
            const isSelected = selected === opt.letter;
            const isCorrect = opt.letter === roundData.target.letter;
            let bg = 'white';
            if (isSelected) bg = isCorrect ? '#C8E6C9' : '#FFCDD2';
            return (
              <div
                key={i}
                onClick={() => handlePick(opt)}
                style={{
                  aspectRatio: numOptions <= 2 ? '1.2' : '1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: numOptions <= 2 ? 60 : 48, fontWeight: 700, color: opt.color,
                  background: isSelected ? bg : `linear-gradient(145deg, white, #fafafa)`,
                  borderRadius: 22,
                  border: `3px solid ${isSelected ? (isCorrect ? '#4CAF50' : '#F44336') : opt.color + '66'}`,
                  boxShadow: isSelected
                    ? (isCorrect ? '0 0 25px rgba(76,175,80,0.35), inset 0 0 15px rgba(76,175,80,0.1)' : '0 0 25px rgba(244,67,54,0.35), inset 0 0 15px rgba(244,67,54,0.1)')
                    : `0 6px 20px ${opt.color}18, 0 2px 6px rgba(0,0,0,0.04)`,
                  cursor: selected ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: "'Rubik', sans-serif",
                  animation: `fadeInUp 0.3s ease ${i * 0.05}s forwards`, opacity: 0,
                  textShadow: `0 2px 4px ${opt.color}33`,
                }}
              >
                {opt.letter}
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 14, background: 'white', padding: '6px 18px', borderRadius: 16,
          fontSize: 16, fontWeight: 700, color: '#FFB800', fontFamily: "'Rubik', sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          ⭐ {score * 2 + Math.max(0, streak - 2) * 2} כוכבים
        </div>
      </div>
    </div>
  );
}

function FindGameWrapper(props) {
  const config = useMemo(() => ({
    title: 'מצא את האות',
    icon: '🔍',
    color: '#FF6B6B',
    bgGradient: 'linear-gradient(180deg, #FDE8EF 0%, #FFF8E7 100%)',
    description: 'שמע את הצליל ומצא איזו אות עושה אותו!',
    TOTAL: 5,
    generateRound: (numOpts, prevLetter) => {
      let candidates = LETTERS.filter(l => l.letter !== prevLetter);
      const t = candidates[Math.floor(Math.random() * candidates.length)];
      const distractors = pickDistractors(t, numOpts - 1);
      const opts = [t, ...distractors].sort(() => Math.random() - 0.5);
      return { target: t, options: opts, speakText: t.sound, retryText: `נסה שוב!` };
    },
    questionText: (data) => (
      <div style={{ marginBottom: 16, textAlign: 'center', animation: 'popIn 0.3s ease' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', margin: '0 auto 10px',
          background: `linear-gradient(145deg, ${data.target.color}, ${data.target.color}bb)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, cursor: 'pointer',
          boxShadow: `0 6px 25px ${data.target.color}44, inset 0 2px 0 rgba(255,255,255,0.3)`,
          animation: 'pulse 2s ease infinite',
        }} onClick={() => props.speak(data.target.sound)}>
          🔊
        </div>
        <div style={{
          fontSize: 20, fontWeight: 700, color: '#2D3436',
          background: 'white', padding: '10px 24px', borderRadius: 18,
          fontFamily: "'Rubik', sans-serif", boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        }}>
          איזו אות עושה את הצליל הזה? 🤔
        </div>
      </div>
    ),
    getOptions: (data) => data.options,
  }), [props]);
  return <GameScreen {...props} gameConfig={config} />;
}

function MatchGameWrapper(props) {
  const config = useMemo(() => ({
    title: 'התאם לתמונה',
    icon: '🎯',
    color: '#9B59B6',
    bgGradient: 'linear-gradient(180deg, #EDE7F6 0%, #FFF8E7 100%)',
    description: 'ראה את התמונה ובחר באיזו אות המילה מתחילה!',
    TOTAL: 5,
    generateRound: (numOpts, prevLetter) => {
      let candidates = LETTERS.filter(l => l.letter !== prevLetter);
      const t = candidates[Math.floor(Math.random() * candidates.length)];
      const w = t.words[Math.floor(Math.random() * t.words.length)];
      const distractors = pickDistractors(t, numOpts - 1);
      const opts = [t, ...distractors].sort(() => Math.random() - 0.5);
      return { target: t, word: w, options: opts, speakText: `${w.text}. באיזו אות מתחיל?`, retryText: 'נסה שוב!' };
    },
    questionText: (data) => (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
        padding: '18px 40px', borderRadius: 24,
        boxShadow: '0 8px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
        border: '1px solid rgba(255,255,255,0.6)',
        marginBottom: 16, animation: 'popIn 0.3s ease',
      }}>
        <span style={{ fontSize: 56, animation: 'bounce 2s ease infinite', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.1))' }}>{data.word?.emoji}</span>
        <span style={{ fontSize: 24, fontWeight: 700, marginTop: 5, fontFamily: "'Rubik', sans-serif", color: '#2D3436' }}>
          {data.word?.text}
        </span>
        <span style={{ fontSize: 13, color: '#aaa', marginTop: 4, fontFamily: "'Rubik', sans-serif" }}>באיזו אות מתחיל? 🤔</span>
      </div>
    ),
    getOptions: (data) => data.options,
  }), []);
  return <GameScreen {...props} gameConfig={config} />;
}

function SoundGameWrapper(props) {
  const config = useMemo(() => ({
    title: 'זהה את הצליל',
    icon: '🎵',
    color: '#FF9800',
    bgGradient: 'linear-gradient(180deg, #FFF3E0 0%, #FFF8E7 100%)',
    description: 'שמע את צליל האות ובחר איזו אות עושה את הצליל הזה!',
    TOTAL: 5,
    generateRound: (numOpts, prevLetter) => {
      let candidates = LETTERS.filter(l => l.letter !== prevLetter);
      const t = candidates[Math.floor(Math.random() * candidates.length)];
      const distractors = pickDistractors(t, numOpts - 1);
      const opts = [t, ...distractors].sort(() => Math.random() - 0.5);
      return { target: t, options: opts, speakText: `${t.sound}`, retryText: `זה הצליל של ${t.name}. נסה שוב!` };
    },
    questionText: (data) => (
      <div style={{ marginBottom: 16, textAlign: 'center', animation: 'popIn 0.3s ease' }}>
        <div style={{
          width: 85, height: 85, borderRadius: '50%', margin: '0 auto 10px',
          background: 'linear-gradient(145deg, #FFB74D, #FF5722)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 38, cursor: 'pointer',
          boxShadow: '0 6px 25px rgba(255,152,0,0.4), inset 0 2px 0 rgba(255,255,255,0.3)',
          animation: 'pulse 2s ease infinite',
        }} onClick={() => props.speak(data.target.sound)}>
          🔊
        </div>
        <div style={{
          fontSize: 20, fontWeight: 700, color: '#2D3436',
          background: 'white', padding: '10px 24px', borderRadius: 18,
          fontFamily: "'Rubik', sans-serif", boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          display: 'inline-block',
        }}>
          איזו אות עושה את הצליל הזה? 🎵
        </div>
      </div>
    ),
    getOptions: (data) => data.options,
  }), [props]);
  return <GameScreen {...props} gameConfig={config} />;
}

function AchievementsScreen({ progress, speak, onBack }) {
  useEffect(() => { speak(`יש לך ${progress.stars} כוכבים! רמה ${progress.level}!`); }, [speak, progress.stars, progress.level]);

  const milestones = [
    { stars: 10, label: 'כוכב עולה', icon: '⭐', unlocked: progress.stars >= 10 },
    { stars: 30, label: 'חוקר אותיות', icon: '🔤', unlocked: progress.stars >= 30 },
    { stars: 50, label: 'גיבור הקריאה', icon: '🦸', unlocked: progress.stars >= 50 },
    { stars: 100, label: 'אלוף הא-ב', icon: '🏆', unlocked: progress.stars >= 100 },
  ];

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
      display: 'flex', flexDirection: 'column', zIndex: 1, overflow: 'auto',
    }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        background: 'linear-gradient(180deg, #FFF8E7 0%, #FFFDE7 100%)',
      }} />
      <FloatingParticles />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <IconButton onClick={onBack} color="#ccc">✕</IconButton>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Rubik', sans-serif", color: '#2D3436' }}>ההישגים שלי</div>
        <div style={{ width: 44 }} />
      </div>

      <div style={{
        position: 'relative', zIndex: 1, padding: '8px 20px 30px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        width: '100%', maxWidth: 420, margin: '0 auto',
      }}>
        <img src={ASSETS.images.mascotCelebrate} alt="" style={{
          width: 90, height: 90, objectFit: 'contain', animation: 'float 3s ease infinite',
        }} />
        <LevelBadge level={progress.level} />

        {/* Stars */}
        <div style={{
          width: '100%', background: 'linear-gradient(135deg, #FFD93D, #F9A825)',
          borderRadius: 22, padding: 18, textAlign: 'center', color: 'white',
          boxShadow: '0 6px 25px rgba(249,168,37,0.3)', animation: 'popIn 0.4s ease',
        }}>
          <div style={{ fontSize: 42, fontWeight: 700, fontFamily: "'Rubik', sans-serif" }}>⭐ {progress.stars}</div>
          <div style={{ fontSize: 15, fontFamily: "'Rubik', sans-serif", opacity: 0.9 }}>כוכבים</div>
        </div>

        {/* Milestones */}
        <div style={{
          width: '100%', background: 'white', borderRadius: 20, padding: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 15, fontFamily: "'Rubik', sans-serif", color: '#2D3436' }}>
            תגים:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {milestones.map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 12,
                background: m.unlocked ? '#FFF3E0' : '#f5f5f5',
                opacity: m.unlocked ? 1 : 0.4,
                fontSize: 13, fontFamily: "'Rubik', sans-serif",
                animation: m.unlocked ? 'glowPulse 2s ease infinite' : 'none',
              }}>
                <span style={{ fontSize: 18 }}>{m.icon}</span>
                <span style={{ fontWeight: 600, color: m.unlocked ? '#FF6B00' : '#aaa' }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Letters */}
        <div style={{
          width: '100%', background: 'white', borderRadius: 20, padding: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 15, fontFamily: "'Rubik', sans-serif", color: '#2D3436' }}>
            אותיות שלמדתי ({progress.learned.length} / {LETTERS.length}):
          </div>
          <ProgressBar current={progress.learned.length} total={LETTERS.length} color="#4ECDC4" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginTop: 12 }}>
            {LETTERS.map((l, i) => {
              const learned = progress.learned.includes(l.letter);
              return (
                <span key={i} style={{
                  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, fontWeight: 700, borderRadius: 10,
                  background: learned ? l.color : '#f0f0f0',
                  color: learned ? 'white' : '#ccc',
                  boxShadow: learned ? `0 2px 8px ${l.color}44` : 'none',
                  transition: 'all 0.3s', fontFamily: "'Rubik', sans-serif",
                }}>{l.letter}</span>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          width: '100%', background: 'white', borderRadius: 20, padding: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 15, fontFamily: "'Rubik', sans-serif", color: '#2D3436' }}>סטטיסטיקות:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { icon: '🎮', label: 'משחקים', val: progress.games },
              { icon: '🔥', label: 'שיא רצף', val: progress.bestStreak },
              { icon: '📊', label: 'רמה', val: progress.level },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 15, fontFamily: "'Rubik', sans-serif", color: '#555',
              }}>
                <span>{s.icon}</span>
                <span>{s.label}:</span>
                <span style={{ fontWeight: 700, color: '#2D3436' }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
function App() {
  const [view, setView] = useState('home');
  const speak = useSpeech();
  const { data, addLetter, addStars, addGame, addStreak, resetStreak } = useProgress();

  const handleNav = (target) => setView(target === 'learn' ? 'learn' : target === 'achievements' ? 'achievements' : 'home');
  const handleActivity = (id) => setView(id);
  const handleBack = () => setView('home');

  const gameProps = { speak, addStars, addGame, addStreak, resetStreak, onBack: handleBack, progress: data };

  const renderScreen = () => {
    switch (view) {
      case 'learn':
        return <LearnScreen speak={speak} progress={data} addLetter={addLetter} addStars={addStars} onBack={handleBack} />;
      case 'find':
        return <FindGameWrapper {...gameProps} />;
      case 'match':
        return <MatchGameWrapper {...gameProps} />;
      case 'sound':
        return <SoundGameWrapper {...gameProps} />;
      case 'achievements':
        return <AchievementsScreen progress={data} speak={speak} onBack={handleBack} />;
      default:
        return <HomeScreen onActivity={handleActivity} speak={speak} progress={data} />;
    }
  };

  const currentNav = view === 'achievements' ? 'achievements' : view === 'learn' ? 'learn' : 'home';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      maxWidth: 500, margin: '0 auto',
      fontFamily: "'Rubik', 'Heebo', sans-serif",
      direction: 'rtl', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {renderScreen()}
      <NavBar current={currentNav} onNavigate={handleNav} stars={data.stars} level={data.level} />
    </div>
  );
}

export default App;
