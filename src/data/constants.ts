import { Note } from "@/types";

export const TAG_COLORS: Record<string, string> = {
  work: "#89b4fa",
  personal: "#a6e3a1",
  ideas: "#fab387",
  todo: "#f38ba8",
  journal: "#cba6f7",
};

export const NOTE_ACCENT_COLORS = [
  "#cba6f7",
  "#f38ba8",
  "#94e2d5",
  "#fab387",
  "#89b4fa",
];


export const MOCK_NOTES: Note[] = [
  {
    id: 1,
    title: "Welcome to Folio",
    content:
      "This is your personal note space. Start writing anything you want.",
    tag: "personal",
    color: 0,
    pinned: true,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 60000 * 5),
    userId: 1,
  },
  {
    id: 2,
    title: "Project ideas",
    content: "- Build a habit tracker\n- Learn Rust\n- Read more books",
    tag: "ideas",
    color: 4,
    pinned: false,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 60000 * 60),
    userId: 1,
  },
  {
    id: 3,
    title: "Shopping list",
    content: "Eggs, milk, bread, coffee beans",
    tag: "personal",
    color: 3,
    pinned: false,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 60000 * 120),
    userId: 1,
  },
  {
    id: 4,
    title: "Q2 Goals",
    content: "Ship the MVP, hire two engineers, close Series A",
    tag: "work",
    color: 1,
    pinned: false,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 60000 * 200),
    userId: 1,
  },
];
