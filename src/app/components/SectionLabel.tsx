export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
      {children}
    </p>
  );
}
