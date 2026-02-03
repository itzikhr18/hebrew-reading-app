import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/*
 * אפליקציית לימוד קריאה לילדים - גרסה 14.0
 * כולל: אותיות, ניקוד, צירופים ומשחקים
 * עיצוב ויזואלי משחקי משופר
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

// ==================== NIKUD (VOWELS) DATA ====================
// Modern Israeli Hebrew has 5 vowel sounds: /a/, /e/, /i/, /o/, /u/
// Kamatz & Patach = "a", Tsere & Segol = "e", Chirik = "i", Cholam = "o", Kubutz & Shuruk = "u"
const NIKUD = [
  { symbol: 'ָ', name: 'קָמָץ', sound: 'אָ', spokenSound: 'אַ', color: '#FF6B6B', example: 'אָב', exampleMeaning: 'אבא' },
  { symbol: 'ַ', name: 'פַּתָח', sound: 'אַ', spokenSound: 'אַ', color: '#4ECDC4', example: 'אַף', exampleMeaning: 'אף' },
  { symbol: 'ֵ', name: 'צֵירֵי', sound: 'אֵ', spokenSound: 'אֵי', color: '#9B59B6', example: 'אֵם', exampleMeaning: 'אמא' },
  { symbol: 'ֶ', name: 'סֶגּוֹל', sound: 'אֶ', spokenSound: 'אֶה', color: '#3498DB', example: 'מֶלֶך', exampleMeaning: 'מלך' },
  { symbol: 'ִ', name: 'חִירִיק', sound: 'אִ', spokenSound: 'אִי', color: '#2ECC71', example: 'סִיר', exampleMeaning: 'סיר' },
  { symbol: 'ֹ', name: 'חוֹלָם', sound: 'אֹ', spokenSound: 'אוֹ', color: '#E67E22', example: 'לֹא', exampleMeaning: 'לא' },
  { symbol: 'ֻ', name: 'קֻבּוּץ', sound: 'אֻ', spokenSound: 'אוּ', color: '#E74C3C', example: 'קֻם', exampleMeaning: 'קום' },
  { symbol: 'וּ', name: 'שׁוּרוּק', sound: 'וּ', spokenSound: 'אוּ', color: '#8E44AD', example: 'שׁוּם', exampleMeaning: 'שום' },
];

// Simplified nikud for initial learning (the 5 main vowels)
// spokenAs: what TTS should say for this vowel sound
const NIKUD_BASIC = [
  { symbol: 'ָ', name: 'קָמָץ', sound: 'אָ', spokenAs: 'אַ', vowelSound: 'a', color: '#FF6B6B' },
  { symbol: 'ַ', name: 'פַּתָח', sound: 'אַ', spokenAs: 'אַ', vowelSound: 'a', color: '#4ECDC4' },
  { symbol: 'ִ', name: 'חִירִיק', sound: 'אִ', spokenAs: 'אִי', vowelSound: 'i', color: '#2ECC71' },
  { symbol: 'ֵ', name: 'צֵירֵי', sound: 'אֵ', spokenAs: 'אֵי', vowelSound: 'e', color: '#9B59B6' },
  { symbol: 'ֹ', name: 'חוֹלָם', sound: 'אֹ', spokenAs: 'אוֹ', vowelSound: 'o', color: '#E67E22' },
  { symbol: 'וּ', name: 'שׁוּרוּק', sound: 'וּ', spokenAs: 'אוּ', vowelSound: 'u', color: '#8E44AD' },
];

// ==================== SYLLABLES (TZERUFIM) DATA ====================
// Generate syllables for each letter + nikud combination
// Using proper phonetic representation for TTS pronunciation
const CONSONANTS_FOR_SYLLABLES = ['ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];

function generateSyllables() {
  const syllables = [];
  // Each nikud with its TTS-friendly pronunciation suffix
  // The spokenSuffix is added to create a pronounceable syllable
  const nikudList = [
    { symbol: 'ָ', spokenSuffix: 'ָא', name: 'קמץ', color: '#FF6B6B', vowelSound: 'a' },
    { symbol: 'ַ', spokenSuffix: 'ַא', name: 'פתח', color: '#4ECDC4', vowelSound: 'a' },
    { symbol: 'ִ', spokenSuffix: 'ִי', name: 'חיריק', color: '#2ECC71', vowelSound: 'i' },
    { symbol: 'ֵ', spokenSuffix: 'ֵי', name: 'צירי', color: '#9B59B6', vowelSound: 'e' },
    { symbol: 'ֶ', spokenSuffix: 'ֶה', name: 'סגול', color: '#3498DB', vowelSound: 'e' },
    { symbol: 'ֹ', spokenSuffix: 'וֹ', name: 'חולם', color: '#E67E22', vowelSound: 'o' },
    { symbol: 'ֻ', spokenSuffix: 'וּ', name: 'קובוץ', color: '#E74C3C', vowelSound: 'u' },
  ];

  CONSONANTS_FOR_SYLLABLES.forEach(letter => {
    const letterData = LETTERS.find(l => l.letter === letter);
    const baseColor = letterData?.color || '#888';
    nikudList.forEach(n => {
      const syllable = letter + n.symbol;
      // For TTS: use the letter + nikud + mater lectionis (helping vowel letter)
      // This helps TTS pronounce the syllable correctly
      const spokenSound = letter + n.spokenSuffix;
      syllables.push({
        syllable,
        letter,
        nikud: n.symbol,
        nikudName: n.name,
        sound: spokenSound,
        vowelSound: n.vowelSound,
        color: baseColor,
        nikudColor: n.color,
      });
    });
  });
  return syllables;
}

const SYLLABLES = generateSyllables();

// Get syllables for a specific letter
function getSyllablesForLetter(letter) {
  return SYLLABLES.filter(s => s.letter === letter);
}

// Get syllables for a specific nikud
function getSyllablesForNikud(nikudSymbol) {
  return SYLLABLES.filter(s => s.nikud === nikudSymbol);
}

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

// Pick syllable distractors - same letter different nikud, or same nikud different letter
function pickSyllableDistractors(target, count, mode = 'mixed') {
  let pool = [];
  if (mode === 'sameNikud') {
    // Same nikud, different letters
    pool = SYLLABLES.filter(s => s.nikud === target.nikud && s.letter !== target.letter);
  } else if (mode === 'sameLetter') {
    // Same letter, different nikud
    pool = SYLLABLES.filter(s => s.letter === target.letter && s.nikud !== target.nikud);
  } else {
    // Mixed - prefer same letter (harder)
    const sameLetter = SYLLABLES.filter(s => s.letter === target.letter && s.nikud !== target.nikud);
    const sameNikud = SYLLABLES.filter(s => s.nikud === target.nikud && s.letter !== target.letter);
    const others = SYLLABLES.filter(s => s.letter !== target.letter && s.nikud !== target.nikud);
    pool = [...sameLetter, ...sameNikud, ...others];
  }
  return pool.sort(() => Math.random() - 0.5).slice(0, count);
}

// Pick nikud distractors
function pickNikudDistractors(target, count) {
  return NIKUD_BASIC.filter(n => n.symbol !== target.symbol)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
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

// Animated background with floating bubbles and particles
function GameBackground({ color1 = '#1e3c72', color2 = '#2a5298', color3 = '#4facfe' }) {
  const bubbles = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    size: 20 + Math.random() * 60,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 12,
    opacity: 0.1 + Math.random() * 0.2,
  })), []);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
      background: `linear-gradient(180deg, ${color1} 0%, ${color2} 40%, ${color3} 100%)`,
      overflow: 'hidden',
    }}>
      {/* Gradient overlay for depth */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
      }} />
      {/* Floating bubbles */}
      {bubbles.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', bottom: -100, left: b.left,
          width: b.size, height: b.size, borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${b.opacity + 0.2}), rgba(255,255,255,${b.opacity}))`,
          animation: `bubbleFloat ${b.duration}s ease-in-out infinite`,
          animationDelay: `${b.delay}s`,
        }} />
      ))}
    </div>
  );
}

function FloatingParticles() {
  const particles = useMemo(() => {
    const emojis = ['⭐', '✨', '💫', '🌟', '🎵', '❤️', '🌈', '💎', '🦋'];
    return Array.from({ length: 12 }, (_, i) => ({
      emoji: emojis[i % emojis.length],
      left: `${5 + (i * 9) % 90}%`,
      top: `${10 + (i * 13) % 70}%`,
      delay: i * 0.5,
      duration: 5 + (i % 4),
      size: 16 + (i % 4) * 6,
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map((p, i) => (
        <span key={i} style={{
          position: 'absolute', top: p.top, left: p.left,
          fontSize: p.size, opacity: 0.25,
          animation: `floatSlow ${p.duration}s ease infinite`,
          animationDelay: `${p.delay}s`,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
        }}>{p.emoji}</span>
      ))}
    </div>
  );
}

function ConfettiEffect({ active }) {
  const pieces = useMemo(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#FF69B4', '#9B59B6', '#3498DB', '#2ECC71', '#FF9500'];
    return Array.from({ length: 50 }, (_, i) => ({
      color: colors[i % colors.length],
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 2,
      size: 8 + Math.random() * 12,
      rotation: Math.random() * 360,
    }));
  }, []);

  if (!active) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 3000 }}>
      {pieces.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: -20, left: p.left,
          width: p.size, height: p.size * 0.6,
          borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '3px' : '50% 0',
          background: p.color,
          boxShadow: `0 0 6px ${p.color}`,
          animation: `confettiDrop ${p.duration}s ease forwards`,
          animationDelay: `${p.delay}s`,
          transform: `rotate(${p.rotation}deg)`,
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
      position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
      background: streak >= 5
        ? 'linear-gradient(135deg, #FF416C, #FF4B2B)'
        : 'linear-gradient(135deg, #F7971E, #FFD200)',
      color: 'white', padding: '6px 18px', borderRadius: 25,
      fontSize: 14, fontWeight: 800, fontFamily: "'Rubik', sans-serif",
      boxShadow: '0 4px 15px rgba(255,107,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
      border: '2px solid rgba(255,255,255,0.3)',
      animation: 'popIn 0.4s ease, pulse 1.5s ease infinite',
      zIndex: 50, whiteSpace: 'nowrap',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    }}>
      {fire} רצף {streak}!
    </div>
  );
}

// 3D Game-like button with glossy effect
function Button({ children, onClick, color = '#4ECDC4', size = 'medium', icon, disabled, style, glow }) {
  const sizes = {
    small: { padding: '10px 20px', fontSize: 15, borderRadius: 14, iconSize: 18 },
    medium: { padding: '14px 32px', fontSize: 18, borderRadius: 18, iconSize: 22 },
    large: { padding: '18px 44px', fontSize: 22, borderRadius: 22, iconSize: 28 },
  };
  const s = sizes[size] || sizes.medium;

  // Create lighter and darker shades
  const lighterColor = `${color}`;
  const darkerColor = `${color}cc`;

  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        padding: s.padding, fontSize: s.fontSize, borderRadius: s.borderRadius,
        border: 'none',
        background: `linear-gradient(180deg, ${lighterColor} 0%, ${darkerColor} 100%)`,
        color: 'white', fontFamily: "'Rubik', sans-serif", fontWeight: 800,
        cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.6 : 1,
        boxShadow: `
          0 6px 0 ${color}99,
          0 8px 15px rgba(0,0,0,0.3),
          inset 0 2px 0 rgba(255,255,255,0.4),
          inset 0 -2px 0 rgba(0,0,0,0.1)
        `,
        transition: 'transform 0.1s, box-shadow 0.1s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        whiteSpace: 'nowrap',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        letterSpacing: '0.5px',
        position: 'relative',
        overflow: 'hidden',
        animation: glow ? 'glowPulse 2s ease infinite' : 'none',
        ...style,
      }}
    >
      {/* Shine effect */}
      <div style={{
        position: 'absolute', top: 0, left: '-100%', width: '100%', height: '50%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        animation: 'shimmer 3s ease infinite',
      }} />
      {icon && <span style={{ fontSize: s.iconSize, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>{icon}</span>}
      {children}
    </button>
  );
}

// Game-like icon button
function IconButton({ children, onClick, color = '#5D9CEC', style }) {
  return (
    <button onClick={onClick}
      style={{
        width: 50, height: 50, borderRadius: 15, border: 'none',
        background: `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)`,
        color: 'white', fontSize: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: `
          0 4px 0 ${color}88,
          0 6px 12px rgba(0,0,0,0.25),
          inset 0 2px 0 rgba(255,255,255,0.3)
        `,
        transition: 'transform 0.1s, box-shadow 0.1s',
        ...style,
      }}
    >{children}</button>
  );
}

// Game-like navigation bar
function NavBar({ current, onNavigate, stars, level }) {
  const items = [
    { id: 'achievements', label: 'הישגים', icon: '🏆', color: '#FFD700' },
    { id: 'learn', label: 'לימוד', icon: '📖', color: '#4ECDC4' },
    { id: 'home', label: 'בית', icon: '🏠', color: '#FF6B6B' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 10px',
      background: 'linear-gradient(180deg, #2C3E50 0%, #1a252f 100%)',
      borderRadius: '25px 25px 0 0',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      zIndex: 100,
    }}>
      {items.map(item => {
        const isActive = current === item.id;
        return (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '8px 16px', borderRadius: 16,
              position: 'relative',
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: isActive
                ? `linear-gradient(180deg, ${item.color} 0%, ${item.color}cc 100%)`
                : 'linear-gradient(180deg, #4a5568 0%, #2d3748 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
              boxShadow: isActive
                ? `0 4px 0 ${item.color}88, 0 6px 15px ${item.color}44, inset 0 2px 0 rgba(255,255,255,0.3)`
                : '0 3px 0 #1a202c, inset 0 1px 0 rgba(255,255,255,0.1)',
              transform: isActive ? 'translateY(-5px)' : 'translateY(0)',
              transition: 'all 0.2s',
            }}>
              {item.icon}
            </div>
            <span style={{
              fontSize: 11, fontWeight: isActive ? 800 : 600,
              color: isActive ? item.color : '#8892a0',
              fontFamily: "'Rubik', sans-serif",
              textShadow: isActive ? `0 0 10px ${item.color}66` : 'none',
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
      zIndex: 2000, background: 'rgba(0,0,0,0.6)', animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '35px 50px', borderRadius: 30,
        background: isSuccess
          ? 'linear-gradient(180deg, #56ab2f 0%, #a8e063 100%)'
          : 'linear-gradient(180deg, #f093fb 0%, #f5576c 100%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.3)',
        border: '3px solid rgba(255,255,255,0.3)',
        animation: 'popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 55, marginBottom: 15,
          boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.1)',
          animation: 'bounce 1s ease infinite',
        }}>
          {isSuccess ? '🎉' : '💪'}
        </div>
        <div style={{
          fontSize: 28, fontWeight: 800,
          color: 'white', fontFamily: "'Rubik', sans-serif",
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}>
          {message || (isSuccess ? randomFrom(ENCOURAGEMENTS) : randomFrom(RETRY_MESSAGES))}
        </div>
      </div>
    </div>
  );
}

// Game-like progress bar with 3D effect
function ProgressBar({ current, total, color = '#FFD93D' }) {
  const percentage = (current / total) * 100;
  return (
    <div style={{
      width: '100%', maxWidth: 300, height: 18, borderRadius: 10,
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
      boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.1)',
      padding: 3,
      border: '2px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{
        width: `${percentage}%`, height: '100%', borderRadius: 7,
        background: `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)`,
        boxShadow: `0 0 10px ${color}66, inset 0 2px 0 rgba(255,255,255,0.4)`,
        transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Shine animation */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
          borderRadius: '7px 7px 0 0',
        }} />
      </div>
    </div>
  );
}

function LevelBadge({ level }) {
  const titles = ['', 'מתחיל', 'חוקר', 'יודע', 'מומחה', 'גאון', 'אלוף'];
  const colors = ['', '#78909C', '#4ECDC4', '#3498DB', '#9B59B6', '#FF6B00', '#FFD700'];
  const bgColors = ['', '#455a64', '#26a69a', '#1976D2', '#7B1FA2', '#E65100', '#FFA000'];
  const l = Math.min(level, 6);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: `linear-gradient(135deg, ${bgColors[l]} 0%, ${colors[l]} 100%)`,
      color: 'white',
      padding: '6px 14px', borderRadius: 12,
      fontSize: 13, fontWeight: 800, fontFamily: "'Rubik', sans-serif",
      boxShadow: `0 3px 0 ${bgColors[l]}88, 0 4px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)`,
      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    }}>
      <span style={{ fontSize: 16 }}>⭐</span>
      רמה {l}: {titles[l]}
    </div>
  );
}

// Game-like card component
function GameCard({ children, color = '#ffffff', style: customStyle, onClick, animate = true }) {
  return (
    <div onClick={onClick} style={{
      background: `linear-gradient(180deg, ${color} 0%, ${color}ee 100%)`,
      borderRadius: 24,
      padding: 20,
      boxShadow: `
        0 8px 0 rgba(0,0,0,0.15),
        0 12px 30px rgba(0,0,0,0.2),
        inset 0 2px 0 rgba(255,255,255,0.8),
        inset 0 -2px 0 rgba(0,0,0,0.05)
      `,
      border: '3px solid rgba(255,255,255,0.5)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, box-shadow 0.2s',
      animation: animate ? 'popIn 0.4s ease' : 'none',
      ...customStyle,
    }}>
      {children}
    </div>
  );
}

// Stars display for game UI
function StarsDisplay({ count, size = 'medium' }) {
  const sizes = { small: 14, medium: 20, large: 28 };
  const s = sizes[size] || sizes.medium;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'linear-gradient(180deg, #2C3E50 0%, #1a252f 100%)',
      padding: `${s/3}px ${s}px`,
      borderRadius: s,
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.1)',
      border: '2px solid rgba(255,255,255,0.1)',
    }}>
      <span style={{ fontSize: s, filter: 'drop-shadow(0 2px 4px rgba(255,215,0,0.5))' }}>⭐</span>
      <span style={{
        fontSize: s * 0.9, fontWeight: 800, color: '#FFD700',
        fontFamily: "'Rubik', sans-serif",
        textShadow: '0 0 10px rgba(255,215,0,0.5)',
      }}>{count}</span>
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
    // Learning section
    { id: 'learn', icon: '📖', label: 'לימוד אותיות', desc: 'למד את האותיות, הצלילים והמילים', color: '#4ECDC4', bgColor: '#26a69a' },
    { id: 'nikud', icon: '🔤', label: 'לימוד ניקוד', desc: 'למד את התנועות - קמץ, פתח, חיריק...', color: '#9B59B6', bgColor: '#7B1FA2' },
    { id: 'syllables', icon: '🧩', label: 'לימוד צירופים', desc: 'צרף אותיות עם ניקוד - בָּ, מִ, שֵׁ...', color: '#E67E22', bgColor: '#E65100' },
    // Games section
    { id: 'find', icon: '🔍', label: 'מצא את האות', desc: 'שמע את הצליל ומצא את האות!', color: '#FF6B6B', bgColor: '#e53935' },
    { id: 'match', icon: '🎯', label: 'התאם לתמונה', desc: 'ראה תמונה ובחר את האות הנכונה', color: '#2ECC71', bgColor: '#43A047' },
    { id: 'sound', icon: '🎵', label: 'זהה את הצליל', desc: 'שמע צליל ובחר איזו אות עושה אותו', color: '#FF9800', bgColor: '#EF6C00' },
    { id: 'syllableGame', icon: '🎮', label: 'משחק צירופים', desc: 'שמע צירוף ומצא אותו!', color: '#3498DB', bgColor: '#1976D2' },
  ];

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      overflow: 'auto', zIndex: 1,
    }}>
      {/* Game-like gradient background */}
      <GameBackground color1="#1a5276" color2="#2e86ab" color3="#48b8a0" />
      <FloatingParticles />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 420,
        padding: '15px 20px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Header with stars */}
        <div style={{
          width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: 5,
        }}>
          <StarsDisplay count={progress.stars} size="medium" />
        </div>

        {/* Mascot & Title */}
        <img src={ASSETS.images.mascotHappy} alt="ינשוף" style={{
          width: 110, height: 110, objectFit: 'contain',
          animation: 'float 3s ease infinite', marginBottom: 5,
          filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.3))',
        }} />
        <h1 style={{
          fontSize: 36, fontWeight: 800, color: 'white', textAlign: 'center',
          fontFamily: "'Rubik', sans-serif", margin: '0 0 6px',
          textShadow: '0 3px 6px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.2)',
        }}>לומדים לקרוא! 🦉</h1>
        <LevelBadge level={progress.level} />
        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 8, marginBottom: 16,
          fontFamily: "'Rubik', sans-serif", textShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}>
          בחר פעילות להתחיל
        </p>

        {/* Activity Cards - Game style */}
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
              padding: '14px 18px', marginBottom: 10,
              background: `linear-gradient(180deg, ${act.color} 0%, ${act.bgColor} 100%)`,
              borderRadius: 18,
              border: '3px solid rgba(255,255,255,0.3)',
              boxShadow: `
                0 6px 0 ${act.bgColor}99,
                0 8px 20px rgba(0,0,0,0.25),
                inset 0 2px 0 rgba(255,255,255,0.3)
              `,
              cursor: 'pointer',
              transition: 'transform 0.1s, box-shadow 0.1s',
              animation: `fadeInUp 0.4s ease forwards`,
              animationDelay: `${i * 0.08}s`, opacity: 0,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Shine effect */}
            <div style={{
              position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              animation: 'shimmer 4s ease infinite',
              animationDelay: `${i * 0.3}s`,
            }} />
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(5px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, flexShrink: 0,
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.1)',
              border: '2px solid rgba(255,255,255,0.2)',
            }}>
              {act.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 17, fontWeight: 700, color: 'white', fontFamily: "'Rubik', sans-serif",
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}>{act.label}</div>
              <div style={{
                fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: "'Rubik', sans-serif", marginTop: 2,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}>{act.desc}</div>
            </div>
            <span style={{
              fontSize: 20, color: 'rgba(255,255,255,0.6)',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}>❮</span>
          </div>
        ))}

        {/* Stats - Game style */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, width: '100%' }}>
          {[
            { icon: '⭐', val: progress.stars, label: 'כוכבים', color: '#FFD700', bgColor: '#FFA000' },
            { icon: '🔤', val: `${progress.learned.length}/${LETTERS.length}`, label: 'אותיות', color: '#4ECDC4', bgColor: '#26a69a' },
            { icon: '🔥', val: progress.bestStreak, label: 'שיא רצף', color: '#FF6B6B', bgColor: '#e53935' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: `linear-gradient(180deg, ${s.color} 0%, ${s.bgColor} 100%)`,
              padding: '10px 6px', borderRadius: 14,
              boxShadow: `0 4px 0 ${s.bgColor}99, 0 6px 15px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)`,
              border: '2px solid rgba(255,255,255,0.3)',
              animation: `fadeInUp 0.4s ease forwards`, animationDelay: `${0.5 + i * 0.08}s`, opacity: 0,
            }}>
              <span style={{ fontSize: 20, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>{s.icon}</span>
              <span style={{
                fontSize: 18, fontWeight: 800, color: 'white', fontFamily: "'Rubik', sans-serif",
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}>{s.val}</span>
              <span style={{
                fontSize: 10, color: 'rgba(255,255,255,0.9)', fontFamily: "'Rubik', sans-serif",
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}>{s.label}</span>
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
      {/* Game-like gradient background with letter color accent */}
      <GameBackground color1="#1a5276" color2="#2e86ab" color3={letter.color} />
      <FloatingParticles />
      <ConfettiEffect active={showConfetti} />
      {showFeedback && <Feedback type="success" />}

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <IconButton onClick={onBack} color="#5D9CEC">✕</IconButton>
        <div style={{
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
          padding: '6px 16px', borderRadius: 20,
          fontSize: 14, fontWeight: 700, color: 'white', fontFamily: "'Rubik', sans-serif",
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.15)',
          border: '2px solid rgba(255,255,255,0.2)',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
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

// ==================== NIKUD LEARNING SCREEN ====================
function NikudLearnScreen({ speak, progress, addStars, onBack }) {
  const [idx, setIdx] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState([]);
  const [quizSelected, setQuizSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [learnedNikud, setLearnedNikud] = useState(() => {
    try {
      const saved = localStorage.getItem('hebrew_app_nikud_learned');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const playSound = useSound();
  const safeTimeout = useSafeTimeouts();

  const nikud = NIKUD_BASIC[idx];

  useEffect(() => {
    try { localStorage.setItem('hebrew_app_nikud_learned', JSON.stringify(learnedNikud)); } catch {}
  }, [learnedNikud]);

  const speakNow = useCallback(() => {
    speak(`זה ${nikud.name}. ${nikud.name} נשמע ${nikud.spokenAs}`);
  }, [speak, nikud]);

  useEffect(() => {
    if (!quizMode) {
      const t = setTimeout(speakNow, 500);
      return () => clearTimeout(t);
    }
  }, [idx, speakNow, quizMode]);

  const goNext = () => { setIdx(i => (i + 1) % NIKUD_BASIC.length); setQuizMode(false); };
  const goPrev = () => { setIdx(i => (i - 1 + NIKUD_BASIC.length) % NIKUD_BASIC.length); setQuizMode(false); };

  const startQuiz = () => {
    playSound('click');
    const distractors = pickNikudDistractors(nikud, 2);
    const opts = [nikud, ...distractors].sort(() => Math.random() - 0.5);
    setQuizOptions(opts);
    setQuizSelected(null);
    setQuizMode(true);
    safeTimeout(() => speak(nikud.spokenAs), 300);
  };

  const handleQuizPick = (opt) => {
    if (quizSelected) return;
    playSound('click');
    setQuizSelected(opt.symbol);
    if (opt.symbol === nikud.symbol) {
      if (!learnedNikud.includes(nikud.symbol)) {
        setLearnedNikud(prev => [...prev, nikud.symbol]);
      }
      addStars(3);
      setShowFeedback(true);
      setShowConfetti(true);
      safeTimeout(() => {
        setShowFeedback(false);
        setShowConfetti(false);
        setQuizMode(false);
        setQuizSelected(null);
        setIdx(i => (i + 1) % NIKUD_BASIC.length);
      }, 1800);
    } else {
      safeTimeout(() => {
        setQuizSelected(null);
        speak(`לא, זה ${opt.name}. נסה שוב! ${nikud.spokenAs}`);
      }, 1200);
    }
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
      display: 'flex', flexDirection: 'column', zIndex: 1,
    }}>
      {/* Game-like gradient background with nikud color accent */}
      <GameBackground color1="#4a148c" color2="#7b1fa2" color3={nikud.color} />
      <FloatingParticles />
      <ConfettiEffect active={showConfetti} />
      {showFeedback && <Feedback type="success" />}

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <IconButton onClick={onBack} color="#9B59B6">✕</IconButton>
        <div style={{
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
          padding: '6px 16px', borderRadius: 20,
          fontSize: 14, fontWeight: 700, color: 'white', fontFamily: "'Rubik', sans-serif",
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.15)',
          border: '2px solid rgba(255,255,255,0.2)',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}>
          ניקוד {idx + 1} מתוך {NIKUD_BASIC.length}
        </div>
        <IconButton onClick={speakNow} color="#2196F3">🔊</IconButton>
      </div>

      {/* Nikud indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '4px 20px', position: 'relative', zIndex: 1 }}>
        {NIKUD_BASIC.map((n, i) => {
          const learned = learnedNikud.includes(n.symbol);
          const isCurrent = i === idx;
          return (
            <button key={i} onClick={() => { setIdx(i); setQuizMode(false); }} style={{
              width: 32, height: 32, borderRadius: 10, border: 'none',
              background: isCurrent ? n.color : learned ? `${n.color}33` : '#eee',
              color: isCurrent ? 'white' : learned ? n.color : '#bbb',
              fontSize: 18, fontWeight: 700, cursor: 'pointer',
              boxShadow: isCurrent ? `0 3px 10px ${n.color}55` : 'none',
              transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>א{n.symbol}</button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 20px', position: 'relative', zIndex: 1 }}>
        <ProgressBar current={idx + 1} total={NIKUD_BASIC.length} color={nikud.color} />
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '8px 20px', position: 'relative', zIndex: 1, minHeight: 0,
      }}>
        {quizMode ? (
          <>
            <div style={{
              fontSize: 18, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif",
              marginBottom: 14, textAlign: 'center',
            }}>
              איזה ניקוד נשמע ככה? 🎯
            </div>
            <div style={{
              width: 70, height: 70, borderRadius: '50%', margin: '0 auto 16px',
              background: `linear-gradient(145deg, ${nikud.color}, ${nikud.color}bb)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30, cursor: 'pointer',
              boxShadow: `0 6px 20px ${nikud.color}44`,
              animation: 'pulse 2s ease infinite',
            }} onClick={() => speak(nikud.spokenAs)}>
              🔊
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%', maxWidth: 280 }}>
              {quizOptions.map((opt, i) => {
                const isSelected = quizSelected === opt.symbol;
                const isCorrect = opt.symbol === nikud.symbol;
                let bg = 'white';
                if (isSelected) bg = isCorrect ? '#C8E6C9' : '#FFCDD2';
                return (
                  <div key={i} onClick={() => handleQuizPick(opt)} style={{
                    aspectRatio: '1', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 36, fontWeight: 700, color: opt.color,
                    background: isSelected ? bg : 'linear-gradient(145deg, white, #fafafa)',
                    borderRadius: 20,
                    border: `3px solid ${isSelected ? (isCorrect ? '#4CAF50' : '#F44336') : opt.color + '66'}`,
                    boxShadow: isSelected
                      ? (isCorrect ? '0 0 20px rgba(76,175,80,0.3)' : '0 0 20px rgba(244,67,54,0.3)')
                      : `0 4px 15px ${opt.color}18`,
                    cursor: quizSelected ? 'default' : 'pointer',
                    transition: 'all 0.2s', fontFamily: "'Rubik', sans-serif",
                  }}>
                    <span>א{opt.symbol}</span>
                    <span style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{opt.name}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div style={{
              width: 140, height: 140, borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, white 0%, #fafafa 100%)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 10px 40px ${nikud.color}40, 0 0 0 4px ${nikud.color}, 0 0 0 8px ${nikud.color}22`,
              marginBottom: 16, animation: 'popIn 0.4s ease',
            }}>
              <span style={{ fontSize: 70, fontWeight: 700, color: nikud.color, lineHeight: 1 }}>א{nikud.symbol}</span>
            </div>

            <div style={{
              fontSize: 22, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif",
              marginBottom: 8, animation: 'fadeInUp 0.4s ease 0.1s forwards', opacity: 0,
            }}>
              {nikud.name}
            </div>

            <div style={{
              background: `${nikud.color}15`, padding: '8px 20px', borderRadius: 16,
              marginBottom: 12, animation: 'fadeInUp 0.4s ease 0.2s forwards', opacity: 0,
            }}>
              <span style={{ fontSize: 18, color: nikud.color, fontWeight: 600, fontFamily: "'Rubik', sans-serif" }}>
                🔈 נשמע: &quot;{nikud.sound}&quot;
              </span>
            </div>

            {/* Example syllables */}
            <div style={{
              display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center',
              background: 'rgba(255,255,255,0.9)', padding: '12px 20px', borderRadius: 18,
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              animation: 'fadeInUp 0.4s ease 0.3s forwards', opacity: 0,
            }}>
              {['ב', 'מ', 'ל', 'ש'].map((letter, i) => {
                // Find the proper spoken sound from SYLLABLES
                const syllableData = SYLLABLES.find(s => s.letter === letter && s.nikud === nikud.symbol);
                const spokenSound = syllableData ? syllableData.sound : letter + nikud.symbol;
                return (
                  <div key={i} onClick={() => speak(spokenSound)} style={{
                    padding: '8px 14px', borderRadius: 12,
                    background: `${nikud.color}15`, cursor: 'pointer',
                    fontSize: 28, fontWeight: 700, color: nikud.color,
                    fontFamily: "'Rubik', sans-serif",
                  }}>
                    {letter}{nikud.symbol}
                  </div>
                );
              })}
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

// ==================== SYLLABLES LEARNING SCREEN ====================
function SyllablesLearnScreen({ speak, progress, addStars, onBack }) {
  const [letterIdx, setLetterIdx] = useState(0);
  const [nikudIdx, setNikudIdx] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState([]);
  const [quizSelected, setQuizSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const playSound = useSound();
  const safeTimeout = useSafeTimeouts();

  const currentLetter = CONSONANTS_FOR_SYLLABLES[letterIdx];
  // Each nikud with proper TTS pronunciation suffix (mater lectionis)
  const nikudList = [
    { symbol: 'ָ', spokenSuffix: 'ָא', name: 'קמץ', color: '#FF6B6B' },
    { symbol: 'ַ', spokenSuffix: 'ַא', name: 'פתח', color: '#4ECDC4' },
    { symbol: 'ִ', spokenSuffix: 'ִי', name: 'חיריק', color: '#2ECC71' },
    { symbol: 'ֵ', spokenSuffix: 'ֵי', name: 'צירי', color: '#9B59B6' },
    { symbol: 'ֶ', spokenSuffix: 'ֶה', name: 'סגול', color: '#3498DB' },
    { symbol: 'ֹ', spokenSuffix: 'וֹ', name: 'חולם', color: '#E67E22' },
  ];
  const currentNikud = nikudList[nikudIdx];
  const syllable = currentLetter + currentNikud.symbol;
  // For TTS: letter + nikud symbol + helping vowel letter (mater lectionis)
  const syllableSound = currentLetter + currentNikud.spokenSuffix;
  const letterData = LETTERS.find(l => l.letter === currentLetter);
  const letterColor = letterData?.color || '#888';

  const speakNow = useCallback(() => {
    speak(`${syllable}. ${currentLetter} עם ${currentNikud.name} זה ${syllableSound}`);
  }, [speak, syllable, currentLetter, currentNikud.name, syllableSound]);

  useEffect(() => {
    if (!quizMode) {
      const t = setTimeout(speakNow, 500);
      return () => clearTimeout(t);
    }
  }, [letterIdx, nikudIdx, speakNow, quizMode]);

  const nextNikud = () => {
    if (nikudIdx < nikudList.length - 1) setNikudIdx(n => n + 1);
    else { setNikudIdx(0); setLetterIdx(l => (l + 1) % CONSONANTS_FOR_SYLLABLES.length); }
    setQuizMode(false);
  };

  const prevNikud = () => {
    if (nikudIdx > 0) setNikudIdx(n => n - 1);
    else if (letterIdx > 0) { setLetterIdx(l => l - 1); setNikudIdx(nikudList.length - 1); }
    setQuizMode(false);
  };

  const startQuiz = () => {
    playSound('click');
    const target = SYLLABLES.find(s => s.syllable === syllable);
    if (!target) return;
    const distractors = pickSyllableDistractors(target, 2, 'sameLetter');
    const opts = [target, ...distractors].sort(() => Math.random() - 0.5);
    setQuizOptions(opts);
    setQuizSelected(null);
    setQuizMode(true);
    safeTimeout(() => speak(syllableSound), 300);
  };

  const handleQuizPick = (opt) => {
    if (quizSelected) return;
    playSound('click');
    setQuizSelected(opt.syllable);
    if (opt.syllable === syllable) {
      addStars(3);
      setShowFeedback(true);
      setShowConfetti(true);
      safeTimeout(() => {
        setShowFeedback(false);
        setShowConfetti(false);
        setQuizMode(false);
        setQuizSelected(null);
        nextNikud();
      }, 1800);
    } else {
      safeTimeout(() => {
        setQuizSelected(null);
        speak(`לא, זה ${opt.sound}. נסה שוב! ${syllableSound}`);
      }, 1200);
    }
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
      display: 'flex', flexDirection: 'column', zIndex: 1,
    }}>
      {/* Game-like gradient background with letter/nikud color accent */}
      <GameBackground color1="#e65100" color2="#f57c00" color3={letterColor} />
      <FloatingParticles />
      <ConfettiEffect active={showConfetti} />
      {showFeedback && <Feedback type="success" />}

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <IconButton onClick={onBack} color="#E67E22">✕</IconButton>
        <div style={{
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
          padding: '6px 16px', borderRadius: 20,
          fontSize: 14, fontWeight: 700, color: 'white', fontFamily: "'Rubik', sans-serif",
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.15)',
          border: '2px solid rgba(255,255,255,0.2)',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}>
          אות {currentLetter} • ניקוד {nikudIdx + 1}/{nikudList.length}
        </div>
        <IconButton onClick={speakNow} color="#2196F3">🔊</IconButton>
      </div>

      {/* Letter selector */}
      <div style={{
        display: 'flex', gap: 4, padding: '4px 12px', overflowX: 'auto', overflowY: 'hidden',
        position: 'relative', zIndex: 1, flexShrink: 0, scrollbarWidth: 'none',
      }}>
        {CONSONANTS_FOR_SYLLABLES.map((l, i) => {
          const lData = LETTERS.find(x => x.letter === l);
          const isCurrent = i === letterIdx;
          return (
            <button key={i} onClick={() => { setLetterIdx(i); setNikudIdx(0); setQuizMode(false); }} style={{
              width: 30, height: 30, minWidth: 30, borderRadius: 8, border: 'none',
              background: isCurrent ? lData?.color || '#888' : '#eee',
              color: isCurrent ? 'white' : '#888',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              boxShadow: isCurrent ? `0 2px 8px ${lData?.color || '#888'}55` : 'none',
              transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s',
            }}>{l}</button>
          );
        })}
      </div>

      {/* Nikud selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '6px 20px', position: 'relative', zIndex: 1 }}>
        {nikudList.map((n, i) => {
          const isCurrent = i === nikudIdx;
          return (
            <button key={i} onClick={() => { setNikudIdx(i); setQuizMode(false); }} style={{
              padding: '4px 10px', borderRadius: 10, border: 'none',
              background: isCurrent ? n.color : '#f0f0f0',
              color: isCurrent ? 'white' : '#888',
              fontSize: 16, fontWeight: 600, cursor: 'pointer',
              boxShadow: isCurrent ? `0 2px 8px ${n.color}55` : 'none',
              transition: 'all 0.2s', fontFamily: "'Rubik', sans-serif",
            }}>{currentLetter}{n.symbol}</button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '8px 20px', position: 'relative', zIndex: 1, minHeight: 0,
      }}>
        {quizMode ? (
          <>
            <div style={{
              fontSize: 18, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif",
              marginBottom: 14, textAlign: 'center',
            }}>
              איזה צירוף נשמע ככה? 🎯
            </div>
            <div style={{
              width: 70, height: 70, borderRadius: '50%', margin: '0 auto 16px',
              background: `linear-gradient(145deg, ${letterColor}, ${letterColor}bb)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30, cursor: 'pointer',
              boxShadow: `0 6px 20px ${letterColor}44`,
              animation: 'pulse 2s ease infinite',
            }} onClick={() => speak(syllableSound)}>
              🔊
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%', maxWidth: 280 }}>
              {quizOptions.map((opt, i) => {
                const isSelected = quizSelected === opt.syllable;
                const isCorrect = opt.syllable === syllable;
                let bg = 'white';
                if (isSelected) bg = isCorrect ? '#C8E6C9' : '#FFCDD2';
                return (
                  <div key={i} onClick={() => handleQuizPick(opt)} style={{
                    aspectRatio: '1', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 38, fontWeight: 700, color: opt.color,
                    background: isSelected ? bg : 'linear-gradient(145deg, white, #fafafa)',
                    borderRadius: 20,
                    border: `3px solid ${isSelected ? (isCorrect ? '#4CAF50' : '#F44336') : opt.color + '66'}`,
                    boxShadow: isSelected
                      ? (isCorrect ? '0 0 20px rgba(76,175,80,0.3)' : '0 0 20px rgba(244,67,54,0.3)')
                      : `0 4px 15px ${opt.color}18`,
                    cursor: quizSelected ? 'default' : 'pointer',
                    transition: 'all 0.2s', fontFamily: "'Rubik', sans-serif",
                  }}>
                    <span>{opt.syllable}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div style={{
              width: 150, height: 150, borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, white 0%, #fafafa 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 10px 40px ${letterColor}40, 0 0 0 4px ${letterColor}, 0 0 0 8px ${letterColor}22`,
              marginBottom: 16, animation: 'popIn 0.4s ease',
            }}>
              <span style={{ fontSize: 80, fontWeight: 700, color: letterColor, lineHeight: 1 }}>{syllable}</span>
            </div>

            <div style={{
              background: `${currentNikud.color}15`, padding: '8px 20px', borderRadius: 16,
              marginBottom: 12, animation: 'fadeInUp 0.4s ease 0.1s forwards', opacity: 0,
            }}>
              <span style={{ fontSize: 18, fontWeight: 600, fontFamily: "'Rubik', sans-serif" }}>
                <span style={{ color: letterColor }}>{currentLetter}</span>
                <span style={{ color: '#888' }}> + </span>
                <span style={{ color: currentNikud.color }}>{currentNikud.name}</span>
                <span style={{ color: '#888' }}> = </span>
                <span style={{ color: '#2D3436', fontSize: 22 }}>&quot;{syllableSound}&quot;</span>
              </span>
            </div>

            <div style={{
              fontSize: 24, color: '#888', fontFamily: "'Rubik', sans-serif",
              animation: 'fadeInUp 0.4s ease 0.2s forwards', opacity: 0,
            }}>
              🔈 לחץ להשמעה
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
            <Button onClick={prevNikud} color="#BDBDBD" size="small" icon="→">הקודם</Button>
            <Button onClick={startQuiz} color="#4CAF50" size="large" icon="❓">בחן אותי!</Button>
            <Button onClick={nextNikud} color="#BDBDBD" size="small" icon="←">הבא</Button>
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

  // Get game-specific background colors
  const bgColors = gameConfig.bgColors || { color1: '#1a5276', color2: '#2e86ab', color3: color };

  if (phase === 'intro') {
    return (
      <div style={screenStyle}>
        <GameBackground color1={bgColors.color1} color2={bgColors.color2} color3={bgColors.color3} />
        <FloatingParticles />
        <div style={{ display: 'flex', padding: '12px 16px', position: 'relative', zIndex: 1 }}>
          <IconButton onClick={onBack} color={color}>✕</IconButton>
        </div>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 14, position: 'relative', zIndex: 1,
        }}>
          <img src={ASSETS.images.mascotHappy} alt="" style={{
            width: 120, height: 120, objectFit: 'contain', animation: 'float 3s ease infinite',
            filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.3))',
          }} />
          <span style={{ fontSize: 55, animation: 'popIn 0.4s ease', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>{icon}</span>
          <h2 style={{
            fontSize: 30, fontWeight: 800, color: 'white', fontFamily: "'Rubik', sans-serif",
            animation: 'fadeInUp 0.4s ease 0.1s forwards', opacity: 0,
            textShadow: '0 3px 6px rgba(0,0,0,0.3)',
          }}>{title}</h2>
          <p style={{
            fontSize: 16, color: 'rgba(255,255,255,0.9)', fontFamily: "'Rubik', sans-serif",
            textAlign: 'center', padding: '0 30px', animation: 'fadeInUp 0.4s ease 0.2s forwards', opacity: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}>
            {gameConfig.description}
          </p>
          <div style={{ animation: 'fadeInUp 0.4s ease 0.3s forwards', opacity: 0, marginTop: 5 }}>
            <Button onClick={startGame} color={color} size="large" icon="▶" glow>התחל משחק</Button>
          </div>
          <div style={{ animation: 'fadeInUp 0.4s ease 0.4s forwards', opacity: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <LevelBadge level={progress.level} />
            <span style={{
              fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: "'Rubik', sans-serif",
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}>
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
        <GameBackground color1={bgColors.color1} color2={bgColors.color2} color3={bgColors.color3} />
        <ConfettiEffect active={showConfetti} />
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 14, position: 'relative', zIndex: 1,
        }}>
          <img src={ASSETS.images.mascotCelebrate} alt="" style={{
            width: 130, height: 130, objectFit: 'contain', animation: 'bounce 1s ease infinite',
            filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.3))',
          }} />
          <div style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(10px)',
            padding: '28px 50px', borderRadius: 24,
            boxShadow: '0 8px 0 rgba(0,0,0,0.1), 0 12px 40px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,1)',
            border: '3px solid rgba(255,255,255,0.5)',
            textAlign: 'center', animation: 'popIn 0.4s ease',
          }}>
            <div style={{ fontSize: 20, color: '#888', fontFamily: "'Rubik', sans-serif", fontWeight: 600 }}>
              {score === TOTAL ? 'מושלם! 🌟' : score >= TOTAL - 1 ? 'כמעט מושלם!' : 'סיימת!'}
            </div>
            <div style={{ fontSize: 56, fontWeight: 800, color: '#2D3436', fontFamily: "'Rubik', sans-serif" }}>{score} / {TOTAL}</div>
            <div style={{ fontSize: 22, color: '#FFB800', fontFamily: "'Rubik', sans-serif", fontWeight: 700 }}>⭐ +{totalStars}</div>
            {score === TOTAL && <div style={{ fontSize: 15, color: '#4CAF50', marginTop: 8, fontFamily: "'Rubik', sans-serif", fontWeight: 600 }}>בונוס ציון מושלם! 🎯</div>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <Button onClick={startGame} color={color} size="large" icon="🔄" glow>שחק שוב</Button>
            <Button onClick={onBack} color="#5D9CEC" size="medium" icon="🏠">חזרה הביתה</Button>
          </div>
        </div>
      </div>
    );
  }

  // PLAYING
  return (
    <div style={screenStyle}>
      <GameBackground color1={bgColors.color1} color2={bgColors.color2} color3={bgColors.color3} />
      <FloatingParticles />
      {feedback && <Feedback type={feedback} />}
      <StreakBadge streak={streak} />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <IconButton onClick={onBack} color={color}>✕</IconButton>
        <div style={{
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
          padding: '6px 16px', borderRadius: 20,
          fontSize: 14, fontWeight: 700, color: 'white', fontFamily: "'Rubik', sans-serif",
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.15)',
          border: '2px solid rgba(255,255,255,0.2)',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
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
  const { speak } = props;
  const config = useMemo(() => ({
    title: 'מצא את האות',
    icon: '🔍',
    color: '#FF6B6B',
    bgColors: { color1: '#c62828', color2: '#e53935', color3: '#FF6B6B' },
    description: 'שמע את הצליל ומצא איזו אות עושה אותו!',
    TOTAL: 5,
    generateRound: (numOpts, prevLetter) => {
      let candidates = LETTERS.filter(l => l.letter !== prevLetter);
      const t = candidates[Math.floor(Math.random() * candidates.length)];
      const distractors = pickDistractors(t, numOpts - 1);
      const opts = [t, ...distractors].sort(() => Math.random() - 0.5);
      // Get a hint word for this letter
      const hintWord = t.words[Math.floor(Math.random() * t.words.length)];
      return { target: t, options: opts, hintWord, speakText: t.sound, retryText: `נסה שוב!` };
    },
    questionText: (data) => (
      <div style={{ marginBottom: 16, textAlign: 'center', animation: 'popIn 0.3s ease' }}>
        <div style={{
          width: 85, height: 85, borderRadius: '50%', margin: '0 auto 10px',
          background: `linear-gradient(180deg, ${data.target.color}, ${data.target.color}bb)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 38, cursor: 'pointer',
          boxShadow: `0 6px 0 ${data.target.color}99, 0 8px 25px ${data.target.color}44, inset 0 2px 0 rgba(255,255,255,0.3)`,
          animation: 'pulse 2s ease infinite',
          border: '3px solid rgba(255,255,255,0.3)',
        }} onClick={() => speak(data.target.sound)}>
          🔊
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
          padding: '14px 28px', borderRadius: 20,
          boxShadow: '0 6px 0 rgba(0,0,0,0.1), 0 8px 25px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,1)',
          border: '3px solid rgba(255,255,255,0.5)',
        }}>
          <div style={{
            fontSize: 18, fontWeight: 700, color: '#2D3436',
            fontFamily: "'Rubik', sans-serif", marginBottom: 6,
          }}>
            איזו אות עושה את הצליל הזה? 🤔
          </div>
          <div style={{
            fontSize: 14, color: '#888', fontFamily: "'Rubik', sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <span>רמז:</span>
            <span style={{ fontSize: 20 }}>{data.hintWord?.emoji}</span>
            <span style={{ fontWeight: 600, color: '#555' }}>
              <span style={{ color: data.target.color, fontWeight: 800 }}>{data.hintWord?.text[0]}</span>
              {data.hintWord?.text.slice(1)}
            </span>
          </div>
        </div>
      </div>
    ),
    getOptions: (data) => data.options,
  }), [speak]);
  return <GameScreen {...props} gameConfig={config} />;
}

function MatchGameWrapper(props) {
  const config = useMemo(() => ({
    title: 'התאם לתמונה',
    icon: '🎯',
    color: '#9B59B6',
    bgColors: { color1: '#4a148c', color2: '#7b1fa2', color3: '#9B59B6' },
    description: 'ראה את התמונה ומצא את האות החסרה!',
    TOTAL: 5,
    generateRound: (numOpts, prevLetter) => {
      let candidates = LETTERS.filter(l => l.letter !== prevLetter);
      const t = candidates[Math.floor(Math.random() * candidates.length)];
      const w = t.words[Math.floor(Math.random() * t.words.length)];
      const distractors = pickDistractors(t, numOpts - 1);
      const opts = [t, ...distractors].sort(() => Math.random() - 0.5);
      // Create word with missing first letter
      const wordWithMissing = '?' + w.text.slice(1);
      return { target: t, word: w, wordWithMissing, options: opts, speakText: `${w.text}. איזו אות חסרה?`, retryText: 'נסה שוב!' };
    },
    questionText: (data) => (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
        padding: '20px 45px', borderRadius: 24,
        boxShadow: '0 8px 0 rgba(0,0,0,0.1), 0 12px 30px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,1)',
        border: '3px solid rgba(255,255,255,0.5)',
        marginBottom: 16, animation: 'popIn 0.3s ease',
      }}>
        <span style={{ fontSize: 60, animation: 'bounce 2s ease infinite', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>{data.word?.emoji}</span>
        <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8, fontFamily: "'Rubik', sans-serif", direction: 'rtl' }}>
          <span style={{
            color: '#9B59B6',
            fontSize: 34,
            background: 'linear-gradient(180deg, #9B59B6 0%, #7B1FA2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'pulse 1.5s ease infinite',
          }}>?</span>
          <span style={{ color: '#2D3436' }}>{data.word?.text.slice(1)}</span>
        </div>
        <span style={{
          fontSize: 14, color: 'white', marginTop: 8, fontFamily: "'Rubik', sans-serif",
          background: 'linear-gradient(180deg, #9B59B6 0%, #7B1FA2 100%)',
          padding: '6px 14px', borderRadius: 12,
          boxShadow: '0 2px 0 #5e2d7a',
        }}>איזו אות חסרה? 🤔</span>
      </div>
    ),
    getOptions: (data) => data.options,
  }), []);
  return <GameScreen {...props} gameConfig={config} />;
}

function SoundGameWrapper(props) {
  const { speak } = props;
  const config = useMemo(() => ({
    title: 'זהה את הצליל',
    icon: '🎵',
    color: '#FF9800',
    bgColors: { color1: '#e65100', color2: '#f57c00', color3: '#FF9800' },
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
        }} onClick={() => speak(data.target.sound)}>
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
  }), [speak]);
  return <GameScreen {...props} gameConfig={config} />;
}

// ==================== SYLLABLE GAME ====================
function SyllableGameWrapper(props) {
  const { speak } = props;
  const config = useMemo(() => ({
    title: 'משחק צירופים',
    icon: '🧩',
    color: '#3498DB',
    bgColors: { color1: '#0d47a1', color2: '#1976d2', color3: '#3498DB' },
    description: 'שמע את הצירוף ומצא אותו! בָּ, מִ, שֵׁ...',
    TOTAL: 5,
    generateRound: (numOpts, prevSyllable) => {
      let candidates = SYLLABLES.filter(s => s.syllable !== prevSyllable);
      const t = candidates[Math.floor(Math.random() * candidates.length)];
      const distractors = pickSyllableDistractors(t, numOpts - 1, 'sameLetter');
      const opts = [t, ...distractors].sort(() => Math.random() - 0.5);
      return {
        target: t,
        options: opts.map(o => ({ ...o, letter: o.syllable })), // Adapt for GameScreen
        speakText: t.sound,
        retryText: `זה ${t.syllable}, נשמע ${t.sound}. נסה שוב!`,
      };
    },
    questionText: (data) => (
      <div style={{ marginBottom: 16, textAlign: 'center', animation: 'popIn 0.3s ease' }}>
        <div style={{
          width: 90, height: 90, borderRadius: '50%', margin: '0 auto 12px',
          background: `linear-gradient(180deg, ${data.target.color}, ${data.target.color}bb)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, cursor: 'pointer',
          boxShadow: `0 6px 0 ${data.target.color}99, 0 8px 25px ${data.target.color}44, inset 0 2px 0 rgba(255,255,255,0.3)`,
          animation: 'pulse 2s ease infinite',
          border: '3px solid rgba(255,255,255,0.3)',
        }} onClick={() => speak(data.target.sound)}>
          🔊
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
          padding: '14px 28px', borderRadius: 20,
          boxShadow: '0 6px 0 rgba(0,0,0,0.1), 0 8px 25px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,1)',
          border: '3px solid rgba(255,255,255,0.5)',
        }}>
          <div style={{
            fontSize: 18, fontWeight: 700, color: '#2D3436',
            fontFamily: "'Rubik', sans-serif", marginBottom: 8,
          }}>
            איזה צירוף נשמע ככה? 🧩
          </div>
          {/* Visual breakdown: Letter + Nikud = Syllable */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 14, color: '#666', fontFamily: "'Rubik', sans-serif",
          }}>
            <span style={{
              background: `${data.target.color}20`,
              padding: '4px 10px', borderRadius: 8,
              fontWeight: 700, color: data.target.color,
            }}>{data.target.letter}</span>
            <span>+</span>
            <span style={{
              background: `${data.target.nikudColor || '#9B59B6'}20`,
              padding: '4px 10px', borderRadius: 8,
              fontWeight: 700, color: data.target.nikudColor || '#9B59B6',
            }}>{data.target.nikudName}</span>
            <span>=</span>
            <span style={{
              background: 'linear-gradient(180deg, #3498DB 0%, #1976D2 100%)',
              color: 'white',
              padding: '4px 12px', borderRadius: 8,
              fontWeight: 700, fontSize: 18,
              boxShadow: '0 2px 0 #0d47a1',
            }}>?</span>
          </div>
        </div>
      </div>
    ),
    getOptions: (data) => data.options,
    renderOption: (opt) => (
      <span style={{ fontSize: 38 }}>{opt.syllable}</span>
    ),
  }), [speak]);

  // Custom game screen for syllables (options are syllables, not letters)
  const { addStars, addGame, addStreak, resetStreak, onBack, progress } = props;
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
    const data = config.generateRound(numOptions, prevTarget.current);
    prevTarget.current = data.target.syllable;
    setRoundData(data);
    setSelected(null);
    setFeedback(null);
    safeTimeout(() => speak(data.speakText), 400);
  }, [speak, safeTimeout, config, numOptions]);

  const startGame = () => {
    playSound('click');
    setPhase('playing');
    setRound(0);
    setScore(0);
    setStreak(0);
    newRound();
  };

  useEffect(() => { if (phase === 'intro') speak(config.title); }, [phase, speak, config.title]);

  const handlePick = (opt) => {
    if (selected || !roundData) return;
    playSound('click');
    setSelected(opt.syllable);

    if (opt.syllable === roundData.target.syllable) {
      setFeedback('success');
      setScore(s => s + 1);
      setStreak(s => s + 1);
      const bonus = streak >= 4 ? 5 : streak >= 2 ? 3 : 2;
      addStars(bonus);
      addStreak();
      safeTimeout(() => {
        setFeedback(null);
        if (round + 1 < config.TOTAL) { setRound(r => r + 1); newRound(); }
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
    background: config.bgGradient,
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
          <span style={{ fontSize: 50, animation: 'popIn 0.4s ease' }}>{config.icon}</span>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif", animation: 'fadeInUp 0.4s ease 0.1s forwards', opacity: 0 }}>{config.title}</h2>
          <p style={{
            fontSize: 15, color: '#777', fontFamily: "'Rubik', sans-serif",
            textAlign: 'center', padding: '0 30px', animation: 'fadeInUp 0.4s ease 0.2s forwards', opacity: 0,
          }}>
            {config.description}
          </p>
          <div style={{ animation: 'fadeInUp 0.4s ease 0.3s forwards', opacity: 0, marginTop: 5 }}>
            <Button onClick={startGame} color={config.color} size="large" icon="▶">התחל משחק</Button>
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
              {score === config.TOTAL ? 'מושלם! 🌟' : score >= config.TOTAL - 1 ? 'כמעט מושלם!' : 'סיימת!'}
            </div>
            <div style={{ fontSize: 50, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif" }}>{score} / {config.TOTAL}</div>
            <div style={{ fontSize: 20, color: '#FFB800', fontFamily: "'Rubik', sans-serif" }}>⭐ +{totalStars}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <Button onClick={startGame} color={config.color} size="large" icon="🔄">שחק שוב</Button>
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
          שאלה {round + 1} מתוך {config.TOTAL}
        </div>
        <IconButton onClick={() => roundData && speak(roundData.speakText)} color="#2196F3">🔊</IconButton>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        <ProgressBar current={round + 1} total={config.TOTAL} color={config.color} />
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '8px 20px', position: 'relative', zIndex: 1,
      }}>
        {roundData && config.questionText(roundData)}

        <div style={{
          display: 'grid',
          gridTemplateColumns: numOptions <= 2 ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
          gap: 12, width: '100%', maxWidth: 280,
        }}>
          {roundData && roundData.options.map((opt, i) => {
            const isSelected = selected === opt.syllable;
            const isCorrect = opt.syllable === roundData.target.syllable;
            let bg = 'white';
            if (isSelected) bg = isCorrect ? '#C8E6C9' : '#FFCDD2';
            return (
              <div
                key={i}
                onClick={() => handlePick(opt)}
                style={{
                  aspectRatio: numOptions <= 2 ? '1.2' : '1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: numOptions <= 2 ? 50 : 40, fontWeight: 700, color: opt.color,
                  background: isSelected ? bg : 'linear-gradient(145deg, white, #fafafa)',
                  borderRadius: 22,
                  border: `3px solid ${isSelected ? (isCorrect ? '#4CAF50' : '#F44336') : opt.color + '66'}`,
                  boxShadow: isSelected
                    ? (isCorrect ? '0 0 25px rgba(76,175,80,0.35)' : '0 0 25px rgba(244,67,54,0.35)')
                    : `0 6px 20px ${opt.color}18`,
                  cursor: selected ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: "'Rubik', sans-serif",
                  animation: `fadeInUp 0.3s ease ${i * 0.05}s forwards`, opacity: 0,
                }}
              >
                {opt.syllable}
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

// ==================== LEARN HUB SCREEN ====================
function LearnHubScreen({ onSelect, speak, progress, onBack }) {
  const playSound = useSound();

  useEffect(() => { speak('בחר מה ללמוד!'); }, [speak]);

  const options = [
    { id: 'letters', icon: '📖', label: 'אותיות', desc: 'למד את 22 האותיות', color: '#4ECDC4', bgColor: '#26a69a', progress: `${progress.learned.length}/${LETTERS.length}` },
    { id: 'nikud', icon: '🔤', label: 'ניקוד', desc: 'למד את התנועות', color: '#9B59B6', bgColor: '#7B1FA2', progress: '' },
    { id: 'syllables', icon: '🧩', label: 'צירופים', desc: 'אותיות + ניקוד', color: '#E67E22', bgColor: '#E65100', progress: '' },
  ];

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
      display: 'flex', flexDirection: 'column', zIndex: 1,
    }}>
      {/* Game-like gradient background */}
      <GameBackground color1="#1a5276" color2="#2980b9" color3="#48b8a0" />
      <FloatingParticles />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <IconButton onClick={onBack} color="#5D9CEC">✕</IconButton>
        <div style={{
          fontSize: 22, fontWeight: 800, fontFamily: "'Rubik', sans-serif", color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}>מרכז הלימוד</div>
        <div style={{ width: 50 }} />
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '20px', position: 'relative', zIndex: 1, gap: 16,
      }}>
        <img src={ASSETS.images.mascotHappy} alt="" style={{
          width: 110, height: 110, objectFit: 'contain', animation: 'float 3s ease infinite',
          filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.3))',
        }} />
        <div style={{
          fontSize: 26, fontWeight: 800, color: 'white', fontFamily: "'Rubik', sans-serif",
          marginBottom: 10, textAlign: 'center',
          textShadow: '0 3px 6px rgba(0,0,0,0.3)',
        }}>
          מה תרצה ללמוד היום? 📚
        </div>

        {options.map((opt, i) => (
          <div
            key={opt.id}
            onClick={() => { playSound('click'); speak(opt.label); setTimeout(() => onSelect(opt.id), 300); }}
            style={{
              width: '100%', maxWidth: 340, display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px 20px',
              background: `linear-gradient(180deg, ${opt.color} 0%, ${opt.bgColor} 100%)`,
              borderRadius: 20,
              border: '3px solid rgba(255,255,255,0.3)',
              boxShadow: `
                0 6px 0 ${opt.bgColor}99,
                0 8px 20px rgba(0,0,0,0.25),
                inset 0 2px 0 rgba(255,255,255,0.3)
              `,
              cursor: 'pointer',
              transition: 'transform 0.1s, box-shadow 0.1s',
              animation: `fadeInUp 0.4s ease forwards`,
              animationDelay: `${i * 0.1}s`, opacity: 0,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Shine effect */}
            <div style={{
              position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
              animation: 'shimmer 3s ease infinite',
              animationDelay: `${i * 0.4}s`,
            }} />
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(5px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30, flexShrink: 0,
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.1)',
              border: '2px solid rgba(255,255,255,0.2)',
            }}>
              {opt.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 20, fontWeight: 700, color: 'white', fontFamily: "'Rubik', sans-serif",
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}>{opt.label}</div>
              <div style={{
                fontSize: 13, color: 'rgba(255,255,255,0.85)', fontFamily: "'Rubik', sans-serif", marginTop: 2,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}>{opt.desc}</div>
            </div>
            {opt.progress && (
              <div style={{
                background: 'rgba(255,255,255,0.25)',
                color: 'white', padding: '5px 12px',
                borderRadius: 12, fontSize: 13, fontWeight: 700, fontFamily: "'Rubik', sans-serif",
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}>
                {opt.progress}
              </div>
            )}
            <span style={{
              fontSize: 20, color: 'rgba(255,255,255,0.6)',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}>❮</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsScreen({ progress, speak, onBack }) {
  useEffect(() => { speak(`יש לך ${progress.stars} כוכבים! רמה ${progress.level}!`); }, [speak, progress.stars, progress.level]);

  const milestones = [
    { stars: 10, label: 'כוכב עולה', icon: '⭐', color: '#FFD700', bgColor: '#FFA000', unlocked: progress.stars >= 10 },
    { stars: 30, label: 'חוקר אותיות', icon: '🔤', color: '#4ECDC4', bgColor: '#26a69a', unlocked: progress.stars >= 30 },
    { stars: 50, label: 'גיבור הקריאה', icon: '🦸', color: '#9B59B6', bgColor: '#7B1FA2', unlocked: progress.stars >= 50 },
    { stars: 100, label: 'אלוף הא-ב', icon: '🏆', color: '#FF6B6B', bgColor: '#e53935', unlocked: progress.stars >= 100 },
  ];

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
      display: 'flex', flexDirection: 'column', zIndex: 1, overflow: 'auto',
    }}>
      {/* Game-like gradient background */}
      <GameBackground color1="#1a237e" color2="#303f9f" color3="#7c4dff" />
      <FloatingParticles />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <IconButton onClick={onBack} color="#5D9CEC">✕</IconButton>
        <div style={{
          fontSize: 22, fontWeight: 800, fontFamily: "'Rubik', sans-serif", color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}>ההישגים שלי 🏆</div>
        <div style={{ width: 50 }} />
      </div>

      <div style={{
        position: 'relative', zIndex: 1, padding: '8px 20px 30px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        width: '100%', maxWidth: 420, margin: '0 auto',
      }}>
        <img src={ASSETS.images.mascotCelebrate} alt="" style={{
          width: 100, height: 100, objectFit: 'contain', animation: 'float 3s ease infinite',
          filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.3))',
        }} />
        <LevelBadge level={progress.level} />

        {/* Stars - Game style card */}
        <div style={{
          width: '100%',
          background: 'linear-gradient(180deg, #FFD700 0%, #FFA000 100%)',
          borderRadius: 20, padding: 20, textAlign: 'center', color: 'white',
          boxShadow: `
            0 6px 0 #E69100,
            0 10px 30px rgba(255,160,0,0.4),
            inset 0 2px 0 rgba(255,255,255,0.4)
          `,
          border: '3px solid rgba(255,255,255,0.3)',
          animation: 'popIn 0.4s ease',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'shimmer 3s ease infinite',
          }} />
          <div style={{
            fontSize: 48, fontWeight: 800, fontFamily: "'Rubik', sans-serif",
            textShadow: '0 3px 6px rgba(0,0,0,0.3)',
          }}>⭐ {progress.stars}</div>
          <div style={{
            fontSize: 16, fontFamily: "'Rubik', sans-serif",
            opacity: 0.95, textShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}>כוכבים</div>
        </div>

        {/* Milestones - Game style card */}
        <div style={{
          width: '100%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: 20, padding: 18,
          boxShadow: '0 6px 0 rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,1)',
          border: '3px solid rgba(255,255,255,0.5)',
        }}>
          <div style={{
            fontWeight: 800, marginBottom: 12, fontSize: 16, fontFamily: "'Rubik', sans-serif", color: '#2D3436',
          }}>
            תגים 🎖️
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {milestones.map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', borderRadius: 14,
                background: m.unlocked
                  ? `linear-gradient(180deg, ${m.color} 0%, ${m.bgColor} 100%)`
                  : 'linear-gradient(180deg, #e0e0e0 0%, #bdbdbd 100%)',
                opacity: m.unlocked ? 1 : 0.5,
                fontSize: 13, fontFamily: "'Rubik', sans-serif",
                boxShadow: m.unlocked
                  ? `0 3px 0 ${m.bgColor}99, 0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)`
                  : '0 2px 0 #9e9e9e, inset 0 1px 0 rgba(255,255,255,0.3)',
                border: '2px solid rgba(255,255,255,0.3)',
                animation: m.unlocked ? 'pulse 2s ease infinite' : 'none',
              }}>
                <span style={{ fontSize: 20, filter: m.unlocked ? 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' : 'none' }}>{m.icon}</span>
                <span style={{
                  fontWeight: 700, color: 'white',
                  textShadow: m.unlocked ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Letters - Game style card */}
        <div style={{
          width: '100%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: 20, padding: 18,
          boxShadow: '0 6px 0 rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,1)',
          border: '3px solid rgba(255,255,255,0.5)',
        }}>
          <div style={{
            fontWeight: 800, marginBottom: 12, fontSize: 16, fontFamily: "'Rubik', sans-serif", color: '#2D3436',
          }}>
            אותיות שלמדתי ({progress.learned.length} / {LETTERS.length}) 📚
          </div>
          <ProgressBar current={progress.learned.length} total={LETTERS.length} color="#4ECDC4" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 14 }}>
            {LETTERS.map((l, i) => {
              const learned = progress.learned.includes(l.letter);
              return (
                <span key={i} style={{
                  width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, borderRadius: 10,
                  background: learned
                    ? `linear-gradient(180deg, ${l.color} 0%, ${l.color}cc 100%)`
                    : 'linear-gradient(180deg, #e0e0e0 0%, #bdbdbd 100%)',
                  color: 'white',
                  boxShadow: learned
                    ? `0 3px 0 ${l.color}88, 0 4px 10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)`
                    : '0 2px 0 #9e9e9e',
                  border: '2px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.3s', fontFamily: "'Rubik', sans-serif",
                  textShadow: learned ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                }}>{l.letter}</span>
              );
            })}
          </div>
        </div>

        {/* Stats - Game style card */}
        <div style={{
          width: '100%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: 20, padding: 18,
          boxShadow: '0 6px 0 rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,1)',
          border: '3px solid rgba(255,255,255,0.5)',
        }}>
          <div style={{
            fontWeight: 800, marginBottom: 12, fontSize: 16, fontFamily: "'Rubik', sans-serif", color: '#2D3436',
          }}>סטטיסטיקות 📊</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { icon: '🎮', label: 'משחקים', val: progress.games, color: '#3498DB', bgColor: '#1976D2' },
              { icon: '🔥', label: 'שיא רצף', val: progress.bestStreak, color: '#FF6B6B', bgColor: '#e53935' },
              { icon: '📊', label: 'רמה', val: progress.level, color: '#9B59B6', bgColor: '#7B1FA2' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: `linear-gradient(180deg, ${s.color} 0%, ${s.bgColor} 100%)`,
                padding: '10px 8px', borderRadius: 14,
                boxShadow: `0 3px 0 ${s.bgColor}99, 0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)`,
                border: '2px solid rgba(255,255,255,0.3)',
              }}>
                <span style={{ fontSize: 22, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>{s.icon}</span>
                <span style={{
                  fontSize: 20, fontWeight: 800, color: 'white', fontFamily: "'Rubik', sans-serif",
                  textShadow: '0 2px 3px rgba(0,0,0,0.3)',
                }}>{s.val}</span>
                <span style={{
                  fontSize: 10, color: 'rgba(255,255,255,0.9)', fontFamily: "'Rubik', sans-serif",
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}>{s.label}</span>
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

  const handleNav = (target) => setView(target === 'learn' ? 'learnHub' : target === 'achievements' ? 'achievements' : 'home');
  const handleActivity = (id) => setView(id);
  const handleBack = () => setView('home');
  const handleLearnSelect = (id) => setView(id === 'letters' ? 'learn' : id);

  const gameProps = { speak, addStars, addGame, addStreak, resetStreak, onBack: handleBack, progress: data };

  const renderScreen = () => {
    switch (view) {
      case 'learnHub':
        return <LearnHubScreen onSelect={handleLearnSelect} speak={speak} progress={data} onBack={handleBack} />;
      case 'learn':
        return <LearnScreen speak={speak} progress={data} addLetter={addLetter} addStars={addStars} onBack={() => setView('learnHub')} />;
      case 'nikud':
        return <NikudLearnScreen speak={speak} progress={data} addStars={addStars} onBack={() => setView('learnHub')} />;
      case 'syllables':
        return <SyllablesLearnScreen speak={speak} progress={data} addStars={addStars} onBack={() => setView('learnHub')} />;
      case 'find':
        return <FindGameWrapper {...gameProps} />;
      case 'match':
        return <MatchGameWrapper {...gameProps} />;
      case 'sound':
        return <SoundGameWrapper {...gameProps} />;
      case 'syllableGame':
        return <SyllableGameWrapper {...gameProps} />;
      case 'achievements':
        return <AchievementsScreen progress={data} speak={speak} onBack={handleBack} />;
      default:
        return <HomeScreen onActivity={handleActivity} speak={speak} progress={data} />;
    }
  };

  // Highlight correct nav item based on current view
  const currentNav = view === 'achievements' ? 'achievements'
    : ['learn', 'learnHub', 'nikud', 'syllables'].includes(view) ? 'learn'
    : 'home';

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
