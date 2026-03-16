"use client";
import { getAvatar } from "@/utils";
import Link from "next/link";

const NAV_ITEMS = [
  { id: "Home", icon: "⌂", label: "Home" },
  { id: "Notes", icon: "◈", label: "Notes" },
  { id: "AI Assistant", icon: "◎", label: "AI Assistant" },
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
          return (
            <Link
              key={item.id}
              href="#"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-card hover:text-text transition-all`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Tags ── */}
      <p className="text-[11px] font-bold tracking-widest text-subtle uppercase px-3 mt-5 mb-1">
        Tags
      </p>
      <div className="flex flex-col gap-0.5">
        {TAGS.map((tag) => (
          <Link
            key={tag.label}
            href="#"
            onClick={() => console.log(`Tag clicked: ${tag.label}`)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-subtext hover:bg-card hover:text-text transition-all"
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: tag.color }}
            />
            {tag.label}
          </Link>
        ))}
      </div>

      {/* ── New Note button ── */}
      <div className="mt-auto pt-4">
        <button
          onClick={() => console.log("New Note clicked")}
          className="w-full bg-purple text-card font-semibold py-2.5 rounded-xl text-sm hover:bg-purple/90 transition-all shadow-lg shadow-purple/20"
        >
          + New Note
        </button>
      </div>

      {/* ── User profile + logout ── */}
      <div
        onClick={() => console.log("Logout clicked")}
        className="mt-3 flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-card transition-all group"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple to-sky flex items-center justify-center text-xs font-bold text-card flex-shrink-0">
          {getAvatar(MOCK_USER.name)}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text truncate">
            {MOCK_USER.name}
          </p>
          <p className="text-xs text-subtle truncate">{MOCK_USER.email}</p>
        </div>
        {/* Logout icon */}
        <span className="text-subtle text-xs group-hover:text-rose transition-colors">
          ⏻
        </span>
      </div>
    </div>
  );
}
