'use client';

import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { uploadApi } from '@/src/lib/articleApi';

// TinyMCE API key — set NEXT_PUBLIC_TINYMCE_KEY in .env
const TINYMCE_API_KEY = process.env.NEXT_PUBLIC_TINYMCE_KEY ?? 'no-api-key';

interface RichEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    height?: number;
}

export function RichEditor({
    value,
    onChange,
    placeholder = 'Start writing your post...',
    height = 600,
}: RichEditorProps) {
    const editorRef = useRef<unknown>(null);

    const handleImageUpload = (
        blobInfo: { blob: () => Blob; filename: () => string },
        progress: (n: number) => void
    ): Promise<string> =>
        new Promise(async (resolve, reject) => {
            try {
                progress(10);
                const file = new File([blobInfo.blob()], blobInfo.filename(), {
                    type: blobInfo.blob().type,
                });
                const { url } = await uploadApi.image(file);
                progress(100);
                resolve(url);
            } catch {
                reject('Image upload failed');
            }
        });

    return (
        <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <Editor
                apiKey={TINYMCE_API_KEY}
                onInit={(_evt, editor) => (editorRef.current = editor)}
                value={value}
                onEditorChange={onChange}
                init={{
                    height,
                    placeholder,
                    menubar: true,
                    skin: 'oxide',
                    content_css: 'default',

                    toolbar:
                        'undo redo | styles | bold italic underline strikethrough | ' +
                        'alignleft aligncenter alignright alignjustify | ' +
                        'bullist numlist outdent indent | blockquote hr | ' +
                        'link image media table | code codesample | removeformat',

                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image',
                        'charmap', 'preview', 'anchor', 'searchreplace',
                        'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code',
                        'help', 'wordcount', 'codesample',
                    ],

                    images_upload_handler: handleImageUpload,
                    automatic_uploads: true,
                    image_advtab: true,

                    codesample_languages: [
                        { text: 'HTML/XML', value: 'markup' },
                        { text: 'JavaScript', value: 'javascript' },
                        { text: 'TypeScript', value: 'typescript' },
                        { text: 'CSS', value: 'css' },
                        { text: 'Python', value: 'python' },
                        { text: 'Bash', value: 'bash' },
                        { text: 'JSON', value: 'json' },
                        { text: 'SQL', value: 'sql' },
                    ],

                    style_formats: [
                        { title: 'Heading 1', block: 'h1' },
                        { title: 'Heading 2', block: 'h2' },
                        { title: 'Heading 3', block: 'h3' },
                        { title: 'Blockquote', block: 'blockquote' },
                        { title: 'Code Block', block: 'pre' },
                        { title: 'Info Box', block: 'div', classes: 'info-box' },
                    ],

                    content_style: `
            body {
              font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
              font-size: 16px;
              line-height: 1.75;
              color: #18181b;
              max-width: 800px;
              margin: 0 auto;
              padding: 1.5rem;
            }
            h1,h2,h3,h4 { font-weight: 700; line-height: 1.3; }
            pre { background: #f4f4f5; border-radius: 8px; padding: 1rem; overflow-x: auto; }
            blockquote { border-left: 4px solid #6366f1; padding-left: 1rem; color: #71717a; }
            img { max-width: 100%; border-radius: 8px; }
            .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 1rem; }
          `,
                }}
            />
        </div>
    );
}