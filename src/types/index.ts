export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Note {
  id: number | string;
  title: string;
  content: string;
  tag: NoteTag;
  color: number;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export type NoteTag = "work" | "personal" | "ideas" | "todo" | "journal";

export interface ChatMessage {
  role: "user" | "ai";
  text: string;
}