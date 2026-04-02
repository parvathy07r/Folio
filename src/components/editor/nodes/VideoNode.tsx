"use client";

import type { JSX } from "react";
import {
  $applyNodeReplacement,
  DecoratorNode,
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { Suspense } from "react";

export interface VideoPayload {
  src: string;
  key?: NodeKey;
}

export type SerializedVideoNode = Spread<
  {
    src: string;
  },
  SerializedLexicalNode
>;

function VideoComponent({ src }: { src: string }) {
  return (
    <div className="relative my-4 flex justify-center">
      <video
        src={src}
        controls
        className="rounded-lg shadow-md max-w-full"
        style={{ maxHeight: "400px" }}
      />
    </div>
  );
}

export class VideoNode extends DecoratorNode<JSX.Element> {
  __src: string;

  static getType(): string {
    return "video";
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(node.__src, node.__key);
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    const { src } = serializedNode;
    return $createVideoNode({ src });
  }

  static importDOM(): DOMConversionMap | null {
    return {
      video: () => ({
        conversion: (domNode: Node) => {
          if (domNode instanceof HTMLVideoElement) {
            const src = domNode.src;
            return {
              node: $createVideoNode({ src }),
            };
          }
          return null;
        },
        priority: 0,
      }),
    };
  }

  constructor(src: string, key?: NodeKey) {
    super(key);
    this.__src = src;
  }

  exportJSON(): SerializedVideoNode {
    return {
      type: "video",
      version: 1,
      src: this.__src,
    };
  }

  exportDOM(): DOMExportOutput {
    const video = document.createElement("video");
    video.setAttribute("src", this.__src);
    video.setAttribute("controls", "true");
    return { element: video };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.video;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <VideoComponent src={this.__src} />
      </Suspense>
    );
  }
}

export function $createVideoNode({ src, key }: VideoPayload): VideoNode {
  return $applyNodeReplacement(new VideoNode(src, key));
}

export function $isVideoNode(
  node: LexicalNode | null | undefined,
): node is VideoNode {
  return node instanceof VideoNode;
}
