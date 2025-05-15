import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserServices } from "./user.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { currentUser } from "src/decorators/current-user.decorator";


@ApiTags('user')

@Controller('user')
export class UserController {
    constructor (
        private userServices:UserServices
    ){}

    @UseGuards(JwtAuthGuard)
    @Get('currentUser')
    getUserDetailsById(@currentUser() user:any) {
        return this.userServices.getUserDetailsById(user)
      }
}