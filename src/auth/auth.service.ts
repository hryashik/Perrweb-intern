import { HttpException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { SignupDto } from "./dto/signup.dto";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async createHash(str: string) {
    const saltRounds = 5;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(str, salt);
  }

  private async compareHash(hash: string, password: string) {
    return bcrypt.compare(password, hash);
  }

  generateJwt(email: string, id: number) {
    const payload = { email, sub: id };
    return this.jwtService.signAsync(payload);
  }

  async validateUser(payload: any) {
    const user = await this.usersService.findOneByEmail(payload.email);
    if (!user) return null;
    return user;
  }

  async signup(dto: SignupDto) {
    const hash = await this.createHash(dto.password);
    const user = await this.usersService.createUser({
      email: dto.email,
      hash,
      username: dto.username,
    });
    const token = await this.generateJwt(user.email, user.id);
    return { access_token: token };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) throw new HttpException("Incorrect data", 401);
    const compareResult = await this.compareHash(user.hash, dto.password);
    if (!compareResult) throw new HttpException("Incorrect data", 401);

    const token = await this.generateJwt(dto.email, user.id);
    return { access_token: token };
  }
}
