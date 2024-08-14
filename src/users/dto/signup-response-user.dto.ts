export class SignupUserResponseDto {
  id: number;

  username: string;

  about: string;

  avatar: string;

  email: string;

  createdAt: string;

  updatedAt: string;

  constructor(
    id: number,
    username: string,
    about: string,
    avatar: string,
    email: string,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.username = username;
    this.about = about;
    this.avatar = avatar;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
