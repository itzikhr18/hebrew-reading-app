import React, { useState, useEffect, useCallback, useRef } from 'react';

/*
 * אפליקציית לימוד קריאה לילדים - גרסה 8.0
 * עיצוב מחדש מלא - כפתורי CSS, ניווט ברור, UI ילדותי ונקי
 */

// ==================== ASSETS PATHS ====================
const ASSETS = {
  images: {
    mascotHappy: './assets/images/mascot_happy.png',
    mascotCelebrate: './assets/images/mascot_celebrate.png',
    mascotThinking: './assets/images/mascot_thinking.png',
    mascotEncourage: './assets/images/mascot_encourage.png',
    bgHome: './assets/images/bg_home.png',
    bgLearn: './assets/images/bg_learn.png',
    bgGame: './assets/images/bg_game.png',
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
  ]},
  { letter: 'ב', name: 'בֵּית', sound: 'בּ', color: '#4ECDC4', words: [
    { text: 'בית', emoji: '🏠' }, { text: 'בננה', emoji: '🍌' }, { text: 'בלון', emoji: '🎈' },
  ]},
  { letter: 'ג', name: 'גִימֶל', sound: 'גּ', color: '#FF69B4', words: [
    { text: 'גמל', emoji: '🐪' }, { text: 'גלידה', emoji: '🍦' }, { text: 'גזר', emoji: '🥕' },
  ]},
  { letter: 'ד', name: 'דָלֶת', sound: 'דּ', color: '#F39C12', words: [
    { text: 'דג', emoji: '🐟' }, { text: 'דבש', emoji: '🍯' }, { text: 'דלת', emoji: '🚪' },
  ]},
  { letter: 'ה', name: 'הֵא', sound: 'ה', color: '#1ABC9C', words: [
    { text: 'הר', emoji: '⛰️' }, { text: 'היפופוטם', emoji: '🦛' },
  ]},
  { letter: 'ו', name: 'וָו', sound: 'ו', color: '#9B59B6', words: [
    { text: 'ורד', emoji: '🌹' }, { text: 'וילון', emoji: '🪟' },
  ]},
  { letter: 'ז', name: 'זַיִן', sound: 'ז', color: '#3498DB', words: [
    { text: 'זברה', emoji: '🦓' }, { text: 'זית', emoji: '🫒' },
  ]},
  { letter: 'ח', name: 'חֵית', sound: 'ח', color: '#E74C3C', words: [
    { text: 'חתול', emoji: '🐱' }, { text: 'חלב', emoji: '🥛' }, { text: 'חמור', emoji: '🫏' },
  ]},
  { letter: 'ט', name: 'טֵית', sound: 'ט', color: '#2ECC71', words: [
    { text: 'טלפון', emoji: '📱' }, { text: 'טיל', emoji: '🚀' },
  ]},
  { letter: 'י', name: 'יוֹד', sound: 'י', color: '#E67E22', words: [
    { text: 'יד', emoji: '✋' }, { text: 'ילד', emoji: '👦' }, { text: 'ירח', emoji: '🌙' },
  ]},
  { letter: 'כ', name: 'כָּף', sound: 'כּ', color: '#8E44AD', words: [
    { text: 'כלב', emoji: '🐕' }, { text: 'כוכב', emoji: '⭐' }, { text: 'כדור', emoji: '⚽' },
  ]},
  { letter: 'ל', name: 'לָמֶד', sound: 'ל', color: '#16A085', words: [
    { text: 'לב', emoji: '❤️' }, { text: 'לחם', emoji: '🍞' }, { text: 'לימון', emoji: '🍋' },
  ]},
  { letter: 'מ', name: 'מֵם', sound: 'מ', color: '#D35400', words: [
    { text: 'מים', emoji: '💧' }, { text: 'מלך', emoji: '👑' }, { text: 'מטוס', emoji: '✈️' },
  ]},
  { letter: 'נ', name: 'נוּן', sound: 'נ', color: '#27AE60', words: [
    { text: 'נר', emoji: '🕯️' }, { text: 'נמר', emoji: '🐆' }, { text: 'נחש', emoji: '🐍' },
  ]},
  { letter: 'ס', name: 'סָמֶך', sound: 'ס', color: '#9370DB', words: [
    { text: 'סוס', emoji: '🐴' }, { text: 'סירה', emoji: '⛵' },
  ]},
  { letter: 'ע', name: 'עַיִן', sound: 'ע', color: '#228B22', words: [
    { text: 'עץ', emoji: '🌳' }, { text: 'עוגה', emoji: '🎂' }, { text: 'ענן', emoji: '☁️' },
  ]},
  { letter: 'פ', name: 'פֵּא', sound: 'פּ', color: '#4169E1', words: [
    { text: 'פיל', emoji: '🐘' }, { text: 'פרח', emoji: '🌸' }, { text: 'פרפר', emoji: '🦋' },
  ]},
  { letter: 'צ', name: 'צָדִי', sound: 'צ', color: '#6B8E23', words: [
    { text: 'צב', emoji: '🐢' }, { text: 'ציפור', emoji: '🐦' }, { text: 'צפרדע', emoji: '🐸' },
  ]},
  { letter: 'ק', name: 'קוֹף', sound: 'ק', color: '#8B4513', words: [
    { text: 'קוף', emoji: '🐵' }, { text: 'קשת', emoji: '🌈' }, { text: 'קיפוד', emoji: '🦔' },
  ]},
  { letter: 'ר', name: 'רֵישׁ', sound: 'ר', color: '#DC143C', words: [
    { text: 'רכבת', emoji: '🚂' }, { text: 'רגל', emoji: '🦶' }, { text: 'רובוט', emoji: '🤖' },
  ]},
  { letter: 'ש', name: 'שִׁין', sound: 'שׁ', color: '#FFD700', words: [
    { text: 'שמש', emoji: '☀️' }, { text: 'שועל', emoji: '🦊' }, { text: 'שעון', emoji: '⏰' },
  ]},
  { letter: 'ת', name: 'תָּו', sound: 'תּ', color: '#FF4500', words: [
    { text: 'תפוח', emoji: '🍎' }, { text: 'תות', emoji: '🍓' }, { text: 'תרנגול', emoji: '🐓' },
  ]},
];

// ==================== HOOKS ====================
function useSpeech() {
  const synth = useRef(null);
  useEffect(() => {
    synth.current = window.speechSynthesis;
    return () => { if (synth.current) synth.current.cancel(); };
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
      audio.play().catch((e) => console.warn('Audio failed:', type, e.message));
    } catch (e) { console.warn('Audio error:', type, e.message); }
  }, []);
  return play;
}

function useProgress() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('hebrew_app_v8');
      return saved ? JSON.parse(saved) : { learned: [], stars: 0, games: 0 };
    } catch { return { learned: [], stars: 0, games: 0 }; }
  });

  useEffect(() => {
    try { localStorage.setItem('hebrew_app_v8', JSON.stringify(data)); } catch {}
  }, [data]);

  const addLetter = useCallback((letter) => {
    setData(d => ({ ...d, learned: d.learned.includes(letter) ? d.learned : [...d.learned, letter] }));
  }, []);
  const addStars = useCallback((n) => setData(d => ({ ...d, stars: d.stars + n })), []);
  const addGame = useCallback(() => setData(d => ({ ...d, games: d.games + 1 })), []);

  return { data, addLetter, addStars, addGame };
}

// ==================== UI COMPONENTS ====================

function Button({ children, onClick, color = '#4ECDC4', size = 'medium', icon, disabled, style }) {
  const sizes = {
    small: { padding: '8px 16px', fontSize: 14, borderRadius: 12 },
    medium: { padding: '12px 24px', fontSize: 18, borderRadius: 16 },
    large: { padding: '16px 36px', fontSize: 22, borderRadius: 20 },
  };
  const s = sizes[size] || sizes.medium;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...s,
        border: 'none',
        background: `linear-gradient(180deg, ${color}, ${color}dd)`,
        color: 'white',
        fontFamily: "'Rubik', sans-serif",
        fontWeight: 700,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        boxShadow: `0 4px 15px ${color}44`,
        transition: 'transform 0.15s, box-shadow 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon && <span style={{ fontSize: s.fontSize + 4 }}>{icon}</span>}
      {children}
    </button>
  );
}

function IconButton({ children, onClick, color = '#aaa', style }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 44, height: 44,
        borderRadius: '50%',
        border: 'none',
        background: color,
        color: 'white',
        fontSize: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'transform 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function NavBar({ current, onNavigate, stars }) {
  const items = [
    { id: 'achievements', label: 'הישגים', icon: '⭐' },
    { id: 'learn', label: 'לימוד', icon: '📖' },
    { id: 'home', label: 'בית', icon: '🏠' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 70,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      background: 'white', borderRadius: '20px 20px 0 0',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', zIndex: 100,
    }}>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '6px 16px', borderRadius: 12,
            backgroundColor: current === item.id ? '#FFF3E0' : 'transparent',
            transition: 'background-color 0.2s',
          }}
        >
          <span style={{ fontSize: 24, position: 'relative' }}>
            {item.icon}
            {item.id === 'achievements' && stars > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -10,
                background: '#FF4081', color: 'white', fontSize: 10, fontWeight: 700,
                minWidth: 18, height: 18, borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{stars > 99 ? '99+' : stars}</span>
            )}
          </span>
          <span style={{
            fontSize: 12, fontWeight: current === item.id ? 700 : 500,
            color: current === item.id ? '#FF6B00' : '#888',
            fontFamily: "'Rubik', sans-serif",
          }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function Feedback({ type }) {
  const playSound = useSound();
  useEffect(() => {
    playSound(type === 'success' ? 'success' : 'wrong');
  }, [playSound, type]);

  const isSuccess = type === 'success';
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, background: 'rgba(0,0,0,0.4)',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '30px 40px', borderRadius: 28, background: 'white',
        boxShadow: '0 10px 50px rgba(0,0,0,0.3)', animation: 'popIn 0.3s ease',
      }}>
        <img
          src={isSuccess ? ASSETS.images.mascotCelebrate : ASSETS.images.mascotEncourage}
          alt="" style={{ width: 120, height: 120, objectFit: 'contain' }}
        />
        <div style={{
          fontSize: 26, fontWeight: 700, marginTop: 10,
          color: isSuccess ? '#4CAF50' : '#FF9800',
        }}>
          {isSuccess ? 'כל הכבוד! 🎉' : 'ננסה שוב! 💪'}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div style={{
      width: '100%', maxWidth: 280, height: 10, borderRadius: 5,
      background: 'rgba(255,255,255,0.5)', overflow: 'hidden',
    }}>
      <div style={{
        width: `${(current / total) * 100}%`, height: '100%', borderRadius: 5,
        background: 'linear-gradient(90deg, #FFD93D, #FF6B00)',
        transition: 'width 0.5s ease',
      }} />
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
    { id: 'learn', icon: '📖', label: 'לימוד אותיות', desc: 'למד את האותיות עם מילים ותמונות', color: '#4ECDC4' },
    { id: 'find', icon: '🔍', label: 'מצא את האות', desc: 'שמע את שם האות ומצא אותה', color: '#FF6B6B' },
    { id: 'match', icon: '🎯', label: 'התאם לתמונה', desc: 'ראה תמונה ובחר את האות הנכונה', color: '#9B59B6' },
  ];

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      overflow: 'auto', zIndex: 1,
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        background: 'linear-gradient(180deg, #FFF8E7 0%, #FFE8EC 50%, #E8F4FD 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, padding: '20px 20px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Mascot & Title */}
        <img src={ASSETS.images.mascotHappy} alt="ינשוף" style={{ width: 110, height: 110, objectFit: 'contain', marginBottom: 5 }} />
        <h1 style={{
          fontSize: 34, fontWeight: 700, color: '#2D3436', textAlign: 'center',
          fontFamily: "'Rubik', sans-serif", margin: '0 0 5px',
          textShadow: '0 2px 4px rgba(0,0,0,0.08)',
        }}>לומדים לקרוא!</h1>
        <p style={{ fontSize: 16, color: '#777', marginBottom: 20, fontFamily: "'Rubik', sans-serif" }}>בחר פעילות להתחיל</p>

        {/* Activity Cards */}
        {activities.map(act => (
          <div
            key={act.id}
            onClick={() => {
              playSound('click');
              speak(act.label);
              if (timerRef.current) clearTimeout(timerRef.current);
              timerRef.current = setTimeout(() => onActivity(act.id), 400);
            }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 15,
              padding: '16px 20px', marginBottom: 12,
              background: 'white', borderRadius: 20,
              border: `3px solid ${act.color}33`,
              boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
              cursor: 'pointer', transition: 'transform 0.2s',
            }}
          >
            <div style={{
              width: 55, height: 55, borderRadius: 16,
              background: `${act.color}22`, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0,
            }}>
              {act.icon}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif" }}>{act.label}</div>
              <div style={{ fontSize: 13, color: '#999', fontFamily: "'Rubik', sans-serif", marginTop: 2 }}>{act.desc}</div>
            </div>
          </div>
        ))}

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginTop: 10, width: '100%' }}>
          {[
            { icon: '⭐', val: progress.stars, label: 'כוכבים' },
            { icon: '🔤', val: progress.learned.length, label: 'אותיות' },
            { icon: '🎮', val: progress.games, label: 'משחקים' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'white', padding: '12px 8px', borderRadius: 16,
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif" }}>{s.val}</span>
              <span style={{ fontSize: 11, color: '#999', fontFamily: "'Rubik', sans-serif" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LearnScreen({ speak, progress, addLetter, addStars, onBack }) {
  const [idx, setIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
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
    if (wordIdx > 0) setWordIdx(w => w - 1);
    else if (idx > 0) { setIdx(i => i - 1); setWordIdx(0); }
  };

  const handleLearned = () => {
    playSound('click');
    addLetter(letter.letter);
    addStars(1);
    setShowFeedback(true);
    setTimeout(() => { setShowFeedback(false); goNext(); }, 1500);
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
      display: 'flex', flexDirection: 'column', zIndex: 1,
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        background: 'linear-gradient(180deg, #E8F8F5 0%, #FFF8E7 100%)',
      }} />

      {showFeedback && <Feedback type="success" />}

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <IconButton onClick={onBack} color="#ccc">✕</IconButton>
        <div style={{
          background: 'white', padding: '6px 16px', borderRadius: 20,
          fontSize: 15, fontWeight: 600, color: '#555', fontFamily: "'Rubik', sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          אות {idx + 1} מתוך {LETTERS.length}
        </div>
        <IconButton onClick={speakNow} color="#2196F3">🔊</IconButton>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        <ProgressBar current={idx + 1} total={LETTERS.length} />
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '10px 20px', position: 'relative', zIndex: 1,
        minHeight: 0,
      }}>
        {/* Letter Circle */}
        <div style={{
          width: 160, height: 160, borderRadius: '50%',
          background: 'white', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 30px ${letter.color}33`,
          border: `4px solid ${letter.color}`,
          marginBottom: 15,
        }}>
          <span style={{ fontSize: 80, fontWeight: 700, color: letter.color, lineHeight: 1 }}>{letter.letter}</span>
          <span style={{ fontSize: 15, color: '#777', fontFamily: "'Rubik', sans-serif", marginTop: 2 }}>{letter.name}</span>
        </div>

        {/* Word & Emoji */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'white', padding: '15px 30px', borderRadius: 20,
          boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
        }}>
          <span style={{ fontSize: 55 }}>{word.emoji}</span>
          <span style={{
            fontSize: 28, fontWeight: 700, color: '#2D3436', marginTop: 8,
            fontFamily: "'Rubik', sans-serif",
          }}>{word.text}</span>
          <span style={{ fontSize: 14, color: '#aaa', marginTop: 4, fontFamily: "'Rubik', sans-serif" }}>
            מתחיל באות {letter.name}
          </span>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {letter.words.map((_, i) => (
            <span key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: i === wordIdx ? letter.color : '#ddd',
              transition: 'all 0.3s',
              transform: i === wordIdx ? 'scale(1.3)' : 'scale(1)',
            }} />
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 12, padding: '12px 20px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <Button onClick={goPrev} color="#BDBDBD" size="small" icon="→">הקודם</Button>
        <Button onClick={handleLearned} color="#4CAF50" size="large" icon="✓">למדתי!</Button>
        <Button onClick={goNext} color="#BDBDBD" size="small" icon="←">הבא</Button>
      </div>
    </div>
  );
}

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
    return () => { mountedRef.current = false; timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  }, []);

  const safeTimeout = useCallback((fn, delay) => {
    const id = setTimeout(() => { if (mountedRef.current) fn(); }, delay);
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

  const startGame = () => { playSound('click'); setPhase('playing'); setRound(0); setScore(0); newRound(); };

  useEffect(() => { if (phase === 'intro') speak('מצא את האות!'); }, [phase, speak]);

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
        if (round + 1 < TOTAL) { setRound(r => r + 1); newRound(); }
        else { addGame(); setPhase('done'); speak('מעולה! סיימת!'); }
      }, 1500);
    } else {
      setFeedback('wrong');
      safeTimeout(() => { setSelected(null); setFeedback(null); speak(`נסה שוב! איפה ${target.name}?`); }, 1500);
    }
  };

  const screenStyle = {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
    display: 'flex', flexDirection: 'column', zIndex: 1,
  };
  const bgStyle = {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
    background: 'linear-gradient(180deg, #FDE8EF 0%, #FFF8E7 100%)',
  };

  if (phase === 'intro') {
    return (
      <div style={screenStyle}>
        <div style={bgStyle} />
        <div style={{ display: 'flex', padding: '12px 16px', position: 'relative', zIndex: 1 }}>
          <IconButton onClick={onBack} color="#ccc">✕</IconButton>
        </div>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 16, position: 'relative', zIndex: 1,
        }}>
          <img src={ASSETS.images.mascotHappy} alt="" style={{ width: 130, height: 130, objectFit: 'contain' }} />
          <span style={{ fontSize: 50 }}>🔍</span>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif" }}>מצא את האות</h2>
          <p style={{ fontSize: 16, color: '#777', fontFamily: "'Rubik', sans-serif", textAlign: 'center', padding: '0 30px' }}>
            שמע את שם האות ומצא אותה מבין 4 אותיות!
          </p>
          <Button onClick={startGame} color="#FF6B6B" size="large" icon="▶">התחל משחק</Button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div style={screenStyle}>
        <div style={bgStyle} />
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 16, position: 'relative', zIndex: 1,
        }}>
          <img src={ASSETS.images.mascotCelebrate} alt="" style={{ width: 130, height: 130, objectFit: 'contain' }} />
          <div style={{
            background: 'white', padding: '25px 40px', borderRadius: 24,
            boxShadow: '0 6px 25px rgba(0,0,0,0.1)', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, color: '#666', fontFamily: "'Rubik', sans-serif" }}>סיימת!</div>
            <div style={{ fontSize: 50, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif" }}>{score} / {TOTAL}</div>
            <div style={{ fontSize: 20, color: '#FFB800', fontFamily: "'Rubik', sans-serif" }}>+{score * 2} ⭐</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            <Button onClick={startGame} color="#FF6B6B" size="large" icon="🔄">שחק שוב</Button>
            <Button onClick={onBack} color="#BDBDBD" size="medium" icon="🏠">חזרה הביתה</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={screenStyle}>
      <div style={bgStyle} />
      {feedback && <Feedback type={feedback} />}

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <IconButton onClick={onBack} color="#ccc">✕</IconButton>
        <div style={{
          background: 'white', padding: '6px 16px', borderRadius: 20,
          fontSize: 15, fontWeight: 600, color: '#555', fontFamily: "'Rubik', sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          שאלה {round + 1} מתוך {TOTAL}
        </div>
        <IconButton onClick={() => speak(`איפה האות ${target?.name}?`)} color="#2196F3">🔊</IconButton>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        <ProgressBar current={round + 1} total={TOTAL} />
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '10px 20px', position: 'relative', zIndex: 1,
      }}>
        <img src={ASSETS.images.mascotThinking} alt="" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 10 }} />
        <div style={{
          fontSize: 22, fontWeight: 700, color: '#2D3436', marginBottom: 20,
          background: 'white', padding: '10px 24px', borderRadius: 16,
          fontFamily: "'Rubik', sans-serif",
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        }}>
          איפה האות {target?.name}? 🤔
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, width: '100%', maxWidth: 280 }}>
          {options.map((opt, i) => {
            const isSelected = selected === opt.letter;
            const isCorrect = opt.letter === target?.letter;
            let bg = 'white';
            if (isSelected) bg = isCorrect ? '#C8E6C9' : '#FFCDD2';
            return (
              <div
                key={i}
                onClick={() => handlePick(opt)}
                style={{
                  aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 52, fontWeight: 700, color: opt.color,
                  background: bg, borderRadius: 20,
                  border: `3px solid ${opt.color}`,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  cursor: selected ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: "'Rubik', sans-serif",
                }}
              >
                {opt.letter}
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 16, background: 'white', padding: '8px 20px', borderRadius: 16,
          fontSize: 18, fontWeight: 700, color: '#FFB800', fontFamily: "'Rubik', sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          ⭐ {score * 2} כוכבים
        </div>
      </div>
    </div>
  );
}

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
    return () => { mountedRef.current = false; timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  }, []);

  const safeTimeout = useCallback((fn, delay) => {
    const id = setTimeout(() => { if (mountedRef.current) fn(); }, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  const newRound = useCallback(() => {
    const shuffled = [...LETTERS].sort(() => Math.random() - 0.5);
    const t = shuffled[0];
    const w = t.words[Math.floor(Math.random() * t.words.length)];
    const opts = [t, ...shuffled.slice(1, 4)].sort(() => Math.random() - 0.5);
    setTarget(t); setWord(w); setOptions(opts); setSelected(null); setFeedback(null);
    safeTimeout(() => speak(`${w.text}. באיזו אות מתחיל?`), 400);
  }, [speak, safeTimeout]);

  const startGame = () => { playSound('click'); setPhase('playing'); setRound(0); setScore(0); newRound(); };

  useEffect(() => { if (phase === 'intro') speak('התאם את האות לתמונה!'); }, [phase, speak]);

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
        if (round + 1 < TOTAL) { setRound(r => r + 1); newRound(); }
        else { addGame(); setPhase('done'); speak('מעולה! סיימת!'); }
      }, 1500);
    } else {
      setFeedback('wrong');
      safeTimeout(() => { setSelected(null); setFeedback(null); speak('נסה שוב!'); }, 1500);
    }
  };

  const screenStyle = {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
    display: 'flex', flexDirection: 'column', zIndex: 1,
  };
  const bgStyle = {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
    background: 'linear-gradient(180deg, #EDE7F6 0%, #FFF8E7 100%)',
  };

  if (phase === 'intro') {
    return (
      <div style={screenStyle}>
        <div style={bgStyle} />
        <div style={{ display: 'flex', padding: '12px 16px', position: 'relative', zIndex: 1 }}>
          <IconButton onClick={onBack} color="#ccc">✕</IconButton>
        </div>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 16, position: 'relative', zIndex: 1,
        }}>
          <img src={ASSETS.images.mascotHappy} alt="" style={{ width: 130, height: 130, objectFit: 'contain' }} />
          <span style={{ fontSize: 50 }}>🎯</span>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif" }}>התאם לתמונה</h2>
          <p style={{ fontSize: 16, color: '#777', fontFamily: "'Rubik', sans-serif", textAlign: 'center', padding: '0 30px' }}>
            ראה את התמונה ובחר באיזו אות המילה מתחילה!
          </p>
          <Button onClick={startGame} color="#9B59B6" size="large" icon="▶">התחל משחק</Button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div style={screenStyle}>
        <div style={bgStyle} />
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 16, position: 'relative', zIndex: 1,
        }}>
          <img src={ASSETS.images.mascotCelebrate} alt="" style={{ width: 130, height: 130, objectFit: 'contain' }} />
          <div style={{
            background: 'white', padding: '25px 40px', borderRadius: 24,
            boxShadow: '0 6px 25px rgba(0,0,0,0.1)', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, color: '#666', fontFamily: "'Rubik', sans-serif" }}>סיימת!</div>
            <div style={{ fontSize: 50, fontWeight: 700, color: '#2D3436', fontFamily: "'Rubik', sans-serif" }}>{score} / {TOTAL}</div>
            <div style={{ fontSize: 20, color: '#FFB800', fontFamily: "'Rubik', sans-serif" }}>+{score * 2} ⭐</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            <Button onClick={startGame} color="#9B59B6" size="large" icon="🔄">שחק שוב</Button>
            <Button onClick={onBack} color="#BDBDBD" size="medium" icon="🏠">חזרה הביתה</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={screenStyle}>
      <div style={bgStyle} />
      {feedback && <Feedback type={feedback} />}

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <IconButton onClick={onBack} color="#ccc">✕</IconButton>
        <div style={{
          background: 'white', padding: '6px 16px', borderRadius: 20,
          fontSize: 15, fontWeight: 600, color: '#555', fontFamily: "'Rubik', sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          שאלה {round + 1} מתוך {TOTAL}
        </div>
        <IconButton onClick={() => word && speak(`${word.text}. באיזו אות מתחיל?`)} color="#2196F3">🔊</IconButton>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        <ProgressBar current={round + 1} total={TOTAL} />
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '10px 20px', position: 'relative', zIndex: 1,
      }}>
        {/* Word display */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'white', padding: '15px 35px', borderRadius: 22,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: 20,
        }}>
          <span style={{ fontSize: 55 }}>{word?.emoji}</span>
          <span style={{ fontSize: 24, fontWeight: 700, marginTop: 5, fontFamily: "'Rubik', sans-serif", color: '#2D3436' }}>{word?.text}</span>
          <span style={{ fontSize: 14, color: '#aaa', marginTop: 4, fontFamily: "'Rubik', sans-serif" }}>באיזו אות מתחיל? 🤔</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, width: '100%', maxWidth: 280 }}>
          {options.map((opt, i) => {
            const isSelected = selected === opt.letter;
            const isCorrect = opt.letter === target?.letter;
            let bg = 'white';
            if (isSelected) bg = isCorrect ? '#C8E6C9' : '#FFCDD2';
            return (
              <div
                key={i}
                onClick={() => handlePick(opt)}
                style={{
                  aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 52, fontWeight: 700, color: opt.color,
                  background: bg, borderRadius: 20,
                  border: `3px solid ${opt.color}`,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  cursor: selected ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: "'Rubik', sans-serif",
                }}
              >
                {opt.letter}
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 16, background: 'white', padding: '8px 20px', borderRadius: 16,
          fontSize: 18, fontWeight: 700, color: '#FFB800', fontFamily: "'Rubik', sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          ⭐ {score * 2} כוכבים
        </div>
      </div>
    </div>
  );
}

function AchievementsScreen({ progress, speak, onBack }) {
  useEffect(() => { speak(`יש לך ${progress.stars} כוכבים!`); }, [speak, progress.stars]);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 70,
      display: 'flex', flexDirection: 'column', zIndex: 1, overflow: 'auto',
    }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        background: 'linear-gradient(180deg, #FFF8E7 0%, #FFFDE7 100%)',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <IconButton onClick={onBack} color="#ccc">✕</IconButton>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Rubik', sans-serif", color: '#2D3436' }}>ההישגים שלי</div>
        <div style={{ width: 44 }} />
      </div>

      <div style={{
        position: 'relative', zIndex: 1, padding: '10px 20px 30px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15,
        width: '100%', maxWidth: 420, margin: '0 auto',
      }}>
        <img src={ASSETS.images.mascotCelebrate} alt="" style={{ width: 100, height: 100, objectFit: 'contain' }} />

        {/* Stars */}
        <div style={{
          width: '100%', background: 'linear-gradient(135deg, #FFD93D, #F9A825)',
          borderRadius: 20, padding: 20, textAlign: 'center', color: 'white',
          boxShadow: '0 4px 20px rgba(249,168,37,0.3)',
        }}>
          <div style={{ fontSize: 44, fontWeight: 700, fontFamily: "'Rubik', sans-serif" }}>⭐ {progress.stars}</div>
          <div style={{ fontSize: 16, fontFamily: "'Rubik', sans-serif" }}>כוכבים</div>
        </div>

        {/* Letters */}
        <div style={{
          width: '100%', background: 'white', borderRadius: 20, padding: 18,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 16, fontFamily: "'Rubik', sans-serif", color: '#2D3436' }}>
            אותיות שלמדתי ({progress.learned.length} / {LETTERS.length}):
          </div>
          <ProgressBar current={progress.learned.length} total={LETTERS.length} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 14 }}>
            {LETTERS.map((l, i) => {
              const learned = progress.learned.includes(l.letter);
              return (
                <span key={i} style={{
                  width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, borderRadius: 10,
                  background: learned ? l.color : '#f0f0f0',
                  color: learned ? 'white' : '#ccc',
                  boxShadow: learned ? `0 2px 8px ${l.color}44` : 'none',
                  transition: 'all 0.3s',
                  fontFamily: "'Rubik', sans-serif",
                }}>
                  {l.letter}
                </span>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          width: '100%', background: 'white', borderRadius: 20, padding: 18,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 16, fontFamily: "'Rubik', sans-serif", color: '#2D3436' }}>סטטיסטיקות:</div>
          <div style={{ fontSize: 16, marginBottom: 8, fontFamily: "'Rubik', sans-serif", color: '#555' }}>🎮 משחקים שהושלמו: {progress.games}</div>
          <div style={{ fontSize: 16, fontFamily: "'Rubik', sans-serif", color: '#555' }}>🔤 אותיות שנלמדו: {progress.learned.length} מתוך {LETTERS.length}</div>
        </div>
      </div>
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
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      maxWidth: 500, margin: '0 auto',
      fontFamily: "'Rubik', 'Heebo', sans-serif",
      direction: 'rtl', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {renderScreen()}
      <NavBar current={currentNav} onNavigate={handleNav} stars={data.stars} />
    </div>
  );
}

export default App;
