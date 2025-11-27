import { IsEmail, IsOptional } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsEmail({}, { message: "Email must be valid" })
  email?: string;
}
