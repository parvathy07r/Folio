import { HeadingNode } from "@lexical/rich-text";
import EditorTheme from "./EditorTheme";
import { EditorState } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";

interface Props {
  initialContent: string;
  onchange: (content: string) => void;
}
export default function Editor({ initialContent, onchange }: Props) {
  const initialConfig = {
    namespace: "NoteEditor",
    theme: EditorTheme,
    nodes: [HeadingNode],
    onError: (error: Error) => console.error(error),
    editorState: initialContent || null,
  };
  const handleChange = (editorState: EditorState) => {
    const json = JSON.stringify(editorState.toJSON());
    onchange(json);
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative flex flex-col h-full">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="flex-1 outline-none px-16 py-10 text-black ..." />
          }
          placeholder={
            <div className="absolute top-10 left-16 text-muted-foreground pointer-events-none select-none">
              Start writing...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />

        <OnChangePlugin onChange={handleChange} />

        <ToolbarPlugin />
      </div>
    </LexicalComposer>
  );
}
