export default function HoverTip({ content }: { content: string }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-full opacity-0 transition-all duration-150 group-hover:opacity-100 group-hover:-translate-y-[115%]">
      <div className="rounded-md bg-zinc-100 px-3 py-1.5 text-xs text-zinc-900 shadow-lg">
        {content}
        <div className="absolute left-1/2 top-[90%] h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-100 -z-50" />
      </div>
    </div>
  );
}
