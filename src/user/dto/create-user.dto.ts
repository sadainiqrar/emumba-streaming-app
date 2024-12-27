export class CreateUserDto {
  googleId: string;
  email: string;
  name: string;
  accessToken: string;
  role?: string; // Optional, default to 'user'
}