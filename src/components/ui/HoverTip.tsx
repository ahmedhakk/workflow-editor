import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  content: string;
  children: React.ReactNode;
};

export default function HoverTip({ content, children }: Props) {
  const id = useId();
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;

    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();

      // Tooltip to the right, vertically centered
      const left = r.right + 12;
      const top = r.top + r.height / 2;

      setPos({ left, top });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  return (
    <>
      <div
        ref={anchorRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="relative"
        data-hovertip={id}
      >
        {children}
      </div>

      {open &&
        createPortal(
          <div
            className="pointer-events-none fixed z-99999"
            style={{
              left: pos.left,
              top: pos.top,
              transform: "translateY(-50%)",
            }}
          >
            <div className="relative max-w-80 rounded-md border border-ui-border bg-ui-card px-3 py-1.5 text-xs text-ui-text shadow-panel">
              <div className="truncate">{content}</div>
              <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-b border-l border-ui-border bg-ui-card" />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
