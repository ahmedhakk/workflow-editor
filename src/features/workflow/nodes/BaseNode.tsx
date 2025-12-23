import { Handle, Position } from "reactflow";

type Props = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  hasTarget?: boolean;
  hasSource?: boolean;
};

export default function BaseNode({
  title,
  subtitle,
  icon,
  selected,
  hasTarget = true,
  hasSource = true,
}: Props) {
  return (
    <div
      className={[
        "min-w-55 rounded-xl border bg-zinc-950 px-3 py-2 shadow-sm",
        selected ? "border-zinc-500" : "border-zinc-800",
      ].join(" ")}
    >
      {hasTarget && (
        <Handle
          id="in"
          type="target"
          position={Position.Top}
          className="h-2.5! w-2.5! border-2! border-zinc-200! bg-zinc-950!"
        />
      )}

      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-200">
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-zinc-100">{title}</div>
          {subtitle ? (
            <div className="mt-0.5 text-xs text-zinc-400">{subtitle}</div>
          ) : (
            <div className="mt-0.5 text-xs text-zinc-500">Not configured</div>
          )}
        </div>
      </div>

      {hasSource && (
        <Handle
          id="out"
          type="source"
          position={Position.Bottom}
          className="h-2.5! w-2.5! border-2! border-zinc-200! bg-zinc-950!"
        />
      )}
    </div>
  );
}
