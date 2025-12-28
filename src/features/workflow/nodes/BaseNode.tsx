import { Handle, Position } from "reactflow";

type Variant =
  | "purple"
  | "blue"
  | "green"
  | "gray"
  | "orange"
  | "yellow"
  | "red";

const VARIANT_STYLES: Record<
  Variant,
  {
    border: string;
    glow: string;
    badgeBg: string;
    badgeText: string;
    handleBorder: string;
  }
> = {
  purple: {
    border: "border-purple-500/40",
    glow: "shadow-[0_0_0_1px_rgba(168,85,247,0.25),0_10px_25px_rgba(0,0,0,0.35)]",
    badgeBg: "bg-purple-500/15",
    badgeText: "text-purple-200",
    handleBorder: "!border-purple-300/80",
  },
  blue: {
    border: "border-sky-500/40",
    glow: "shadow-[0_0_0_1px_rgba(14,165,233,0.25),0_10px_25px_rgba(0,0,0,0.35)]",
    badgeBg: "bg-sky-500/15",
    badgeText: "text-sky-200",
    handleBorder: "!border-sky-300/80",
  },
  green: {
    border: "border-emerald-500/40",
    glow: "shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_10px_25px_rgba(0,0,0,0.35)]",
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-200",
    handleBorder: "!border-emerald-300/80",
  },
  orange: {
    border: "border-orange-500/40",
    glow: "shadow-[0_0_0_1px_rgba(249,115,22,0.25),0_10px_25px_rgba(0,0,0,0.35)]",
    badgeBg: "bg-orange-500/15",
    badgeText: "text-orange-200",
    handleBorder: "!border-orange-300/80",
  },
  gray: {
    border: "border-zinc-600/50",
    glow: "shadow-[0_0_0_1px_rgba(113,113,122,0.25),0_10px_25px_rgba(0,0,0,0.35)]",
    badgeBg: "bg-zinc-500/15",
    badgeText: "text-zinc-200",
    handleBorder: "!border-zinc-300/80",
  },
  yellow: {
    border: "border-yellow-500/40",
    glow: "shadow-[0_0_0_1px_rgba(234,179,8,0.25),0_10px_25px_rgba(0,0,0,0.35)]",
    badgeBg: "bg-yellow-500/15",
    badgeText: "text-yellow-200",
    handleBorder: "!border-yellow-300/80",
  },
  red: {
    border: "border-red-500/40",
    glow: "shadow-[0_0_0_1px_rgba(244,63,94,0.25),0_10px_25px_rgba(0,0,0,0.35)]",
    badgeBg: "bg-red-500/15",
    badgeText: "text-red-200",
    handleBorder: "!border-red-300/80",
  },
};

type Props = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  hasTarget?: boolean;
  hasSource?: boolean;
  variant?: Variant;
};

export default function BaseNode({
  title,
  subtitle,
  icon,
  selected,
  hasTarget = true,
  hasSource = true,
  variant = "gray",
}: Props) {
  const v = VARIANT_STYLES[variant];

  return (
    <div
      className={[
        "min-w-55 rounded-2xl border bg-zinc-950 px-3 py-2",
        v.border,
        v.glow,
        selected ? "ring-2 ring-zinc-400/60" : "",
      ].join(" ")}
    >
      {hasTarget && (
        <Handle
          id="in"
          type="target"
          position={Position.Left}
          className={["h-3! w-3! bg-zinc-950! border-2!", v.handleBorder].join(
            " "
          )}
        />
      )}

      <div className="flex items-start gap-2">
        <div
          className={[
            "mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border",
            "border-zinc-800",
            v.badgeBg,
            v.badgeText,
          ].join(" ")}
        >
          {icon}
        </div>

        <div className="flex-1">
          <div className="text-sm font-semibold text-zinc-100">{title}</div>
          {subtitle ? (
            <div className="mt-0.5 text-xs text-zinc-300/90">{subtitle}</div>
          ) : (
            <div className="mt-0.5 text-xs text-zinc-500">Not configured</div>
          )}
        </div>
      </div>

      {hasSource && (
        <Handle
          id="out"
          type="source"
          position={Position.Right}
          className={["h-3! w-3! bg-zinc-950! border-2!", v.handleBorder].join(
            " "
          )}
        />
      )}
    </div>
  );
}
