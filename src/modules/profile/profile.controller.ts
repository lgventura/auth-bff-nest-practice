import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("profile")
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getMyProfile(@Request() req) {
    return this.profileService.getProfile(req.user.userId);
  }

  @Get("detailed")
  async getDetailedProfile(@Request() req) {
    return this.profileService.getDetailedProfile(req.user.userId);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Request() req, @Body() updateData: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.userId, updateData);
  }

  @Get("all")
  async getAllProfiles(@Request() req) {
    if (req.user.role !== "admin") {
      throw new ForbiddenException(
        "Access denied. Only administrators can access this route."
      );
    }

    return this.profileService.getAllProfiles();
  }
}
