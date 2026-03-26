"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { useCallback, useEffect, useState } from "react";

import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  $getRoot,
} from "lexical";

import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";

import {
  $setBlocksType,
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";

import { Bold, Italic, Underline, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type BlockType = "paragraph" | "h1" | "h2" | "h3";

const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "Paragraph",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
};

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];

const PRESET_COLORS = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
];

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [fontSize, setFontSize] = useState(18);
  const [textColor, setTextColor] = useState("#000000");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getTopLevelElement();

      if ($isHeadingNode(element)) {
        setBlockType(element.getTag() as BlockType);
      } else {
        setBlockType("paragraph");
      }

      const currentSize = $getSelectionStyleValueForProperty(
        selection,
        "font-size",
        "18px",
      );
      setFontSize(parseInt(currentSize, 10) || 18);

      setTextColor(
        $getSelectionStyleValueForProperty(selection, "color", "#000000"),
      );
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $updateToolbar();
      });
    });
  }, [editor, $updateToolbar]);

  const handleBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const handleItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  const handleUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  };

  const handleBlockType = (type: BlockType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (type === "paragraph") {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () => $createHeadingNode(type));
      }
    });
  };

  const handleFontSize = (newSize: number) => {
    const clamped = Math.min(32, Math.max(12, newSize));
    setFontSize(clamped);
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      $patchStyleText(selection, { "font-size": `${clamped}px` });
    });
  };

  const handleTextColor = (color: string) => {
    setTextColor(color);
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      $patchStyleText(selection, { color });
    });
  };

  return (
    <div className="sticky bottom-6 flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1 px-3 py-2 rounded-xl border border-border bg-background/95 backdrop-blur shadow-lg">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-medium w-28"
            >
              {BLOCK_LABELS[blockType]}
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {(Object.keys(BLOCK_LABELS) as BlockType[]).map((type) => (
              <DropdownMenuItem
                key={type}
                onClick={() => handleBlockType(type)}
              >
                {BLOCK_LABELS[type]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-4 bg-border mx-1" />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-xs"
            onClick={() => handleFontSize(fontSize - 2)}
          >
            −
          </Button>
          <span className="text-xs w-8 text-center">{fontSize}px</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-xs"
            onClick={() => handleFontSize(fontSize + 2)}
          >
            +
          </Button>
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 relative"
              aria-label="Text color"
            >
              <span className="text-xs font-bold flex flex-col items-center gap-0.5">
                A
                <span
                  className="w-3.5 h-0.5 rounded-full"
                  style={{ backgroundColor: textColor }}
                />
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="p-3 w-48">
            <p className="text-xs text-muted-foreground mb-2">Preset colors</p>
            <div className="grid grid-cols-5 gap-1 mb-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleTextColor(color)}
                  className="size-7 rounded-md border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  aria-label={color}
                />
              ))}
            </div>

            <p className="text-xs text-muted-foreground mb-2">Custom color</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => handleTextColor(e.target.value)}
                className="size-7 rounded-md border border-border bg-transparent p-0 cursor-pointer"
              />
              <span className="text-xs text-muted-foreground font-mono">
                {textColor}
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-4 bg-border mx-1" />

        <Button
          variant={isBold ? "secondary" : "ghost"}
          size="icon"
          className="size-7"
          onClick={handleBold}
        >
          <Bold className="size-3.5" />
        </Button>
        <Button
          variant={isItalic ? "secondary" : "ghost"}
          size="icon"
          className="size-7"
          onClick={handleItalic}
        >
          <Italic className="size-3.5" />
        </Button>
        <Button
          variant={isUnderline ? "secondary" : "ghost"}
          size="icon"
          className="size-7"
          onClick={handleUnderline}
        >
          <Underline className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
