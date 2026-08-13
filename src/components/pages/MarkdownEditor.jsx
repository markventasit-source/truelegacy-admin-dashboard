import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { TableKit } from "@tiptap/extension-table";
import { Markdown } from "tiptap-markdown";
import { toast } from "sonner";
import { upload } from "@/api/uploadApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Image as ImageIcon,
  Video,
  Undo2,
  Redo2,
  Link2,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

const ToolbarButton = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={cn(
      "inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-gray-700 hover:bg-gray-100 disabled:opacity-40",
      active && "bg-gray-200 border-gray-300"
    )}
  >
    {children}
  </button>
);

const toYoutubeEmbed = (url) => {
  const trimmed = url.trim();
  const yt =
    trimmed.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
    ) || trimmed.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/);
  if (yt?.[1]) return `https://www.youtube.com/embed/${yt[1]}`;
  return null;
};

const toVimeoEmbed = (url) => {
  const match = url.trim().match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (match?.[1]) return `https://player.vimeo.com/video/${match[1]}`;
  return null;
};

const MarkdownEditor = ({
  value,
  onChange,
  placeholder = "Write content...",
}) => {
  const fileInputRef = useRef(null);
  const lastEmitted = useRef(value || "");
  const savedSelection = useRef(null);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [imageAlt, setImageAlt] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(3);
  const [tableWithHeader, setTableWithHeader] = useState(true);

  const emitMarkdown = useCallback(
    (editorInstance) => {
      const md = editorInstance.storage.markdown.getMarkdown();
      lastEmitted.current = md;
      onChange?.(md);
    },
    [onChange]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        // StarterKit already includes Link — configure it here to avoid duplicates
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: {
            class: "text-blue-600 underline underline-offset-2 cursor-pointer",
            rel: "noopener noreferrer",
            target: "_blank",
          },
        },
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: { class: "max-w-full rounded-md" },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: { class: "w-full aspect-video rounded-md" },
      }),
      TableKit.configure({
        table: { resizable: true },
      }),
      Placeholder.configure({ placeholder }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: value || "",
    editable: true,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[180px] px-3 py-2 focus:outline-none caret-gray-900",
      },
    },
    onUpdate: ({ editor: current }) => {
      emitMarkdown(current);
    },
    onSelectionUpdate: ({ editor: current }) => {
      const { from, to } = current.state.selection;
      savedSelection.current = { from, to };
    },
  });

  useEffect(() => {
    if (!editor) return;
    const incoming = value ?? "";
    if (incoming === lastEmitted.current) return;
    // Never replace content while the user is typing/selecting — that
    // destroys the caret and makes the editor feel uneditable.
    if (editor.isFocused) return;
    editor.commands.setContent(incoming, { emitUpdate: false });
    lastEmitted.current = incoming;
  }, [value, editor]);

  const applyHeading = (rawLevel) => {
    if (!editor) return;
    const level = Number(rawLevel);
    const selection = savedSelection.current;
    let chain = editor.chain().focus();
    if (selection && typeof selection.from === "number") {
      chain = chain.setTextSelection(selection);
    }
    if (!level) {
      chain.setParagraph().run();
    } else {
      chain.setHeading({ level }).run();
    }
    emitMarkdown(editor);
  };

  const openImageDialog = () => {
    setImageAlt("");
    setImageFile(null);
    setImagePreview("");
    setImageOpen(true);
  };

  const openVideoDialog = () => {
    setVideoUrl("");
    setVideoOpen(true);
  };

  const openTableDialog = () => {
    setTableRows(2);
    setTableCols(3);
    setTableWithHeader(true);
    setTableOpen(true);
  };

  const openLinkDialog = () => {
    setLinkUrl(editor?.getAttributes("link").href || "");
    setLinkOpen(true);
  };

  const insertTable = () => {
    if (!editor) return;
    const rows = Math.min(20, Math.max(1, Number(tableRows) || 2));
    const cols = Math.min(10, Math.max(1, Number(tableCols) || 3));
    editor
      .chain()
      .focus()
      .insertTable({
        rows,
        cols,
        withHeaderRow: tableWithHeader,
      })
      .run();
    emitMarkdown(editor);
    setTableOpen(false);
  };

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      toast.error("File must be under 1MB");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const insertImage = async () => {
    if (!editor) return;
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }
    setUploading(true);
    try {
      const res = await upload(imageFile);
      const url = res?.data;
      if (!url) {
        toast.error("Image upload failed");
        return;
      }
      editor
        .chain()
        .focus()
        .setImage({ src: url, alt: (imageAlt || "image").trim() })
        .run();
      emitMarkdown(editor);
      setImageOpen(false);
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const insertVideo = () => {
    if (!editor) return;
    const trimmed = videoUrl.trim();
    if (!trimmed) {
      toast.error("Please enter a video URL");
      return;
    }

    const youtube = toYoutubeEmbed(trimmed);
    if (youtube) {
      editor.commands.setYoutubeVideo({ src: youtube });
      emitMarkdown(editor);
      setVideoOpen(false);
      return;
    }

    const vimeo = toVimeoEmbed(trimmed);
    // Store non-YouTube embeds as markdown-friendly image nodes with special alt
    editor
      .chain()
      .focus()
      .setImage({
        src: vimeo || trimmed,
        alt: vimeo ? "vimeo" : "video",
      })
      .run();
    emitMarkdown(editor);
    setVideoOpen(false);
  };

  const applyLink = () => {
    if (!editor) return;
    const href = linkUrl.trim();
    if (!href) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    emitMarkdown(editor);
    setLinkOpen(false);
  };

  if (!editor) return null;

  const inTable = editor.isActive("table");
  const linkHref = editor.getAttributes("link").href || "";
  const hasLink = editor.isActive("link") && Boolean(linkHref);

  return (
    <>
      <div className="rounded-md border border-gray-300 bg-white overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
          <ToolbarButton
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <select
            className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700"
            title="Heading level"
            value={
              HEADING_LEVELS.find((level) =>
                editor.isActive("heading", { level })
              ) || ""
            }
            onMouseDown={() => {
              // Let the native dropdown open; remember caret/selection first
              // so heading still applies after the select steals focus.
              if (!editor) return;
              const { from, to } = editor.state.selection;
              savedSelection.current = { from, to };
            }}
            onChange={(e) => applyHeading(e.target.value)}
          >
            <option value="">Paragraph</option>
            {HEADING_LEVELS.map((level) => (
              <option key={level} value={level}>
                Heading {level}
              </option>
            ))}
          </select>
          <ToolbarButton
            title="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Quote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title={hasLink ? `Edit link (${linkHref})` : "Link"}
            active={hasLink}
            onClick={openLinkDialog}
          >
            <Link2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Insert table" onClick={openTableDialog}>
            <TableIcon className="h-4 w-4" />
          </ToolbarButton>
          {inTable && (
            <>
              <ToolbarButton
                title="Add column"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
              >
                <Plus className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Add row"
                onClick={() => editor.chain().focus().addRowAfter().run()}
              >
                <span className="text-[10px] font-semibold leading-none">+R</span>
              </ToolbarButton>
              <ToolbarButton
                title="Delete column"
                onClick={() => editor.chain().focus().deleteColumn().run()}
              >
                <span className="text-[10px] font-semibold leading-none">-C</span>
              </ToolbarButton>
              <ToolbarButton
                title="Delete row"
                onClick={() => editor.chain().focus().deleteRow().run()}
              >
                <span className="text-[10px] font-semibold leading-none">-R</span>
              </ToolbarButton>
              <ToolbarButton
                title="Delete table"
                onClick={() => {
                  editor.chain().focus().deleteTable().run();
                  emitMarkdown(editor);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </ToolbarButton>
            </>
          )}
          <ToolbarButton title="Upload image" onClick={openImageDialog}>
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Add video" onClick={openVideoDialog}>
            <Video className="h-4 w-4" />
          </ToolbarButton>
          <div className="mx-1 h-5 w-px bg-gray-300" />
          <ToolbarButton
            title="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>
        </div>
        {hasLink && (
          <div className="flex items-center gap-2 border-b border-blue-100 bg-blue-50 px-3 py-1.5 text-xs text-blue-800">
            <Link2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate" title={linkHref}>
              Linked to: {linkHref}
            </span>
            <button
              type="button"
              className="ml-auto shrink-0 font-medium underline"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
                emitMarkdown(editor);
              }}
            >
              Remove
            </button>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFilePick}
      />

      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="md-image-alt">Alt text</Label>
              <Input
                id="md-image-alt"
                className="mt-1"
                placeholder="Describe the image"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>
            <div>
              <Label>Image file</Label>
              <div className="mt-2 flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose image
                </Button>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={imageAlt || "Preview"}
                    className="h-32 w-full object-cover rounded-md border"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, GIF, SVG – max 1MB
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setImageOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={insertImage} disabled={uploading}>
              {uploading ? "Uploading..." : "Insert image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Video Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="md-video-url">Video URL</Label>
            <Input
              id="md-video-url"
              className="mt-1"
              placeholder="YouTube, Vimeo, or direct .mp4 URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setVideoOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={insertVideo}>
              Insert video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={tableOpen} onOpenChange={setTableOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Table</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <Label htmlFor="md-table-rows">Rows</Label>
              <Input
                id="md-table-rows"
                type="number"
                min={1}
                max={20}
                className="mt-1"
                value={tableRows}
                onChange={(e) => setTableRows(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="md-table-cols">Columns</Label>
              <Input
                id="md-table-cols"
                type="number"
                min={1}
                max={10}
                className="mt-1"
                value={tableCols}
                onChange={(e) => setTableCols(e.target.value)}
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                id="md-table-header"
                type="checkbox"
                checked={tableWithHeader}
                onChange={(e) => setTableWithHeader(e.target.checked)}
              />
              <Label htmlFor="md-table-header">Include header row</Label>
            </div>
            <p className="col-span-2 text-xs text-muted-foreground">
              Default is 2 rows × 3 columns. After inserting, click inside the
              table to add/remove rows or columns.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setTableOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={insertTable}>
              Insert table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="md-link-url">URL</Label>
            <Input
              id="md-link-url"
              className="mt-1"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLinkOpen(false)}
            >
              Cancel
            </Button>
            {editor.isActive("link") && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  editor.chain().focus().extendMarkRange("link").unsetLink().run();
                  emitMarkdown(editor);
                  setLinkOpen(false);
                }}
              >
                Remove link
              </Button>
            )}
            <Button type="button" onClick={applyLink}>
              Apply link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        .ProseMirror {
          min-height: 180px;
          cursor: text;
          user-select: text;
          -webkit-user-select: text;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror p { margin: 0.5rem 0; }
        .ProseMirror h1 { font-size: 1.875rem; font-weight: 700; margin: 0.75rem 0; }
        .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; margin: 0.75rem 0; }
        .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0; }
        .ProseMirror h4 { font-size: 1.125rem; font-weight: 600; margin: 0.5rem 0; }
        .ProseMirror h5 { font-size: 1rem; font-weight: 600; margin: 0.5rem 0; }
        .ProseMirror h6 { font-size: 0.875rem; font-weight: 600; margin: 0.5rem 0; }
        /* Tailwind preflight strips list markers — restore them explicitly */
        .ProseMirror ul {
          list-style-type: disc;
          list-style-position: outside;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          list-style-position: outside;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror ul ul { list-style-type: circle; }
        .ProseMirror ul ul ul { list-style-type: square; }
        .ProseMirror li { display: list-item; margin: 0.25rem 0; }
        .ProseMirror li p { margin: 0; }
        .ProseMirror li::marker {
          color: #374151;
          font-family: system-ui, sans-serif;
        }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.375rem; }
        .ProseMirror table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        .ProseMirror th, .ProseMirror td {
          border: 1px solid #d1d5db;
          padding: 0.5rem 0.75rem;
          vertical-align: top;
        }
        .ProseMirror th { background: #f9fafb; font-weight: 600; }
        .ProseMirror iframe { max-width: 100%; border-radius: 0.375rem; }
        .ProseMirror blockquote {
          border-left: 4px solid #f4d57e;
          padding: 0.5rem 0 0.5rem 1rem;
          margin: 0.75rem 0;
          color: #4b5563;
          font-style: italic;
          background: #fafafa;
        }
        .ProseMirror blockquote p { margin: 0.25rem 0; }
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
          cursor: pointer;
        }
        .ProseMirror a:hover { color: #1d4ed8; }
      `}</style>
    </>
  );
};

export default MarkdownEditor;
