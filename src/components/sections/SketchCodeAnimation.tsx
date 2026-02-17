import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ── Editable fields that sync code ↔ preview ── */
interface EditableFields {
  heading: string;
  description: string;
  buttonText: string;
}

const defaults: EditableFields = {
  heading: "#შენშეგიძლია",
  description: "ისწავლე კოდი...",
  buttonText: "დაწყება",
};

/* ── Syntax colors (Catppuccin) ── */
const c = {
  keyword: "#c678dd",
  tag: "#e06c75",
  attr: "#d19a66",
  string: "#98c379",
  punct: "#abb2bf",
  component: "#61afef",
  comment: "#5c6370",
  text: "#abb2bf",
  editable: "#f5c2e7",
};

type Token = { text: string; color: string; editable?: keyof EditableFields };
type CodeLine = { tokens: Token[]; indent: number };

const buildCodeLines = (fields: EditableFields): CodeLine[] => [
  { indent: 0, tokens: [
    { text: "import ", color: c.keyword },
    { text: "React", color: c.component },
    { text: " from ", color: c.keyword },
    { text: "'react'", color: c.string },
  ]},
  { indent: 0, tokens: [
    { text: "import ", color: c.keyword },
    { text: "{ motion }", color: c.component },
    { text: " from ", color: c.keyword },
    { text: "'framer-motion'", color: c.string },
  ]},
  { indent: 0, tokens: [{ text: "", color: c.text }] },
  { indent: 0, tokens: [
    { text: "// ", color: c.comment },
    { text: "re:school მთავარი გვერდი", color: c.comment },
  ]},
  { indent: 0, tokens: [
    { text: "const ", color: c.keyword },
    { text: "Hero", color: c.component },
    { text: " = () => {", color: c.punct },
  ]},
  { indent: 1, tokens: [
    { text: "return ", color: c.keyword },
    { text: "(", color: c.punct },
  ]},
  { indent: 2, tokens: [
    { text: "<", color: c.punct },
    { text: "motion.section", color: c.tag },
    { text: " className", color: c.attr },
    { text: "=", color: c.punct },
    { text: '"hero"', color: c.string },
    { text: ">", color: c.punct },
  ]},
  { indent: 3, tokens: [
    { text: "<", color: c.punct },
    { text: "h1", color: c.tag },
    { text: ">", color: c.punct },
    { text: fields.heading, color: c.editable, editable: "heading" },
    { text: "</", color: c.punct },
    { text: "h1", color: c.tag },
    { text: ">", color: c.punct },
  ]},
  { indent: 3, tokens: [
    { text: "<", color: c.punct },
    { text: "p", color: c.tag },
    { text: ">", color: c.punct },
    { text: fields.description, color: c.editable, editable: "description" },
    { text: "</", color: c.punct },
    { text: "p", color: c.tag },
    { text: ">", color: c.punct },
  ]},
  { indent: 3, tokens: [
    { text: "<", color: c.punct },
    { text: "Button", color: c.component },
    { text: ">", color: c.punct },
    { text: fields.buttonText, color: c.editable, editable: "buttonText" },
    { text: "</", color: c.punct },
    { text: "Button", color: c.component },
    { text: ">", color: c.punct },
  ]},
  { indent: 3, tokens: [
    { text: "<", color: c.punct },
    { text: "CourseGrid", color: c.component },
    { text: " courses", color: c.attr },
    { text: "={", color: c.punct },
    { text: "data", color: c.text },
    { text: "} />", color: c.punct },
  ]},
  { indent: 2, tokens: [
    { text: "</", color: c.punct },
    { text: "motion.section", color: c.tag },
    { text: ">", color: c.punct },
  ]},
  { indent: 1, tokens: [{ text: ")", color: c.punct }] },
  { indent: 0, tokens: [{ text: "}", color: c.punct }] },
];

/* ── Inline editable token ── */
const EditableToken = ({
  value,
  color,
  fieldKey,
  isEditable,
  onChange,
}: {
  value: string;
  color: string;
  fieldKey: keyof EditableFields;
  isEditable: boolean;
  onChange: (key: keyof EditableFields, val: string) => void;
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  const handleInput = () => {
    if (spanRef.current) {
      onChange(fieldKey, spanRef.current.textContent || "");
    }
  };

  if (!isEditable) {
    return <span style={{ color }}>{value}</span>;
  }

  return (
    <span
      ref={spanRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      className="outline-none rounded px-0.5 -mx-0.5 transition-colors focus:ring-1 focus:ring-brand-yellow/40"
      style={{
        color,
        background: "hsl(52, 70%, 45% / 0.08)",
        borderBottom: "1px dashed hsl(52, 70%, 45% / 0.4)",
        cursor: "text",
        minWidth: 20,
        display: "inline-block",
      }}
    >
      {value}
    </span>
  );
};

/* ── Typing speed ── */
const TYPE_DELAY = 280;
const COMPILE_WAIT = 600;
const WEBSITE_WAIT = 1400;

const SketchCodeAnimation = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [key, setKey] = useState(0);
  const [fields, setFields] = useState<EditableFields>({ ...defaults });
  const [isEditable, setIsEditable] = useState(false);
  const [compiling, setCompiling] = useState(false);

  const codeLines = buildCodeLines(fields);

  const handleFieldChange = useCallback((fieldKey: keyof EditableFields, value: string) => {
    setFields(prev => ({ ...prev, [fieldKey]: value }));
    // Show brief "compiling" flash
    setCompiling(true);
    const t = setTimeout(() => setCompiling(false), 400);
    return () => clearTimeout(t);
  }, []);

  const startAnimation = useCallback(() => {
    setPhase(0);
    setVisibleLines(0);
    setShowCursor(true);
    setIsEditable(false);
    setFields({ ...defaults });
    setKey(k => k + 1);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    codeLines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 300 + i * TYPE_DELAY));
    });

    const totalType = 300 + codeLines.length * TYPE_DELAY;

    timers.push(setTimeout(() => {
      setPhase(1);
      setShowCursor(false);
    }, totalType + COMPILE_WAIT));

    timers.push(setTimeout(() => {
      setPhase(2);
      setIsEditable(true);
    }, totalType + COMPILE_WAIT + WEBSITE_WAIT));

    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <div className="relative w-full h-[460px] pointer-events-auto" key={key}>
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-4 px-1">
        {[
          { label: "Write", icon: "⌨", active: phase >= 0 },
          { label: "Build", icon: "⚙", active: phase >= 1 },
          { label: "Deploy", icon: "🚀", active: phase >= 2 },
        ].map((step, i) => (
          <div key={step.label} className="flex items-center gap-1.5">
            {i > 0 && (
              <motion.div
                className="w-8 h-[2px] rounded-full"
                animate={{ backgroundColor: step.active ? "hsl(134, 60%, 40%)" : "hsl(240, 5%, 20%)" }}
                transition={{ duration: 0.4 }}
              />
            )}
            <motion.div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono"
              animate={{
                backgroundColor: step.active ? "hsl(240, 10%, 14%)" : "hsl(240, 10%, 10%)",
                borderColor: step.active ? "hsl(134, 60%, 40% / 0.3)" : "hsl(240, 5%, 20%)",
                color: step.active ? "hsl(134, 60%, 70%)" : "hsl(240, 5%, 35%)",
              }}
              style={{ border: "1px solid" }}
              transition={{ duration: 0.3 }}
            >
              <span>{step.icon}</span>
              <span>{step.label}</span>
            </motion.div>
          </div>
        ))}

        {/* Edit hint + Replay */}
        <div className="ml-auto flex items-center gap-2">
          <AnimatePresence>
            {isEditable && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.8 }}
                className="text-[9px] font-mono text-brand-yellow/50 flex items-center gap-1"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-yellow/60 animate-pulse" />
                შეცვალე კოდი ↓
              </motion.span>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {phase >= 2 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.5 }}
                onClick={startAnimation}
                className="text-[10px] font-mono text-muted-foreground/50 hover:text-brand-yellow/70 transition-colors px-2 py-1 rounded border border-border/20 hover:border-brand-yellow/30"
              >
                ↻ replay
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-stretch gap-2 h-[410px]">
        {/* ━━ CODE EDITOR ━━ */}
        <motion.div
          className="flex-1 rounded-lg overflow-hidden flex flex-col"
          style={{ background: "#1e1e2e", border: "1px solid hsl(240, 10%, 18%)" }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Tab bar */}
          <div className="h-9 flex items-center px-2 gap-0.5" style={{ background: "#181825", borderBottom: "1px solid hsl(240, 10%, 16%)" }}>
            <div className="flex items-center gap-1.5 mr-3 pl-1">
              <div className="w-[10px] h-[10px] rounded-full" style={{ background: "#f38ba8" }} />
              <div className="w-[10px] h-[10px] rounded-full" style={{ background: "#f9e2af" }} />
              <div className="w-[10px] h-[10px] rounded-full" style={{ background: "#a6e3a1" }} />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-t text-[10px] font-mono" style={{ background: "#1e1e2e", color: "#cdd6f4", borderTop: "2px solid #89b4fa" }}>
              <span style={{ color: "#89b4fa" }}>⟨⟩</span>
              <span>Hero.tsx</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono" style={{ color: "#6c7086" }}>
              <span>App.tsx</span>
            </div>
          </div>

          {/* Code area */}
          <div className="flex flex-1 overflow-hidden">
            <div className="py-3 px-1 text-right select-none shrink-0" style={{ background: "#181825", minWidth: 32 }}>
              {codeLines.map((_, i) => (
                <div key={i} className="text-[10px] leading-[20px] font-mono" style={{ color: i < visibleLines ? "#585b70" : "transparent", transition: "color 0.2s" }}>
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="py-3 px-2 flex-1 overflow-hidden">
              {codeLines.map((line, i) => (
                <div key={i} className="flex items-center leading-[20px] h-[20px]" style={{ paddingLeft: line.indent * 14 }}>
                  <AnimatePresence>
                    {i < visibleLines && (
                      <motion.span
                        className="font-mono text-[11px] whitespace-nowrap flex items-center"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        transition={{ duration: 0.15 }}
                      >
                        {line.tokens.map((token, j) =>
                          token.editable && isEditable ? (
                            <EditableToken
                              key={j}
                              value={token.text}
                              color={token.color}
                              fieldKey={token.editable}
                              isEditable={isEditable}
                              onChange={handleFieldChange}
                            />
                          ) : (
                            <span key={j} style={{ color: token.color }}>{token.text}</span>
                          )
                        )}
                        {i === visibleLines - 1 && showCursor && (
                          <motion.span
                            className="inline-block w-[2px] h-[14px] ml-[1px]"
                            style={{ background: "#f5e0dc" }}
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div className="h-5 flex items-center px-2 text-[9px] font-mono justify-between" style={{ background: "#181825", borderTop: "1px solid hsl(240, 10%, 16%)", color: "#585b70" }}>
            <span>{isEditable ? "✎ Interactive Mode" : "TypeScript React"}</span>
            <span>Ln {visibleLines}, Col {visibleLines > 0 ? codeLines[visibleLines - 1]?.tokens.reduce((a, t) => a + t.text.length, 0) : 0}</span>
          </div>
        </motion.div>

        {/* ━━ MIDDLE: Build progress ━━ */}
        <div className="flex flex-col items-center justify-center w-14 shrink-0">
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <svg width="40" height="20" viewBox="0 0 40 20">
                  <motion.path
                    d="M2 10 L30 10 M24 4 L30 10 L24 16"
                    stroke="hsl(134, 60%, 40%)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>

                <motion.div
                  className="w-7 h-7 rounded-full"
                  style={{ border: "2px solid hsl(134, 60%, 40% / 0.15)", borderTopColor: "hsl(134, 60%, 40%)" }}
                  animate={{ rotate: compiling || phase < 2 ? 360 : 0 }}
                  transition={{ duration: 1, repeat: compiling || phase < 2 ? Infinity : 0, ease: "linear" }}
                />

                <motion.div className="flex flex-col items-center gap-0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  {compiling ? (
                    <span className="text-[8px] font-mono text-brand-yellow/70">updating...</span>
                  ) : phase < 2 ? (
                    <span className="text-[8px] font-mono text-brand-green/60">building</span>
                  ) : (
                    <motion.span className="text-[8px] font-mono text-brand-green" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      ✓ live
                    </motion.span>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ━━ WEBSITE PREVIEW ━━ */}
        <motion.div
          className="flex-1 rounded-lg overflow-hidden flex flex-col"
          style={{ border: "1px solid" }}
          animate={{
            borderColor: phase >= 2 ? "hsl(197, 60%, 45% / 0.35)" : "hsl(240, 10%, 16%)",
            opacity: phase >= 2 ? 1 : 0.4,
            boxShadow: phase >= 2 ? "0 0 30px hsl(197, 60%, 45% / 0.1), 0 0 60px hsl(52, 70%, 45% / 0.05)" : "none",
          }}
          initial={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.5 }}
        >
          {/* Chrome bar */}
          <div className="h-9 flex items-center px-2" style={{ background: phase >= 2 ? "#1a1a2e" : "#111118", borderBottom: "1px solid hsl(240, 10%, 16%)", transition: "background 0.5s" }}>
            <div className="flex items-center gap-1.5 mr-3 pl-1">
              <div className="w-[10px] h-[10px] rounded-full" style={{ background: "#f38ba8" }} />
              <div className="w-[10px] h-[10px] rounded-full" style={{ background: "#f9e2af" }} />
              <div className="w-[10px] h-[10px] rounded-full" style={{ background: "#a6e3a1" }} />
            </div>
            <div className="flex-1 h-[22px] rounded-md flex items-center px-2.5 gap-1.5" style={{ background: "hsl(240, 10%, 12%)", border: "1px solid hsl(240, 10%, 18%)" }}>
              <span className="text-[9px]" style={{ color: "#a6e3a1" }}>🔒</span>
              <span className="text-[9px] font-mono" style={{ color: "#6c7086" }}>reschool.world</span>
            </div>
          </div>

          {/* Preview content */}
          <div className="flex-1 p-4 overflow-hidden" style={{ background: phase >= 2 ? "#0f0f1a" : "#0a0a12", transition: "background 0.6s" }}>
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div className="h-full flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  {/* Nav */}
                  <motion.div
                    className="flex justify-between items-center mb-4 pb-2"
                    style={{ borderBottom: "1px solid hsl(240, 10%, 16%)" }}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded" style={{ background: "var(--gradient-primary)" }} />
                      <span className="text-[11px] font-bold" style={{ color: "#cdd6f4" }}>re:school</span>
                    </div>
                    <div className="flex gap-3 text-[8px]" style={{ color: "#585b70" }}>
                      <span className="cursor-pointer hover:text-brand-yellow transition-colors" onClick={() => navigate("/courses")}>კურსები</span>
                      <span className="cursor-pointer hover:text-brand-yellow transition-colors" onClick={() => navigate("/about")}>შესახებ</span>
                      <span className="cursor-pointer hover:text-brand-yellow transition-colors" onClick={() => navigate("/students")}>სტუდენტები</span>
                    </div>
                  </motion.div>

                  {/* Hero — reflects editable fields */}
                  <motion.div className="mb-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
                    <motion.div
                      key={fields.heading}
                      className="text-base font-black mb-1"
                      style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.2 }}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {fields.heading}
                    </motion.div>
                    <motion.p
                      key={fields.description}
                      className="text-[9px] leading-relaxed mb-3"
                      style={{ color: "#585b70" }}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {fields.description}
                    </motion.p>
                    <motion.div
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-[9px] font-bold cursor-pointer"
                      style={{ background: "var(--gradient-primary)", color: "#1e1e2e" }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/contact")}
                    >
                      {fields.buttonText}
                      <span>→</span>
                    </motion.div>
                  </motion.div>

                  {/* Course cards */}
                  <motion.div className="grid grid-cols-3 gap-2 flex-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                    {[
                      { name: "Frontend", tech: "React", accent: "#89b4fa", emoji: "💻", link: "/courses/web-dev" },
                      { name: "Design", tech: "Figma", accent: "#f9e2af", emoji: "🎨", link: "/courses/design" },
                      { name: "IT PM", tech: "Agile", accent: "#a6e3a1", emoji: "⚙️", link: "/courses/it-pm" },
                    ].map((card, i) => (
                      <motion.div
                        key={card.name}
                        className="rounded-lg p-2.5 flex flex-col cursor-pointer"
                        style={{ background: "hsl(240, 12%, 12%)", border: `1px solid ${card.accent}22` }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + i * 0.12 }}
                        whileHover={{ borderColor: `${card.accent}66`, scale: 1.03, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(card.link)}
                      >
                        <div className="text-lg mb-1">{card.emoji}</div>
                        <div className="text-[10px] font-bold" style={{ color: "#cdd6f4" }}>{card.name}</div>
                        <div className="text-[8px]" style={{ color: card.accent }}>{card.tech}</div>
                        <div className="mt-auto pt-2">
                          <div className="h-[3px] rounded-full overflow-hidden" style={{ background: `${card.accent}15` }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: card.accent }}
                              initial={{ width: "0%" }}
                              animate={{ width: `${60 + i * 15}%` }}
                              transition={{ delay: 0.8 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Stats */}
                  <motion.div className="flex justify-between items-center mt-3 pt-2" style={{ borderTop: "1px solid hsl(240, 10%, 16%)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    {[
                      { v: "500K+", l: "მიზანი", c: "#f9e2af" },
                      { v: "40+", l: "პარტნიორი", c: "#a6e3a1" },
                      { v: "98%", l: "კმაყოფილება", c: "#89b4fa" },
                    ].map((s) => (
                      <div key={s.l} className="text-center">
                        <div className="text-[11px] font-bold" style={{ color: s.c }}>{s.v}</div>
                        <div className="text-[7px]" style={{ color: "#45475a" }}>{s.l}</div>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {phase < 2 && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[10px] font-mono" style={{ color: "#45475a" }}>
                    {phase === 0 ? "waiting..." : "compiling..."}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SketchCodeAnimation;
