// create-stream.dto.ts
import { IsEnum, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class CreateStreamDto {
  @IsString()
  title: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @Min(0)
  @Max(600) // Maximum duration is 10 minutes (600 seconds)
  duration?: number;

  @IsOptional()
  @IsEnum(['Active', 'Completed'])
  status?: 'Active' | 'Completed';
}
