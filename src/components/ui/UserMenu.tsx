import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { User, Settings, Bell, Globe, LogOut } from "lucide-react";
import { useToastStore } from "@/components/ui/toast/toast.store";
import { useLanguage } from "@hooks";

type UserMenuProps = {
  /** Where the menu is rendered - affects positioning */
  position?: "sidebar" | "header";
  /** Trigger element - if not provided, uses default user avatar button */
  trigger?: React.ReactNode;
  /** Custom class for the trigger wrapper */
  triggerClassName?: string;
};

export default function UserMenu({
  position = "sidebar",
  trigger,
  triggerClassName = "",
}: UserMenuProps) {
  const { t } = useTranslation();
  const { isArabic, changeLanguage } = useLanguage();
  const showToast = useToastStore((s) => s.success);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggleLanguage = () => {
    changeLanguage(isArabic ? "en" : "ar");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Position classes based on where menu is rendered
  const getMenuPositionClasses = () => {
    if (position === "header") {
      // For header: dropdown below, aligned to end
      return isArabic ? "top-full mt-2 left-0" : "top-full mt-2 right-0";
    }
    // For sidebar: popup above
    return isArabic ? "bottom-full mb-2 right-0" : "bottom-full mb-2 left-0";
  };

  const defaultTrigger = (
    <div className="h-9 w-9 rounded-full border border-ui-border bg-ui-card hover:bg-ui-hover flex items-center justify-center cursor-pointer">
      <User className="h-4 w-4" />
    </div>
  );

  return (
    <div className={`relative ${triggerClassName}`}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen((v) => !v)}
        className="cursor-pointer"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {trigger || defaultTrigger}
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile/touch */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <div
            ref={menuRef}
            className={`absolute z-50 w-72 rounded-xl border border-ui-border bg-ui-panel shadow-xl ${getMenuPositionClasses()}`}
          >
            {/* User info header */}
            <div className="p-3 border-b border-ui-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 border border-ui-border flex items-center justify-center">
                  <span className="text-sm font-semibold">AH</span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">ahmed</div>
                  <div className="text-xs text-ui-muted truncate">
                    ahmed@example.com
                  </div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-2">
              <button
                onClick={() => {
                  showToast(t("toasts.profileLater"));
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-ui-hover cursor-pointer"
              >
                <User className="h-4 w-4" />
                {t("user.profile")}
              </button>

              <button
                onClick={() => {
                  showToast(t("toasts.changePasswordLater"));
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-ui-hover cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                {t("user.changePassword")}
              </button>

              <button
                onClick={() => {
                  showToast(t("toasts.notifyMeLater"));
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-ui-hover cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                {t("user.notifyMe")}
              </button>

              <div className="my-2 border-t border-ui-border" />

              {/* Language toggle */}
              <div className="px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-ui-muted" />
                  {t("user.english")}
                </div>

                <button
                  onClick={toggleLanguage}
                  className={[
                    "h-6 w-10 rounded-full border border-ui-border transition relative cursor-pointer",
                    isArabic ? "bg-ui-card" : "bg-emerald-500/30",
                  ].join(" ")}
                  aria-label="Toggle language"
                >
                  <span
                    className={[
                      "absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white/80 transition",
                      isArabic ? "left-1" : "left-5",
                    ].join(" ")}
                  />
                </button>
              </div>

              <div className="my-2 border-t border-ui-border" />

              <button
                onClick={() => {
                  showToast(t("toasts.logoutLater"));
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                {t("user.logOut")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
