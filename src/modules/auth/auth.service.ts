import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import * as fs from "fs";
import * as path from "path";
import { User, JwtPayload, AuthResponse } from "./interfaces/auth.interface";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  private users: User[];

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.loadUsers();
  }

  private loadUsers(): void {
    try {
      const usersPath = path.join(__dirname, "..", "..", "data", "users.json");
      const usersData = fs.readFileSync(usersPath, "utf-8");
      this.users = JSON.parse(usersData);
      console.log("Users loaded successfully");
    } catch (error) {
      console.error("Error loading users:", error.message);
      this.users = [];
    }
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = this.users.find((u) => u.username === username);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { username, password } = loginDto;

    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);
    const expires_in = this.configService.get<string>("JWT_EXPIRES_IN", "1h");

    return {
      access_token,
      token_type: "Bearer",
      expires_in,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  async getUserFromToken(payload: JwtPayload) {
    const user = this.users.find((u) => u.id === payload.sub);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}
