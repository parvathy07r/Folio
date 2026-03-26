import { pool } from "@/lib/db";

function plainTextToLexicalJSON(text: string): string {
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const paragraphs = lines.length === 0 ? [""] : lines;

  const children = paragraphs.map((line) => ({
    children: line
      ? [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: line,
            type: "text",
            version: 1,
          },
        ]
      : [], 
    direction: "ltr",
    format: "",
    indent: 0,
    type: "paragraph",
    version: 1,
  }));

  const lexicalState = {
    root: {
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };

  return JSON.stringify(lexicalState);
}

function isAlreadyLexicalJSON(content: string): boolean {
  if (!content) return false;
  try {
    const parsed = JSON.parse(content);
    return !!parsed?.root;
  } catch {
    return false;
  }
}

async function migrate() {
  const dbCheck = await pool.query(`
    SELECT current_database(), current_schema();
  `);
  const tableCheck = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);

  const { rows: notes } = await pool.query(
    `SELECT id, content FROM notes`
  );

  let migrated = 0;
  let skipped = 0;

  for (const note of notes) {
    const content = note.content ?? "";

    if (isAlreadyLexicalJSON(content)) {
      skipped++;
      continue;
    }

    const newContent = plainTextToLexicalJSON(content);

    await pool.query(
      `UPDATE notes SET content = $1, updated_at = NOW() WHERE id = $2`,
      [newContent, note.id]
    );
    migrated++;
  }

  await pool.end();
}

migrate().catch((err) => {
  process.exit(1);
});