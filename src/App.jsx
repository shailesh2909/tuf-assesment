import React, { useState, useEffect, useCallback, useRef, forwardRef, useMemo } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Terminal } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   TUF BRAND TOKENS
   ═══════════════════════════════════════════════════════════ */
const TUF = {
  bg: '#0d0d0d',
  surface: '#161616',
  border: '#2a2a2a',
  orange: '#f97316',
  orangeDim: '#f9731620',
  text: '#e5e7eb',
  muted: '#6b7280',
  faint: '#374151',
  weekend: '#fb923c',
  green: '#22c55e',
  red: '#ef4444',
};

const YEAR = 2022;
const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const heroData = [
  { img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80', topic: 'Arrays & Hashing', tag: 'DSA — Basics' },
  { img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80', topic: 'Recursion & Backtracking', tag: 'DSA — Core' },
  { img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1400&q=80', topic: 'Binary Search', tag: 'DSA — Searching' },
  { img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80', topic: 'Linked Lists', tag: 'DSA — Data Structures' },
  { img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80', topic: 'System Design', tag: 'HLD / LLD' },
  { img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80', topic: 'Dynamic Programming', tag: 'DSA — Advanced' },
  { img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80', topic: 'Trees & BST', tag: 'DSA — Trees' },
  { img: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=1400&q=80', topic: 'Graphs & BFS/DFS', tag: 'DSA — Graphs' },
  { img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80', topic: 'Heaps & Tries', tag: 'DSA — Advanced DS' },
  { img: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1400&q=80', topic: 'DBMS & SQL', tag: 'Core CS' },
  { img: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&w=1400&q=80', topic: 'OS & CN', tag: 'Core CS' },
  { img: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1400&q=80', topic: 'Mock Interviews', tag: 'Interview Prep' },
];

/* ═══════════════════════════════════════════════════════════
   HOOK: Smart Notes Parser
   ═══════════════════════════════════════════════════════════ */
function useMentionedDays(noteText, maxDay) {
  return useMemo(() => {
    const found = new Set();
    if (!noteText) return found;
    const re = /\b(\d{1,2})(?:st|nd|rd|th)?\b/gi;
    let m;
    while ((m = re.exec(noteText)) !== null) {
      const n = parseInt(m[1], 10);
      if (n >= 1 && n <= maxDay) found.add(n);
    }
    return found;
  }, [noteText, maxDay]);
}

/* ═══════════════════════════════════════════════════════════
   SPIRAL BINDING
   ═══════════════════════════════════════════════════════════ */
const SpiralBinding = () => (
  <div className="absolute top-0 left-0 w-full flex justify-between px-5 pointer-events-none select-none"
    style={{ zIndex: 60, marginTop: -13 }}>
    {Array.from({ length: 28 }, (_, i) => (
      <div key={i} className="flex relative justify-center items-start pt-3 w-4">
        <div className="absolute top-[15px] w-[14px] h-[10px] rounded-[50%] shadow-inner"
          style={{ background: '#0a0a0a', border: `1px solid ${TUF.orange}30` }} />
        <div className="flex gap-[2px] z-10 drop-shadow-md">
          <div className="w-[3.5px] h-[24px] rounded-full"
            style={{ background: 'linear-gradient(to bottom, #f97316, #9a3412)' }} />
          <div className="w-[3.5px] h-[24px] rounded-full"
            style={{ background: 'linear-gradient(to bottom, #f97316, #9a3412)' }} />
        </div>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   TUF BADGE
   ═══════════════════════════════════════════════════════════ */
const TUFBadge = () => (
  <div className="absolute top-4 left-5 z-20 flex items-center gap-2 select-none">
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border"
      style={{ background: 'rgba(13,13,13,0.75)', backdropFilter: 'blur(8px)', borderColor: `${TUF.orange}50` }}>
      <BookOpen size={12} color={TUF.orange} />
      <span className="text-[10px] font-bold tracking-[0.18em]"
        style={{ color: TUF.orange, fontFamily: "'JetBrains Mono', monospace" }}>
        takeUforward
      </span>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════════════════ */
const Toast = ({ message, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.9 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3 rounded-lg border text-sm font-semibold tracking-wide"
        style={{
          background: TUF.surface, borderColor: TUF.green, color: TUF.green,
          fontFamily: "'JetBrains Mono', monospace",
          boxShadow: `0 0 24px ${TUF.green}40`,
        }}>
        ✓ &nbsp;{message}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ═══════════════════════════════════════════════════════════
   CALENDAR PAGE
   
   THE FIX for "one character at a time" bug:
   Previously, noteText was controlled by App state. Every
   keystroke triggered onNoteChange → App setState → all 12
   CalendarPage children re-rendered → textarea lost focus.
   
   Solution: use LOCAL state (localNote) for the textarea.
   The parent only hears about the text when the user clicks
   Save — it never causes re-renders mid-typing.
   ═══════════════════════════════════════════════════════════ */
const CalendarPage = forwardRef(function CalendarPage({
  monthIndex, year, initialNote, onSaveNotes,
  selStart, selEnd, onRangeCommit, isActivePage,
}, ref) {
  const name = MONTHS[monthIndex];
  const hero = heroData[monthIndex].img;

  /* Local note state — completely isolated from App renders */
  const [localNote, setLocalNote] = useState(initialNote || '');
  const prevInitial = useRef(initialNote);
  useEffect(() => {
    if (initialNote !== prevInitial.current) {
      setLocalNote(initialNote || '');
      prevInitial.current = initialNote;
    }
  }, [initialNote]);

  /* Drag-to-select */
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(null);
  const dragCurRef = useRef(null);
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);
  const [focusedDay, setFocusedDay] = useState(null);

  /* Date math */
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const rawFirst = new Date(year, monthIndex, 1).getDay();
  const firstIdx = rawFirst === 0 ? 6 : rawFirst - 1;
  const prevDays = new Date(year, monthIndex, 0).getDate();

  const cells = [];
  for (let i = firstIdx - 1; i >= 0; i--) cells.push({ day: prevDays - i, cur: false });
  for (let i = 1; i <= daysInMonth; i++)  cells.push({ day: i, cur: true });
  while (cells.length < 42) cells.push({ day: cells.length - daysInMonth - firstIdx + 1, cur: false });

  const mentionedDays = useMentionedDays(localNote, daysInMonth);
  const eStart = isDragging ? Math.min(dragStart, dragCurrent) : selStart;
  const eEnd = isDragging ? Math.max(dragStart, dragCurrent) : selEnd;

  const onDragStart = (day) => {
    setIsDragging(true);
    setDragStart(day); dragStartRef.current = day;
    setDragCurrent(day); dragCurRef.current = day;
  };
  const onDragEnter = (day) => {
    if (isDragging) { setDragCurrent(day); dragCurRef.current = day; }
  };
  const commitDrag = useCallback(() => {
    const s = Math.min(dragStartRef.current, dragCurRef.current);
    const e = Math.max(dragStartRef.current, dragCurRef.current);
    onRangeCommit(s, s === e ? null : e);
    setIsDragging(false);
  }, [onRangeCommit]);

  useEffect(() => {
    if (!isDragging) return;
    const up = () => commitDrag();
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, [isDragging, commitDrag]);

  const onGridKeyDown = (e) => {
    if (!isActivePage) return;
    if (e.key === 'Enter' && focusedDay) { onRangeCommit(focusedDay, null); return; }
    let nd = focusedDay || 1;
    if (e.key === 'ArrowRight') nd = Math.min(nd + 1, daysInMonth);
    else if (e.key === 'ArrowLeft') nd = Math.max(nd - 1, 1);
    else if (e.key === 'ArrowDown') nd = Math.min(nd + 7, daysInMonth);
    else if (e.key === 'ArrowUp') nd = Math.max(nd - 7, 1);
    else return;
    e.preventDefault();
    setFocusedDay(nd);
  };

  return (
    <div ref={ref} className="w-full h-full flex flex-col overflow-hidden select-none"
      style={{ background: TUF.bg }}>

      {/* HERO */}
      <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: '44%', background: '#0a0a0a' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${hero})` }} />
        <div className="absolute bottom-[-1px] left-0 w-full h-[40%] opacity-80"
          style={{ background: TUF.bg, clipPath: 'polygon(0 55%,45% 100%,100% 35%,100% 100%,0 100%)' }} />
        <div className="absolute bottom-[-1px] left-0 w-full"
          style={{ height: 4, background: TUF.orange, opacity: 0.9 }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.18) 3px,rgba(0,0,0,.18) 4px)' }} />

        <TUFBadge />

        <div className="absolute top-4 right-5 z-20">
          <div className="px-2.5 py-1 rounded text-[9px] font-bold tracking-[0.18em] uppercase"
            style={{ background: `${TUF.orange}25`, border: `1px solid ${TUF.orange}50`, color: TUF.orange, fontFamily: "'JetBrains Mono', monospace" }}>
            {heroData[monthIndex].tag}
          </div>
        </div>

        <div className="absolute bottom-8 right-7 flex flex-col items-end z-10">
          <span className="text-[11px] font-medium tracking-[0.25em]"
            style={{ color: TUF.orange, opacity: 0.65, fontFamily: "'JetBrains Mono', monospace" }}>
            {year}
          </span>
          <span className="leading-none font-black tracking-tight"
            style={{ fontSize: 40, color: TUF.text, textShadow: `0 0 40px ${TUF.orange}60,0 2px 6px rgba(0,0,0,.8)`, fontFamily: "'JetBrains Mono', monospace" }}>
            {name}
          </span>
          <span className="mt-1 text-[12px] font-semibold tracking-wide"
            style={{ color: TUF.orange, fontFamily: "'JetBrains Mono', monospace", textShadow: `0 0 12px ${TUF.orange}80` }}>
            {heroData[monthIndex].topic}
          </span>
        </div>

        <div className="absolute top-6 right-[45%] w-48 h-48 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle,${TUF.orange}18 0%,transparent 70%)` }} />
      </div>

      {/* BOTTOM: Notes + Grid */}
      <div className="flex-grow flex px-5 py-4 gap-5" style={{ background: TUF.bg, minHeight: 0 }}>

        {/* NOTES */}
        <div className="w-[34%] flex flex-col" style={{ borderRight: `1px solid ${TUF.border}`, paddingRight: 16 }}>
          <div className="flex items-center justify-between rounded-t-md px-3 py-2"
            style={{ background: TUF.surface, border: `1px solid ${TUF.border}`, borderBottom: 'none' }}>
            <div className="flex items-center gap-2">
              <Terminal size={11} color={TUF.orange} />
              <span className="text-[10px] font-bold tracking-[.18em] uppercase"
                style={{ color: TUF.muted, fontFamily: "'JetBrains Mono', monospace" }}>
                notes.md
              </span>
            </div>
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); onSaveNotes(monthIndex, localNote); }}
              className="text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded cursor-pointer"
              style={{ border: `1px solid ${TUF.orange}`, color: TUF.orange, background: 'transparent', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = TUF.orange; e.currentTarget.style.color = '#000'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = TUF.orange; }}
            >
              Save
            </button>
          </div>

          <div className="relative flex-grow rounded-b-md overflow-hidden"
            style={{ background: TUF.surface, border: `1px solid ${TUF.border}`, borderTop: 'none' }}>
            {/* line numbers */}
            <div className="absolute left-0 top-0 bottom-0 w-7 flex flex-col pt-2 pointer-events-none"
              style={{ borderRight: `1px solid ${TUF.border}` }}>
              {Array.from({ length: 13 }, (_, i) => (
                <div key={i} className="text-right pr-1.5 text-[10px]"
                  style={{ height: 34, lineHeight: '34px', color: TUF.faint, fontFamily: "'JetBrains Mono', monospace" }}>
                  {i + 1}
                </div>
              ))}
            </div>
            {/* ruled lines */}
            <div className="absolute left-7 right-0 top-0 bottom-0 pointer-events-none mt-2">
              {Array.from({ length: 13 }, (_, i) => (
                <div key={i} style={{ height: 34, borderBottom: `1px solid ${TUF.border}40` }} />
              ))}
            </div>
            {/* TEXTAREA — local state only, no App re-renders on keypress */}
            <textarea
              value={localNote}
              onChange={e => setLocalNote(e.target.value)}
              onMouseDown={e => e.stopPropagation()}
              onTouchStart={e => e.stopPropagation()}
              onClick={e => e.stopPropagation()}
              placeholder={`// ${heroData[monthIndex].topic}\n// "Solve 10 problems by 15th"\n// "Mock interview on the 23rd"`}
              spellCheck={false}
              className="absolute top-0 bottom-0 right-0 bg-transparent resize-none outline-none overflow-hidden"
              style={{
                left: 28, width: 'calc(100% - 28px)',
                paddingTop: 8, paddingLeft: 8,
                fontSize: 12, lineHeight: '34px',
                color: TUF.text, fontFamily: "'JetBrains Mono', monospace",
                border: 'none', caretColor: TUF.orange, zIndex: 10,
              }}
            />
          </div>

          {selStart && (
            <div className="mt-3 px-3 py-2 rounded text-[10px] font-bold tracking-wider"
              style={{ background: TUF.orangeDim, border: `1px solid ${TUF.orange}30`, color: TUF.orange, fontFamily: "'JetBrains Mono', monospace" }}>
              📅 {selEnd ? `Day ${selStart} → ${selEnd}` : `Day ${selStart} selected`}
            </div>
          )}
        </div>

        {/* GRID */}
        <div
          className="w-[66%] flex flex-col focus:outline-none"
          tabIndex={isActivePage ? 0 : -1}
          onKeyDown={onGridKeyDown}
          onFocus={() => { if (!focusedDay) setFocusedDay(1); }}
          onBlur={() => setFocusedDay(null)}
          role="grid"
          aria-label={`${name} ${year} calendar`}
        >
          <div className="grid grid-cols-7 mb-3">
            {DAYS.map((d, i) => (
              <div key={d}
                className="text-center text-[10px] font-black tracking-[.15em] uppercase py-1.5 rounded"
                style={{
                  color: i >= 5 ? TUF.weekend : TUF.muted,
                  fontFamily: "'JetBrains Mono', monospace",
                  background: i >= 5 ? `${TUF.weekend}10` : 'transparent',
                }}>
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-0.5 flex-grow content-start">
            {cells.map((c, idx) => {
              const isS = c.cur && c.day === eStart;
              const isE = c.cur && eEnd && c.day === eEnd;
              const isB = c.cur && eStart && eEnd && c.day > eStart && c.day < eEnd;
              const isW = idx % 7 >= 5;
              const isFoc = c.cur && c.day === focusedDay;
              const hasDot = c.cur && mentionedDays.has(c.day);

              let color = TUF.text, fw = 600;
              if (!c.cur) { color = TUF.faint; fw = 400; }
              else if (isW && !isS && !isE && !isB) { color = TUF.weekend; fw = 700; }
              if (isS || isE) { color = '#000'; fw = 900; }
              else if (isB) { color = TUF.orange; fw = 700; }

              return (
                <div key={idx} className="relative w-full flex items-center justify-center" style={{ height: 60 }}>
                  {isB && <div className="absolute inset-0" style={{ background: `${TUF.orange}15` }} />}
                  {isS && eEnd && eStart < eEnd && <div className="absolute right-0 top-0 bottom-0 w-1/2" style={{ background: `${TUF.orange}15` }} />}
                  {isE && eStart && eStart < eEnd && <div className="absolute left-0 top-0 bottom-0 w-1/2" style={{ background: `${TUF.orange}15` }} />}

                  <div
                    onMouseDown={e => { e.preventDefault(); e.stopPropagation(); if (c.cur) onDragStart(c.day); }}
                    onMouseEnter={e => {
                      if (c.cur) onDragEnter(c.day);
                      if (c.cur && !isS && !isE) {
                        e.currentTarget.style.background = `${TUF.orange}20`;
                        e.currentTarget.style.border = `1px solid ${TUF.orange}50`;
                      }
                    }}
                    onMouseLeave={e => {
                      if (c.cur && !isS && !isE) {
                        e.currentTarget.style.background = isB ? `${TUF.orange}18` : 'transparent';
                        e.currentTarget.style.border = '1px solid transparent';
                      }
                    }}
                    className="relative z-[5] flex items-center justify-center rounded-lg"
                    style={{
                      width: 44, height: 44, fontSize: 15,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: fw, color,
                      cursor: c.cur ? 'pointer' : 'default',
                      background: (isS || isE) ? TUF.orange : isB ? `${TUF.orange}18` : 'transparent',
                      boxShadow: (isS || isE) ? `0 0 16px ${TUF.orange}60` : 'none',
                      transform: (isS || isE) ? 'scale(1.12)' : 'none',
                      border: '1px solid transparent',
                      transition: 'background 0.12s, border 0.12s',
                    }}
                    role="gridcell"
                    aria-label={c.cur ? `${name} ${c.day}` : undefined}
                    aria-selected={(isS || isE) || undefined}
                  >
                    {c.day}
                    {hasDot && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full"
                        style={{ background: TUF.red, boxShadow: `0 0 4px ${TUF.red}` }} />
                    )}
                  </div>

                  {isFoc && (
                    <div className="absolute z-20 pointer-events-none rounded-lg"
                      style={{ width: 48, height: 48, border: `2px solid ${TUF.orange}`, boxShadow: `0 0 0 3px ${TUF.orange}25` }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════ */
export default function App() {
  const [notes, setNotes] = useState({});
  const [selStart, setSelStart] = useState(null);
  const [selEnd, setSelEnd] = useState(null);
  const [curPage, setCurPage] = useState(8);
  const [toast, setToast] = useState({ visible: false, msg: '' });
  const bookRef = useRef(null);

  useEffect(() => {
    try {
      const r = localStorage.getItem('tufCalNotes');
      if (r) setNotes(JSON.parse(r));
    } catch { }
  }, []);

  const flipNext = useCallback(() => {
    const pf = bookRef.current?.pageFlip();
    if (!pf || pf.getState() === 'flipping') return;
    const cur = pf.getCurrentPageIndex();
    cur >= 11 ? pf.turnToPage(0) : pf.flip(cur + 1, 'top-right');
  }, []);

  const flipPrev = useCallback((e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const pf = bookRef.current?.pageFlip();
    if (!pf || pf.getState() === 'flipping') return;
    const cur = pf.getCurrentPageIndex();
    cur <= 0 ? pf.turnToPage(11) : pf.turnToPage(cur - 1);
  }, []);

  const handleFlip = useCallback((e) => {
    setCurPage(e.data); setSelStart(null); setSelEnd(null);
  }, []);

  /* Save receives text directly from the page component */
  const onSaveNotes = useCallback((idx, text) => {
    setNotes(prev => {
      const next = { ...prev, [MONTHS[idx]]: text };
      localStorage.setItem('tufCalNotes', JSON.stringify(next));
      return next;
    });
    setToast({ visible: true, msg: `${MONTHS[idx]} notes saved!` });
    setTimeout(() => setToast({ visible: false, msg: '' }), 2500);
  }, []);

  const onRangeCommit = useCallback((start, end) => {
    setSelStart(start); setSelEnd(end);
  }, []);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800;900&display=swap');`}</style>

      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-6"
        style={{ background: `radial-gradient(ellipse at 50% 0%,#1a0a0025 0%,${TUF.bg} 65%)`, fontFamily: "'JetBrains Mono', monospace" }}>

        <Toast message={toast.msg} visible={toast.visible} />

        {/* branding strip */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-px h-5" style={{ background: TUF.orange }} />
          <span className="text-[11px] font-bold tracking-[0.35em] uppercase" style={{ color: TUF.orange }}>takeUforward</span>
          <span className="text-[11px] tracking-[0.2em]" style={{ color: TUF.muted }}>/ Planning Calendar {YEAR}</span>
          <div className="w-px h-5" style={{ background: TUF.border }} />
        </div>

        {/* calendar */}
        <div style={{
          width: 800, height: 1000, position: 'relative',
          borderRadius: '0 0 8px 8px',
          boxShadow: `0 0 0 1px ${TUF.border},0 32px 80px rgba(0,0,0,.8),0 0 60px ${TUF.orange}10`,
        }}>
          <SpiralBinding />

          <HTMLFlipBook
            ref={bookRef}
            width={800} height={1000}
            size="fixed" usePortrait={true}
            drawShadow={true} maxShadowOpacity={0.5}
            flippingTime={1100}
            useMouseEvents={false} clickEventForward={false} disableFlipByClick={true}
            showCover={false} startPage={8} mobileScrollSupport={false}
            showPageCorners={false} startZIndex={10}
            onFlip={handleFlip}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <CalendarPage
                key={i}
                monthIndex={i}
                year={YEAR}
                initialNote={notes[MONTHS[i]] || ''}
                onSaveNotes={onSaveNotes}
                selStart={curPage === i ? selStart : null}
                selEnd={curPage === i ? selEnd : null}
                onRangeCommit={onRangeCommit}
                isActivePage={curPage === i}
              />
            ))}
          </HTMLFlipBook>

          {/* Arrow buttons — no hover zone, no floating pill */}
          {[
            { side: 'left', Icon: ChevronLeft, fn: flipPrev, pos: { left: -56 } },
            { side: 'right', Icon: ChevronRight, fn: flipNext, pos: { right: -56 } },
          ].map(({ side, Icon, fn, pos }) => (
            <button
              key={side}
              onClick={fn}
              className="absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-50 cursor-pointer"
              style={{ ...pos, background: TUF.surface, border: `1px solid ${TUF.border}`, color: TUF.text, boxShadow: '0 4px 20px rgba(0,0,0,.5)', transition: 'all 0.2s' }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, { borderColor: TUF.orange, color: TUF.orange, boxShadow: `0 0 16px ${TUF.orange}40`, transform: 'translateY(-50%) scale(1.12)' })}
              onMouseLeave={e => Object.assign(e.currentTarget.style, { borderColor: TUF.border, color: TUF.text, boxShadow: '0 4px 20px rgba(0,0,0,.5)', transform: 'translateY(-50%) scale(1)' })}
            >
              <Icon size={20} strokeWidth={2.5} />
            </button>
          ))}
        </div>

        {/* help strip */}
        <div className="flex items-center gap-4 flex-wrap justify-center select-none">
          {[
            ['Navigate', 'Click arrows to flip months'],
            ['Select', 'Drag across dates for a range'],
            ['Keyboard', 'Tab → Arrow keys → Enter'],
            ['Smart Notes', 'Type "15th" → see red dot'],
          ].map(([label, desc]) => (
            <span key={label} className="text-[10px] tracking-wider" style={{ color: TUF.muted }}>
              <span style={{ color: TUF.orange, fontWeight: 700 }}>{label}:</span>{' '}{desc}
            </span>
          ))}
        </div>

        <div className="text-[9px] tracking-[0.3em] uppercase" style={{ color: TUF.faint }}>
          Built for takeUforward · {YEAR}
        </div>
      </div>
    </>
  );
}