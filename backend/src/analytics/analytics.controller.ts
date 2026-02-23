import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('overview')
    getOverview(@Request() req, @Query('timeRange') timeRange: string) {
        return this.analyticsService.getOverview(req.user.id, timeRange);
    }

    @Get('top-urls')
    getTopUrls(
        @Request() req,
        @Query('timeRange') timeRange: string,
        @Query('metric') metric: string,
        @Query('limit') limit: string,
    ) {
        return this.analyticsService.getTopUrls(req.user.id, timeRange, metric, parseInt(limit) || 5);
    }

    @Get('audience')
    getAudienceData(@Request() req, @Query('timeRange') timeRange: string) {
        return this.analyticsService.getAudienceData(req.user.id, timeRange);
    }
}

