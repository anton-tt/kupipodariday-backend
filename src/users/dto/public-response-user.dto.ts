export class UserPublicProfileResponseDto {
  id: number;

  username: string;

  about: string;

  avatar: string;

  createdAt: string;

  updatedAt: string;

  constructor(
    id: number,
    username: string,
    about: string,
    email: string,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.username = username;
    this.about = about;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
