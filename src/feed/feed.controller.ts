import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get feed' })
  @ApiBearerAuth('access-token')
  @Get('get-feed')
  getAllFeed(@Req() req: any) {
    return this.feedService.getAllFeed(req.user?.userId);
  }
}
