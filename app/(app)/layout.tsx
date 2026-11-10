"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconCalendar,
  IconChartBar,
  IconSettings,
  IconHome,
} from "@tabler/icons-react";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import OfflineBanner from "@/components/shared/OfflineBanner";
import AddTaskModal from "@/modules/items/AddTaskModal";
import NewFolderModal from "@/modules/folders/NewFolderModal";
import IconRail from "@/components/layout/IconRail";
import TaskSwitcher from "@/components/layout/TaskSwitcher";
import AuroraBackground from "@/components/layout/AuroraBackground";

const MOBILE_NAV = [
  { href: "/home", label: "Home", icon: IconHome },
  { href: "/dashboard", label: "Stats", icon: IconLayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: IconCalendar },
  { href: "/settings", label: "Settings", icon: IconSettings },
];

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
      <AuroraBackground />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flex: 1, minHeight: "100vh" }}>
        <IconRail />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <header
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "16px 32px",
              gap: 12,
              borderBottom: "0.5px solid var(--border-glass)",
              background: "rgba(5,8,10,0.4)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              position: "sticky",
              top: 0,
              zIndex: 40,
            }}
          >
            <TaskSwitcher />
          </header>

          <main
            style={{
              flex: 1,
              padding: 32,
              maxWidth: 1100,
              margin: "0 auto",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              paddingBottom: 120,
            }}
          >
            <OfflineBanner />
            <ErrorBoundary label="View">{children}</ErrorBoundary>
          </main>
        </div>

        <nav
          className="md:hidden"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(5,8,10,0.8)",
            borderTop: "0.5px solid var(--border-glass)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex",
            justifyContent: "space-around",
            padding: "10px 0",
            zIndex: 100,
          }}
        >
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  color: active ? "#5eead4" : "var(--text-muted)",
                  fontSize: 10,
                  textDecoration: "none",
                  padding: "4px 8px",
                }}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <AddTaskModal />
      <NewFolderModal />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "rgba(5,8,10,0.4)" }}>{children}</div>}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}