import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserServices } from "./user.service";
import { User } from "./entity/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CloudinaryModule
  ],
  providers: [UserServices],
  controllers: [UserController]
})
export class UserModule {}