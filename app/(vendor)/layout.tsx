export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Vendor dashboard layout — protected by middleware */}
      {children}
    </>
  );
}
