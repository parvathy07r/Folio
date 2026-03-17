"use client";
import { getAvatar } from "@/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Home, StickyNote, Bot, Plus, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { id: "Home", icon: Home, label: "Home", href: "/dashboard" },
  { id: "Notes", icon: StickyNote, label: "Notes", href: "/dashboard/notes" },
  {
    id: "AI Assistant",
    icon: Bot,
    label: "AI Assistant",
    href: "/dashboard/chat",
  },
];
const TAGS = [
  { label: "work", color: "#89b4fa" },
  { label: "personal", color: "#a6e3a1" },
  { label: "ideas", color: "#fab387" },
  { label: "todo", color: "#f38ba8" },
  { label: "journal", color: "#cba6f7" },
];
const MOCK_USER = {
  name: "Alex Rivera",
  email: "alex@example.com",
};
export default function Sidebar() {
  return (
    <div className="w-[220px] h-screen bg-surface border-r border-border flex flex-col flex-shrink-0 px-3 py-5">
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-3 mb-6">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple to-sky flex items-center justify-center text-sm text-card font-bold flex-shrink-0">
          ✦
        </div>
        <span className="text-base font-playfair font-bold text-text">
          Folio
        </span>
      </div>

      {/* ── Workspace nav ── */}
      <p className="text-[11px] font-bold tracking-widest text-subtle uppercase px-3 mb-1">
        WORKSPACE
      </p>
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className="justify-start gap-3 px-3 py-2.5 h-auto rounded-xl text-sm font-medium text-subtext hover:bg-card hover:text-text"
              render={<Link href={item.href} />}
            >
              <Icon className="size-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <Separator className="my-4" />

      {/* ── Tags ── */}
      <p className="text-[11px] font-bold tracking-widest text-subtle uppercase px-3 mb-1">
        Tags
      </p>
      <div className="flex flex-col gap-0.5">
        {TAGS.map((tag) => (
          <Button
            key={tag.label}
            variant="ghost"
            className="justify-start gap-3 px-3 py-2.5 h-auto rounded-xl text-sm font-medium text-subtext hover:bg-card hover:text-text"
            onClick={() => console.log(`Tag clicked: ${tag.label}`)}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: tag.color }}
            />
            {tag.label}
          </Button>
        ))}
      </div>

      {/* ── New Note button ── */}
      <div className="mt-auto pt-4">
        <Button
          onClick={() => console.log("New Note clicked")}
          className="w-full bg-purple text-card font-semibold py-2.5 h-auto rounded-xl text-sm hover:bg-purple/90 shadow-lg shadow-purple/20"
        >
          <Plus className="size-4" />
          New Note
        </Button>
      </div>

      {/* ── User profile + logout ── */}
      <div
        onClick={() => console.log("Logout clicked")}
        className="mt-3 flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-card transition-all group"
      >
        {/* Avatar */}
        <Avatar className="size-8">
          <AvatarFallback className="bg-gradient-to-br from-purple to-sky text-xs font-bold text-card">
            {getAvatar(MOCK_USER.name)}
          </AvatarFallback>
        </Avatar>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text truncate">
            {MOCK_USER.name}
          </p>
          <p className="text-xs text-subtle truncate">{MOCK_USER.email}</p>
        </div>
        {/* Logout icon */}
        <LogOut className="size-3.5 text-subtle group-hover:text-rose transition-colors" />
      </div>
    </div>
  );
}
