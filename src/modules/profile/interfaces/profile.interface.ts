export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface UpdateProfileDto {
  email?: string;
}
