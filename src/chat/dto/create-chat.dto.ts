import { IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsString()
  message: string;

  @IsUUID()
  streamId: string;

  @IsNumber()
  userId: number;
}