import { Injectable, NotFoundException } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { UserProfile } from "./interfaces/profile.interface";
import { UpdateProfileDto } from "./dto/update-profile.dto";

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  role: string;
}

@Injectable()
export class ProfileService {
  private users: User[];
  private usersFilePath: string;

  constructor() {
    this.usersFilePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "data",
      "users.json"
    );
    this.loadUsers();
  }

  private loadUsers(): void {
    try {
      const usersData = fs.readFileSync(this.usersFilePath, "utf-8");
      this.users = JSON.parse(usersData);
    } catch (error) {
      console.error("Error loading users in ProfileService:", error.message);
      this.users = [];
    }
  }

  private reloadUsers(): void {
    this.loadUsers();
  }

  async getProfile(userId: string): Promise<UserProfile> {
    this.reloadUsers();
    const user = this.users.find((u) => u.id === userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  async getDetailedProfile(userId: string): Promise<UserProfile> {
    const profile = await this.getProfile(userId);

    return {
      ...profile,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
  }

  async updateProfile(
    userId: string,
    updateData: UpdateProfileDto
  ): Promise<UserProfile> {
    this.reloadUsers();
    const userIndex = this.users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new NotFoundException("User not found");
    }

    if (updateData.email) {
      this.users[userIndex].email = updateData.email;
    }

    try {
      fs.writeFileSync(
        this.usersFilePath,
        JSON.stringify(this.users, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error("Error saving user:", error.message);
      throw new Error("Error updating profile");
    }

    return {
      id: this.users[userIndex].id,
      username: this.users[userIndex].username,
      email: this.users[userIndex].email,
      role: this.users[userIndex].role,
    };
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    this.reloadUsers();

    return this.users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }));
  }
}
