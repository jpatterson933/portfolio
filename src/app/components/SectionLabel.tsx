export function SectionLabel({
  children,
  number,
}: {
  children: React.ReactNode;
  number?: string;
}) {
  return (
    <p className="section-label">
      {number && <span aria-hidden="true">{number} / </span>}
      {children}
    </p>
  );
}
