interface FieldErrorProps {
  error?: string | null;
  className?: string;
}

export default function FieldError({ error, className = "" }: FieldErrorProps) {
  if (!error) return null;
  return (
    <div className={["mt-1 text-xs text-red-200", className].join(" ")}>
      {error}
    </div>
  );
}
