
export * from './auth';
export * from './project';
export * from './portfolio';

// Common/Shared types that don't fit in specific modules
export interface Message {
    id: string;
    fromName: string;
    fromEmail: string;
    subject: string;
    content: string;
    date: string;
    read: boolean;
}

export interface UserProfile {
    name: string;
    role: string;
    bio: string;
    email: string;
    avatarUrl: string;
    tags: string[];
}
