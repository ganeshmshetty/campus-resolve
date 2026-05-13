"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, LogOut, PlusCircle, LayoutDashboard } from "lucide-react";
import { signOutAction } from "@/app/reports/actions";
import { useRouter } from "next/navigation";

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutAction();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
      <Link className="flex items-center justify-center gap-2" href="/dashboard">
        <div className="bg-primary/10 p-1.5 rounded-md">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <span className="font-heading font-bold text-lg tracking-tight hidden sm:inline-block">
          CampusResolve
        </span>
      </Link>
      <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
        <Link href="/dashboard">
          <Button
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            size="sm"
            className="font-medium"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">Dashboard</span>
          </Button>
        </Link>
        <Link href="/reports/new">
          <Button
            variant={pathname === "/reports/new" ? "secondary" : "ghost"}
            size="sm"
            className="font-medium"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">New Report</span>
          </Button>
        </Link>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          className="font-medium text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline-block">Sign Out</span>
        </Button>
      </nav>
    </header>
  );
}
