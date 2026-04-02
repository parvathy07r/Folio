"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { $createImageNode, ImageNode } from "../nodes/ImageNode";

export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const { url } = await response.json();

      editor.update(() => {
        const imageNode = $createImageNode({
          src: url,
          altText: file.name,
        });
        $insertNodes([imageNode]);
      });
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={handleClick}
        disabled={isUploading}
        title="Insert image"
      >
        {isUploading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <ImagePlus className="size-3.5" />
        )}
      </Button>
    </>
  );
}

export { ImageNode };
