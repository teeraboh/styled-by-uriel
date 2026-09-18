import { VendorShell } from "@/components/vendor/vendor-shell";

export const metadata = {
  title: "Vendor Dashboard | Styled by Uriel",
  description: "Boutique atelier sales, orders, and product dispatch management.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VendorShell>{children}</VendorShell>;
}
