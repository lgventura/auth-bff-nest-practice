import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("validate")
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body("token") token: string) {
    const payload = await this.authService.validateToken(token);
    return {
      valid: true,
      payload,
    };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.authService.getUserFromToken(req.user);
  }

  @Get("health")
  healthCheck() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "auth-bff",
    };
  }
}
