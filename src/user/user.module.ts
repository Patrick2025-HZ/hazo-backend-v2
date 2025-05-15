import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserServices } from "./user.service";
import { user } from "./entity/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([user]),
  ],
  providers: [UserServices],
  controllers: [UserController]
})
export class UserModule {}