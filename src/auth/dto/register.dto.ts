import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() @MinLength(8) @Matches(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]))/) password: string;
}