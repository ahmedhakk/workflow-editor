import { useLanguage } from "@hooks";
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
  const { dir, isArabic } = useLanguage();

  useEffect(() => {
    if (!open) return;

    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();

      const left = isArabic ? r.left - 12 : r.right + 12;
      const top = r.top + r.height / 2;

      setPos({ left, top });
    };

    update();
  }, [open, isArabic]);

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
              transform: isArabic
                ? "translate(-100%, -50%)"
                : "translateY(-50%)",
            }}
          >
            <div
              dir={dir}
              className="relative max-w-80 rounded-md border border-ui-border bg-ui-card px-3 py-1.5 text-xs text-ui-text shadow-panel"
            >
              <div className="truncate">{content}</div>

              <div
                className={`
                absolute top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-ui-border bg-ui-card
                ${
                  isArabic
                    ? "-right-1 border-t border-r"
                    : "-left-1 border-b border-l"
                }
              `}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
