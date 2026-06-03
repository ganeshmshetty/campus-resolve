"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, LogOut, PlusCircle, LayoutDashboard, Activity, Map as MapIcon } from "lucide-react";
import { signOutAction } from "@/app/reports/actions";
import { useRouter } from "next/navigation";

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutAction();
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
      <nav className="ml-auto flex gap-1 sm:gap-2 items-center">
        <Link href="/dashboard">
          <Button
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            size="sm"
            className="font-medium h-9 px-3"
          >
            <LayoutDashboard className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline-block">Dashboard</span>
          </Button>
        </Link>
        <Link href="/feed">
          <Button
            variant={pathname === "/feed" ? "secondary" : "ghost"}
            size="sm"
            className="font-medium h-9 px-3"
          >
            <Activity className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline-block">Feed</span>
          </Button>
        </Link>
        <Link href="/map">
          <Button
            variant={pathname === "/map" ? "secondary" : "ghost"}
            size="sm"
            className="font-medium h-9 px-3"
          >
            <MapIcon className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline-block">Map</span>
          </Button>
        </Link>
        <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
        <Link href="/reports/new" className="hidden sm:block">
          <Button
            variant="default"
            size="sm"
            className="font-medium h-9 px-4 shadow-sm"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>Report</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="font-medium text-muted-foreground hover:text-foreground h-9 px-3"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </nav>
    </header>
  );
}
