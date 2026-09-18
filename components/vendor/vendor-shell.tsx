"use client";

import { useState } from "react";
import { VendorSidebar } from "./vendor-sidebar";
import { VendorHeader } from "./vendor-header";

export function VendorShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fff8f6] text-[#221a16] antialiased">
      {/* Fixed Sidebar */}
      <VendorSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area shifted right on desktop */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Fixed Top Header */}
        <VendorHeader onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
}
