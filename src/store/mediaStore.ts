import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { mediaApi } from '@/src/lib/mediaApi';
import type { MediaItem, MediaFilters } from '@/src/types/media';

function uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function guessMime(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    const map: Record<string, string> = {
        jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
        gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
        mp4: 'video/mp4', webm: 'video/webm',
        pdf: 'application/pdf',
    };
    return map[ext] ?? 'application/octet-stream';
}

interface UploadProgress {
    filename: string;
    progress: number;
    error?: string;
}

interface MediaState {
    items: MediaItem[];
    filteredItems: MediaItem[];

    uploading: UploadProgress[];
    isUploading: boolean;

    filters: MediaFilters;
    viewSize: 'sm' | 'md' | 'lg';
    selected: Set<string>;

    uploadFiles: (files: File[], uploaderName: string) => Promise<MediaItem[]>;
    deleteItem: (id: string) => void;
    deleteSelected: () => void;
    setFilters: (f: Partial<MediaFilters>) => void;
    setViewSize: (s: 'sm' | 'md' | 'lg') => void;
    toggleSelect: (id: string) => void;
    selectAll: () => void;
    clearSelection: () => void;
}

// ── helper compute ─────────────────────
function computeFiltered(items: MediaItem[], filters: MediaFilters): MediaItem[] {
    let result = [...items];

    if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter((i) => i.filename.toLowerCase().includes(q));
    }

    if (filters.mimeType) {
        const mime = filters.mimeType;
        result = result.filter((i) => i.mimeType.startsWith(mime));
    }

    const { sortBy = 'uploadedAt', sortOrder = 'desc' } = filters;

    result.sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'uploadedAt') cmp = a.uploadedAt.localeCompare(b.uploadedAt);
        else if (sortBy === 'filename') cmp = a.filename.localeCompare(b.filename);
        else if (sortBy === 'size') cmp = a.size - b.size;

        return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
}

export const useMediaStore = create<MediaState>()(
    devtools(
        persist(
            (set, get) => ({
                items: [],
                filteredItems: [],

                uploading: [],
                isUploading: false,

                filters: { sortBy: 'uploadedAt', sortOrder: 'desc' },
                viewSize: 'md',
                selected: new Set(),

                // ── upload ─────────────────
                uploadFiles: async (files, uploaderName) => {
                    set({ isUploading: true });

                    const newItems: MediaItem[] = [];

                    for (const file of files) {
                        try {
                            const url = await mediaApi.uploadImage(file);

                            const item: MediaItem = {
                                id: uid(),
                                url,
                                filename: file.name,
                                mimeType: file.type || guessMime(file.name),
                                size: file.size,
                                uploadedAt: new Date().toISOString(),
                                uploadedBy: uploaderName,
                            };

                            newItems.push(item);

                            set((s) => {
                                const items = [item, ...s.items];
                                return {
                                    items,
                                    filteredItems: computeFiltered(items, s.filters),
                                };
                            });

                        } catch { }
                    }

                    set({ isUploading: false });
                    return newItems;
                },

                // ── delete ─────────────────
                deleteItem: (id) => {
                    set((s) => {
                        const items = s.items.filter((i) => i.id !== id);
                        return {
                            items,
                            filteredItems: computeFiltered(items, s.filters),
                            selected: new Set([...s.selected].filter((sid) => sid !== id)),
                        };
                    });
                },

                deleteSelected: () => {
                    const selected = get().selected;
                    set((s) => {
                        const items = s.items.filter((i) => !selected.has(i.id));
                        return {
                            items,
                            filteredItems: computeFiltered(items, s.filters),
                            selected: new Set(),
                        };
                    });
                },

                // ── filters ─────────────────
                setFilters: (f) => {
                    set((s) => {
                        const filters = { ...s.filters, ...f };
                        return {
                            filters,
                            filteredItems: computeFiltered(s.items, filters),
                        };
                    });
                },

                setViewSize: (viewSize) => set({ viewSize }),

                // ── selection ──────────────
                toggleSelect: (id) => {
                    set((s) => {
                        const next = new Set(s.selected);
                        next.has(id) ? next.delete(id) : next.add(id);
                        return { selected: next };
                    });
                },

                selectAll: () => {
                    const items = get().filteredItems;
                    set({ selected: new Set(items.map((i) => i.id)) });
                },

                clearSelection: () => set({ selected: new Set() }),
            }),
            {
                name: 'media-store',
                partialize: (s) => ({
                    items: s.items,
                    viewSize: s.viewSize,
                }),
            }
        )
    )
);