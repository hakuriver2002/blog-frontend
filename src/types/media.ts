export type MediaType = 'image' | 'video' | 'document';

export interface MediaItem {
    id: string;       // client-generated uuid
    url: string;       // CDN / server URL returned by upload
    filename: string;       // original filename
    mimeType: string;       // e.g. "image/jpeg"
    size: number;       // bytes
    width?: number;       // image dimensions (parsed from img element)
    height?: number;
    uploadedAt: string;       // ISO date
    uploadedBy: string;       // user fullName
    tags?: string[];     // optional user-added tags
}

export interface MediaUploadResponse {
    url: string;
}

export interface MediaFilters {
    search?: string;
    mimeType?: string;         // e.g. "image/jpeg", "image/" for all images
    sortBy?: 'uploadedAt' | 'filename' | 'size';
    sortOrder?: 'asc' | 'desc';
}

// Grid view sizes
export type MediaViewSize = 'sm' | 'md' | 'lg';