export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  accessToken: string;
  user: AdminUser;
}
