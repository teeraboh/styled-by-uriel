import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AddToCartToast } from "@/components/cart/add-to-cart-toast";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <AddToCartToast />
    </>
  );
}
