export interface User {
  _id: string;
  email: string;
  name: string;
  jobTitle?: string;
  introduction?: string;
}

export interface AuthResponse {
  _id: string;
  email: string;
  name: string;
  username: string; // 추가
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  username: string; // 추가
}

