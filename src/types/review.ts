export type ReviewStatus =
    | 'draft'
    | 'pending'
    | 'approved'
    | 'rejected';

export type ReviewAction =
    | 'submitted'
    | 'approved'
    | 'rejected';

export interface ReviewEntry {
    id: string;
    articleId: string;

    action: ReviewAction;

    note?: string;

    createdAt: string;

    reviewer?: {
        id: string;
        fullName: string;
        avatarUrl?: string;
    };
}

export type ArticleBulkAction = 'approve' | 'reject';

// ── Payloads (STRICT with backend) ──
export interface ApprovePayload {
    note?: string;
}

export interface RejectPayload {
    reason: string;
}

export interface BulkReviewPayload {
    ids: string[];
    action: ArticleBulkAction;
}