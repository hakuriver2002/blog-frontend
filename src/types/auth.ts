export interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'EDITOR' | 'TRAINER' | 'MEMBER';
    status: 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'REJECTED';
    avatarUrl: string;
    createdAt: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // seconds
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

export interface GoogleOAuthPayload {
    code: string;          // Authorization code from Google
    redirectUri: string;
}