export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  role: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}
