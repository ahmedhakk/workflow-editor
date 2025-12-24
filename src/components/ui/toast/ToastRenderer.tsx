import { useToastStore } from "@/components/ui/toast/toast.store";

export default function ToastRenderer() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-3 left-1/2 z-50 -translate-x-1/2 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => remove(toast.id)}
          className={[
            "cursor-pointer rounded-md px-4 py-2 text-sm font-medium shadow-lg",
            "border backdrop-blur",
            toast.type === "success"
              ? "border-green-800 bg-green-950/90 text-green-100"
              : "border-red-800 bg-red-950/90 text-red-100",
          ].join(" ")}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
