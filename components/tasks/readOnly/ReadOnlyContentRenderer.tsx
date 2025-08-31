"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";

interface Props {
  content?: JSON;
}

export const ReadOnlyContentRenderer = ({ content }: Props) => {
  const editor = useEditor({
    editorProps: {
      handleDrop: () => {
        return false;
      },
      attributes: {
        class:
          "focus:outline-none prose prose-headings:text-secondary-foreground prose-p:text-secondary-foreground prose-strong:text-secondary-foreground prose-a:text-primary prose-a:no-underline prose-a:cursor-pointer w-full focus-visible:outline-none rounded-md max-w-none prose-code:text-secondary-foreground prose-code:bg-muted prose-ol:text-secondary-foreground prose-ul:text-secondary-foreground prose-li:marker:text-secondary-foreground prose-li:marker:font-bold prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg prose-p:text-base prose-headings:line-clamp-1 prose-headings:mt-0 prose-p:my-2",
      },
    },
    editable: false, // Make it read-only
    extensions: [
      StarterKit.configure({
        dropcursor: {
          class: "text-primary",
        },
      }),
      Underline,
      Link,
      Color,
      TextStyle,
      Image,
    ],
    content: content ? content : ``,
  });

  if (!editor) {
    return null;
  }

  // Check if content is empty
  const isEmpty = !content || (typeof content === 'object' && Object.keys(content).length === 0);

  if (isEmpty) {
    return (
      <div className="w-full min-h-[200px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">No content available</p>
          <p className="text-sm">This task doesn't have any content yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  );
};
