import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ─── DATA ─────────────────────────────────────────────────── */
const YEAR = 2022;
const MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const DAYS = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

const heroes = [
  'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1418985991508-e47386d96a71?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=1400&q=80',
];

/* ─── SPIRAL BINDING ───────────────────────────────────────── */
const SpiralBinding = () => (
  <div className="absolute top-0 left-0 w-full flex justify-between px-5 pointer-events-none select-none" style={{ zIndex: 60, marginTop: -13 }}>
    {Array.from({ length: 28 }, (_, i) => (
      <div key={i} className="flex relative justify-center items-start pt-3 w-4">
        <div className="absolute top-[15px] w-[14px] h-[10px] rounded-[50%] bg-[#1a1a1a] shadow-inner" />
        <div className="flex gap-[2px] z-10 drop-shadow-md">
          <div className="w-[3.5px] h-[24px] rounded-full bg-gradient-to-b from-[#e5e7eb] via-[#9ca3af] to-[#4b5563]" />
          <div className="w-[3.5px] h-[24px] rounded-full bg-gradient-to-b from-[#e5e7eb] via-[#9ca3af] to-[#4b5563]" />
        </div>
      </div>
    ))}
  </div>
);

/* ─── CALENDAR PAGE ────────────────────────────────────────── */
const CalendarPage = forwardRef(function CalendarPage(
  { monthIndex, year, noteText, onNoteChange, onSaveNotes, startDate, endDate, onDateClick }, ref
) {
  const name = MONTHS[monthIndex];
  const hero = heroes[monthIndex];

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const rawFirst = new Date(year, monthIndex, 1).getDay();
  const firstIdx = rawFirst === 0 ? 6 : rawFirst - 1;
  const prevDays = new Date(year, monthIndex, 0).getDate();

  const cells = [];
  for (let i = firstIdx - 1; i >= 0; i--) cells.push({ day: prevDays - i, cur: false });
  for (let i = 1; i <= daysInMonth; i++)  cells.push({ day: i, cur: true });
  while (cells.length < 42)              cells.push({ day: cells.length - daysInMonth - firstIdx + 1, cur: false });

  const same = (a, b) => a && b && a.getTime() === b.getTime();
  const betw = (d, s, e) => d && s && e && d > s && d < e;

  return (
    <div ref={ref} className="w-full h-full bg-white flex flex-col overflow-hidden">
      {/* HERO (top 46%) */}
      <div className="relative w-full flex-shrink-0 overflow-hidden bg-slate-100" style={{ height: '46%' }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${hero})` }} />
        <div className="absolute bottom-[-1px] left-0 w-full h-[35%] opacity-45 mix-blend-multiply" style={{ background: '#075985', clipPath: 'polygon(0 78%,38% 100%,100% 28%,100% 100%,0 100%)' }} />
        <div className="absolute bottom-[-1px] left-0 w-full h-[44%]" style={{ background: '#0ea5e9', clipPath: 'polygon(0 58%,40% 100%,100% 42%,100% 100%,0 100%)' }} />
        <div className="absolute bottom-4 right-6 flex flex-col items-end z-10 select-none">
          <span className="text-[15px] font-light tracking-[0.25em] text-sky-200">{year}</span>
          <span className="text-[36px] font-extrabold tracking-wide leading-none text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,.25)' }}>{name}</span>
        </div>
      </div>

      {/* BOTTOM: Notes + Grid (54%) */}
      <div className="flex-grow flex px-6 py-5 gap-5 bg-white" style={{ minHeight: 0 }}>

        {/* NOTES */}
        <div className="w-[34%] flex flex-col border-r border-gray-200 pr-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[12px] font-bold tracking-[.15em] uppercase text-gray-800">Notes</span>
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); onSaveNotes(monthIndex); }}
              className="text-[10px] font-bold tracking-wider uppercase text-sky-500 border border-sky-400 px-3 py-1 rounded hover:bg-sky-500 hover:text-white transition-colors cursor-pointer"
            >Save</button>
          </div>
          <div className="relative flex-grow">
            <div className="absolute inset-0 flex flex-col pointer-events-none mt-5">
              {Array.from({ length: 11 }, (_, i) => <div key={i} className="w-full border-b border-gray-200/70" style={{ height: 38 }} />)}
            </div>
            <textarea
              value={noteText}
              onChange={e => { e.stopPropagation(); onNoteChange(monthIndex, e.target.value); }}
              onMouseDown={e => e.stopPropagation()}
              onTouchStart={e => e.stopPropagation()}
              placeholder="Jot down events…"
              spellCheck={false}
              className="absolute inset-0 w-full bg-transparent resize-none outline-none text-[14px] font-medium text-gray-600 overflow-hidden z-[5]"
              style={{ height: 418, lineHeight: '38px', border: 'none' }}
            />
          </div>
        </div>

        {/* GRID */}
        <div className="w-[66%] flex flex-col">
          <div className="grid grid-cols-7 mb-1.5">
            {DAYS.map((d, i) => (
              <div key={d} className={`text-center text-[12px] font-[800] tracking-[.12em] uppercase ${i >= 5 ? 'text-sky-500' : 'text-neutral-400'}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1 flex-grow content-start">
            {cells.map((c, idx) => {
              const dt = new Date(year, monthIndex, c.day);
              const isS = c.cur && same(dt, startDate);
              const isE = c.cur && same(dt, endDate);
              const isB = c.cur && betw(dt, startDate, endDate);
              const isW = idx % 7 >= 5;

              let color = '#1f2937', fw = 600;
              if (!c.cur)                           { color = '#d4d4d4'; fw = 400; }
              else if (isW && !isS && !isE && !isB) { color = '#0ea5e9'; fw = 700; }
              if (isS || isE)                        { color = '#fff'; fw = 800; }
              else if (isB)                          { color = '#075985'; fw = 700; }

              return (
                <div key={idx} className="relative w-full flex items-center justify-center" style={{ height: 58 }}>
                  {isB && <div className="absolute inset-0 bg-sky-100" />}
                  {isS && endDate && startDate < endDate && <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-sky-100" />}
                  {isE && startDate && startDate < endDate && <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-sky-100" />}
                  <div
                    onMouseDown={e => e.stopPropagation()}
                    onClick={e => { e.stopPropagation(); if (c.cur) onDateClick(dt); }}
                    className="relative z-[5] flex items-center justify-center rounded transition-all duration-150"
                    style={{
                      width: 42, height: 42, fontSize: 17, fontWeight: fw, color, cursor: c.cur ? 'pointer' : 'default',
                      background: (isS || isE) ? '#0ea5e9' : 'transparent',
                      boxShadow: (isS || isE) ? '0 2px 6px rgba(14,165,233,.4)' : 'none',
                      transform: (isS || isE) ? 'scale(1.08)' : 'none',
                    }}
                  >{c.day}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

/* ─── APP ──────────────────────────────────────────────────── */
export default function App() {
  const [notes, setNotes]       = useState({});
  const [selStart, setSelStart] = useState(null);
  const [selEnd, setSelEnd]     = useState(null);
  const [curPage, setCurPage]   = useState(8); // September
  const bookRef = useRef(null);

  useEffect(() => {
    try { const r = localStorage.getItem('calNotes'); if (r) setNotes(JSON.parse(r)); } catch {}
  }, []);

  const onNoteChange = useCallback((idx, text) => {
    setNotes(p => ({ ...p, [MONTHS[idx]]: text }));
  }, []);

  const onSaveNotes = useCallback((idx) => {
    localStorage.setItem('calNotes', JSON.stringify(notes));
    alert(`Notes for ${MONTHS[idx]} saved!`);
  }, [notes]);

  const onDateClick = useCallback((dt) => {
    if (!selStart) { setSelStart(dt); setSelEnd(null); }
    else if (!selEnd) {
      if (dt < selStart) setSelStart(dt);
      else if (dt.getTime() === selStart.getTime()) setSelStart(null);
      else setSelEnd(dt);
    } else { setSelStart(dt); setSelEnd(null); }
  }, [selStart, selEnd]);

  const flipNext = () => bookRef.current?.pageFlip()?.flipNext();
  const flipPrev = () => bookRef.current?.pageFlip()?.flipPrev();

  const onFlip = useCallback((e) => setCurPage(e.data), []);

  const canPrev = curPage > 0;
  const canNext = curPage < 11;

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-4 sm:p-8 font-sans gap-6">

      {/* Calendar container */}
      <div style={{ width: 800, height: 1000, position: 'relative' }} className="shadow-2xl rounded-b-lg">
        <SpiralBinding />

        <HTMLFlipBook
          ref={bookRef}
          width={800}
          height={1000}
          size="fixed"
          usePortrait={true}
          drawShadow={true}
          maxShadowOpacity={0.3}
          flippingTime={1200}
          useMouseEvents={true}
          clickEventForward={true}
          disableFlipByClick={true}
          showCover={false}
          startPage={8}
          mobileScrollSupport={true}
          showPageCorners={true}
          startZIndex={10}
          onFlip={onFlip}
          style={{ overflow: 'visible' }}
          className="calendar-flipbook"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <CalendarPage
              key={i}
              monthIndex={i}
              year={YEAR}
              noteText={notes[MONTHS[i]] || ''}
              onNoteChange={onNoteChange}
              onSaveNotes={onSaveNotes}
              startDate={selStart}
              endDate={selEnd}
              onDateClick={onDateClick}
            />
          ))}
        </HTMLFlipBook>

        {/* ── NAV ARROWS (overlaid on calendar edges) ── */}
        <button
          onClick={flipPrev}
          disabled={!canPrev}
          className={`absolute left-[-56px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg z-50 ${
            canPrev
              ? 'bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 hover:shadow-xl cursor-pointer text-gray-700'
              : 'bg-gray-200/50 text-gray-300 cursor-default'
          }`}
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <button
          onClick={flipNext}
          disabled={!canNext}
          className={`absolute right-[-56px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg z-50 ${
            canNext
              ? 'bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 hover:shadow-xl cursor-pointer text-gray-700'
              : 'bg-gray-200/50 text-gray-300 cursor-default'
          }`}
        >
          <ChevronRight size={22} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── HELP HINT ── */}
      <p className="text-xs text-gray-400 tracking-wide text-center select-none">
        Drag a page corner to peel · Click arrows or page edges to flip · Click dates to select a range
      </p>
    </div>
  );
}
