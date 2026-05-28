import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getCurrentProfile } from "@/lib/data";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = getCurrentProfile();

  return (
    <div className="relative min-h-screen">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-radial-fade opacity-60" />
      <Navbar
        user={{
          username: profile.username,
          avatar: profile.avatar,
          totalPoints: profile.totalPoints,
        }}
      />
      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 md:pb-12 lg:px-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
