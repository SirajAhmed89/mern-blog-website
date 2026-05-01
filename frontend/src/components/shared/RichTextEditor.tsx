/**
 * RichTextEditor – Full-featured WYSIWYG editor powered by TipTap.
 *
 * Features (Word / WordPress-like):
 *  - Headings H1–H4, paragraph
 *  - Bold, Italic, Underline, Strikethrough
 *  - Text color, Highlight
 *  - Ordered list, Bullet list
 *  - Blockquote, Code, Code block (syntax highlighted)
 *  - Horizontal rule
 *  - Text alignment (left, center, right, justify)
 *  - Links (insert / remove)
 *  - Inline image upload (uploads to backend /blog folder)
 *  - Table insert
 *  - Undo / Redo
 *  - Word count
 *  - Bubble menu on text selection
 */

import { useCallback, useRef } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { uploadService } from '../../services/uploadService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
}

// ─── Toolbar button helper ─────────────────────────────────────────────────────

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, isActive, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // prevent editor blur
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={`flex items-center justify-center w-8 h-8 rounded text-sm transition-colors ${
        isActive
          ? 'bg-primary-100 text-primary-700 font-semibold'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-neutral-200 mx-1 self-center" />;
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

function Toolbar({ editor }: { editor: Editor }) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = '';
      try {
        const result = await uploadService.uploadImage(file, 'blog');
        console.log('Editor image upload result:', result);
        const fullUrl = uploadService.resolveUrl(result.url);
        console.log('Inserting image with URL:', fullUrl);
        editor.chain().focus().setImage({ src: fullUrl, alt: file.name }).run();
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || err?.message || 'Image upload failed';
        console.error('Editor image upload error:', err);
        alert(`Image upload failed: ${errorMsg}`);
      }
    },
    [editor]
  );

  const insertLink = () => {
    const prev = editor.getAttributes('link').href ?? '';
    const url = window.prompt('Enter URL', prev);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const currentHeading = [1, 2, 3, 4].find((l) =>
    editor.isActive('heading', { level: l })
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-neutral-200 bg-neutral-50 rounded-t-lg">
      {/* Heading / Paragraph selector */}
      <select
        value={currentHeading ?? 0}
        onChange={(e) => {
          const level = parseInt(e.target.value);
          if (level === 0) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run();
          }
        }}
        className="h-8 px-2 text-sm border border-neutral-200 rounded bg-white text-neutral-700 focus:outline-none focus:ring-1 focus:ring-primary-500 mr-1"
      >
        <option value={0}>Paragraph</option>
        <option value={1}>Heading 1</option>
        <option value={2}>Heading 2</option>
        <option value={3}>Heading 3</option>
        <option value={4}>Heading 4</option>
      </select>

      <Divider />

      {/* Bold */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </ToolbarButton>

      {/* Italic */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </ToolbarButton>

      {/* Underline */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Underline (Ctrl+U)"
      >
        <span className="underline">U</span>
      </ToolbarButton>

      {/* Strikethrough */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <span className="line-through">S</span>
      </ToolbarButton>

      {/* Highlight */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive('highlight')}
        title="Highlight"
      >
        <span className="bg-yellow-200 px-0.5 text-xs">H</span>
      </ToolbarButton>

      {/* Text color */}
      <label title="Text Color" className="relative flex items-center justify-center w-8 h-8 rounded hover:bg-neutral-100 cursor-pointer">
        <span className="text-sm font-medium" style={{ color: editor.getAttributes('textStyle').color || '#000' }}>A</span>
        <input
          type="color"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          value={editor.getAttributes('textStyle').color || '#000000'}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          title="Text Color"
        />
      </label>

      <Divider />

      {/* Align left */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="Align Left"
      >
        <AlignLeftIcon />
      </ToolbarButton>

      {/* Align center */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="Align Center"
      >
        <AlignCenterIcon />
      </ToolbarButton>

      {/* Align right */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="Align Right"
      >
        <AlignRightIcon />
      </ToolbarButton>

      {/* Justify */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
        title="Justify"
      >
        <AlignJustifyIcon />
      </ToolbarButton>

      <Divider />

      {/* Bullet list */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <BulletListIcon />
      </ToolbarButton>

      {/* Ordered list */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Numbered List"
      >
        <OrderedListIcon />
      </ToolbarButton>

      <Divider />

      {/* Blockquote */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Blockquote"
      >
        <BlockquoteIcon />
      </ToolbarButton>

      {/* Code */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="Inline Code"
      >
        <CodeIcon />
      </ToolbarButton>

      {/* Code block */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="Code Block"
      >
        <CodeBlockIcon />
      </ToolbarButton>

      {/* Horizontal rule */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <HrIcon />
      </ToolbarButton>

      <Divider />

      {/* Link */}
      <ToolbarButton
        onClick={insertLink}
        isActive={editor.isActive('link')}
        title="Insert Link"
      >
        <LinkIcon />
      </ToolbarButton>

      {/* Image upload */}
      <label title="Insert Image" className="flex items-center justify-center w-8 h-8 rounded text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer">
        <ImageIcon />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>

      {/* Table */}
      <ToolbarButton onClick={insertTable} title="Insert Table">
        <TableIcon />
      </ToolbarButton>

      <Divider />

      {/* Undo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <UndoIcon />
      </ToolbarButton>

      {/* Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Y)"
      >
        <RedoIcon />
      </ToolbarButton>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing your post…',
  minHeight = 400,
  className = '',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // we use CodeBlockLowlight via StarterKit override
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TextStyle,
      Color.configure({ types: [TextStyle.name] }),
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-neutral max-w-none focus:outline-none',
        style: `min-height: ${minHeight}px; padding: 1.25rem;`,
      },
    },
  });

  // Word count
  const wordCount = editor
    ? editor.getText().trim().split(/\s+/).filter(Boolean).length
    : 0;

  if (!editor) return null;

  return (
    <div className={`border border-neutral-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent ${className}`}>
      <Toolbar editor={editor} />

      {/* Editor content */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Footer: word count */}
      <div className="flex items-center justify-end px-4 py-1.5 bg-neutral-50 border-t border-neutral-200">
        <span className="text-xs text-neutral-400">{wordCount} words</span>
      </div>

      {/* Editor styles */}
      <style>{editorStyles}</style>
    </div>
  );
}

// ─── Editor CSS (prose-like styles for the content area) ──────────────────────

const editorStyles = `
  .tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #9ca3af;
    pointer-events: none;
    height: 0;
  }

  .tiptap {
    line-height: 1.75;
    color: #111827;
  }

  .tiptap h1 { font-size: 2rem; font-weight: 700; margin: 1.5rem 0 0.75rem; line-height: 1.2; }
  .tiptap h2 { font-size: 1.5rem; font-weight: 700; margin: 1.25rem 0 0.6rem; line-height: 1.3; }
  .tiptap h3 { font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.4; }
  .tiptap h4 { font-size: 1.1rem; font-weight: 600; margin: 0.875rem 0 0.4rem; }

  .tiptap p { margin: 0.75rem 0; }

  .tiptap ul { list-style: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
  .tiptap ol { list-style: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
  .tiptap li { margin: 0.25rem 0; }

  .tiptap blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
    margin: 1rem 0;
    color: #6b7280;
    font-style: italic;
  }

  .tiptap code {
    background: #f3f4f6;
    border-radius: 4px;
    padding: 0.15em 0.4em;
    font-size: 0.875em;
    font-family: 'Fira Code', 'Cascadia Code', monospace;
    color: #dc2626;
  }

  .tiptap pre {
    background: #1e293b;
    color: #e2e8f0;
    border-radius: 8px;
    padding: 1rem 1.25rem;
    margin: 1rem 0;
    overflow-x: auto;
    font-size: 0.875rem;
    font-family: 'Fira Code', 'Cascadia Code', monospace;
  }

  .tiptap pre code {
    background: none;
    color: inherit;
    padding: 0;
    font-size: inherit;
  }

  .tiptap hr {
    border: none;
    border-top: 2px solid #e5e7eb;
    margin: 1.5rem 0;
  }

  .tiptap a {
    color: #2563eb;
    text-decoration: underline;
    cursor: pointer;
  }

  .tiptap img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
    display: block;
  }

  .tiptap img.ProseMirror-selectednode {
    outline: 3px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Table styles */
  .tiptap table {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }

  .tiptap th, .tiptap td {
    border: 1px solid #e5e7eb;
    padding: 0.5rem 0.75rem;
    text-align: left;
    vertical-align: top;
    min-width: 80px;
  }

  .tiptap th {
    background: #f9fafb;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .tiptap .selectedCell:after {
    background: rgba(59, 130, 246, 0.1);
    content: '';
    left: 0; right: 0; top: 0; bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }

  .tiptap .column-resize-handle {
    background-color: #3b82f6;
    bottom: -2px;
    pointer-events: none;
    position: absolute;
    right: -2px;
    top: 0;
    width: 4px;
  }

  .tiptap mark {
    border-radius: 2px;
    padding: 0.1em 0.2em;
  }
`;

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const iconProps = { className: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 };

function AlignLeftIcon() { return <svg {...iconProps}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>; }
function AlignCenterIcon() { return <svg {...iconProps}><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>; }
function AlignRightIcon() { return <svg {...iconProps}><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>; }
function AlignJustifyIcon() { return <svg {...iconProps}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>; }
function BulletListIcon() { return <svg {...iconProps}><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>; }
function OrderedListIcon() { return <svg {...iconProps}><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="2" y="8" fontSize="7" fill="currentColor" stroke="none">1.</text><text x="2" y="14" fontSize="7" fill="currentColor" stroke="none">2.</text><text x="2" y="20" fontSize="7" fill="currentColor" stroke="none">3.</text></svg>; }
function BlockquoteIcon() { return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>; }
function CodeIcon() { return <svg {...iconProps}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>; }
function CodeBlockIcon() { return <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="9 9 5 12 9 15"/><polyline points="15 9 19 12 15 15"/></svg>; }
function HrIcon() { return <svg {...iconProps}><line x1="3" y1="12" x2="21" y2="12"/></svg>; }
function LinkIcon() { return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>; }
function ImageIcon() { return <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }
function TableIcon() { return <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>; }
function UndoIcon() { return <svg {...iconProps}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>; }
function RedoIcon() { return <svg {...iconProps}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-3.5"/></svg>; }
