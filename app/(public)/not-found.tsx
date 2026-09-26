import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicNotFound() {
  return (
    <main className="min-h-[70vh] bg-brand-cream flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center py-16 sm:py-24 space-y-6">
        <p className="font-script text-4xl sm:text-5xl text-brand-warm-brown font-bold -rotate-2">
          Oops!
        </p>
        <h1 className="font-display text-7xl sm:text-8xl text-brand-dark-brown font-black leading-none">
          404
        </h1>
        <p className="text-on-surface-variant text-base sm:text-lg">
          The product or page you&apos;re looking for seems to have wandered off. Let&apos;s
          get you back to something stylish.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/shop">Browse Collection →</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
