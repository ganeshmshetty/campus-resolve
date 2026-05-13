import { DashboardNav } from "@/components/layout/nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20">
      <DashboardNav />
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
