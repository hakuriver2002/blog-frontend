export interface UpdateProfilePayload {
    fullName: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface DeleteAccountPayload {
    password: string;         // Confirm identity before deletion
    confirmation: string;     // Must type "DELETE" to confirm
}

// What the backend returns after PATCH /users/me
export interface UpdateProfileResponse {
    user: import('@/src/types/auth').User & { bio?: string };
    message: string;
}