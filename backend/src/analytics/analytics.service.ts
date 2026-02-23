import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    private getStartDate(timeRange: string): Date {
        const now = new Date();
        const startDate = new Date();

        switch (timeRange) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(now.getDate() - 90);
                break;
            case '12m':
                startDate.setMonth(now.getMonth() - 12);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }
        return startDate;
    }

    async getOverview(userId: string, timeRange: string = '30d') {
        const now = new Date();
        const startDate = this.getStartDate(timeRange);

        // Get total clicks and earnings
        const totalStats = await this.prisma.url.aggregate({
            where: { userId },
            _sum: {
                clicks: true,
                earnings: true,
            },
        });

        // Get previous period stats for comparison
        const previousStartDate = new Date(startDate);
        const previousEndDate = new Date(now);

        if (timeRange === '7d') {
            previousStartDate.setDate(previousStartDate.getDate() - 7);
            previousEndDate.setDate(previousEndDate.getDate() - 7);
        } else if (timeRange === '30d') {
            previousStartDate.setDate(previousStartDate.getDate() - 30);
            previousEndDate.setDate(previousEndDate.getDate() - 30);
        } else if (timeRange === '90d') {
            previousStartDate.setDate(previousStartDate.getDate() - 90);
            previousEndDate.setDate(previousEndDate.getDate() - 90);
        } else if (timeRange === '12m') {
            previousStartDate.setMonth(previousStartDate.getMonth() - 12);
            previousEndDate.setMonth(previousEndDate.getMonth() - 12);
        }

        // Get click events for the current period
        const clickEvents = await this.prisma.clickEvent.findMany({
            where: {
                url: { userId },
                createdAt: { gte: startDate, lte: now },
            },
            include: { url: true },
            orderBy: { createdAt: 'asc' },
        });

        // Get click events for the previous period
        const previousClickEvents = await this.prisma.clickEvent.findMany({
            where: {
                url: { userId },
                createdAt: { gte: previousStartDate, lte: previousEndDate },
            },
        });

        // Calculate percentage changes
        const currentPeriodClicks = clickEvents.length;
        const previousPeriodClicks = previousClickEvents.length;
        const clicksPercentChange =
            previousPeriodClicks > 0 ? ((currentPeriodClicks - previousPeriodClicks) / previousPeriodClicks) * 100 : 0;

        const currentPeriodEarnings = clickEvents.reduce((sum, event) => sum + Number(event.earnings), 0);
        const previousPeriodEarnings = previousClickEvents.reduce((sum, event) => sum + Number(event.earnings), 0);
        const earningsPercentChange =
            previousPeriodEarnings > 0 ? ((currentPeriodEarnings - previousPeriodEarnings) / previousPeriodEarnings) * 100 : 0;

        // Get active URLs count
        const activeUrlsCount = await this.prisma.url.count({
            where: { userId },
        });

        // Get new URLs in this period
        const newUrlsCount = await this.prisma.url.count({
            where: {
                userId,
                createdAt: { gte: startDate },
            },
        });

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true },
        });

        // Calculate average earnings per click
        const avgEarningsPerClick = currentPeriodClicks > 0 ? currentPeriodEarnings / currentPeriodClicks : 0;

        // Group click events by date for the chart
        const dailyData: { date: string; clicks: number; earnings: number }[] = [];
        const dateMap = new Map();

        // Initialize with all dates in the range
        const currentDate = new Date(startDate);
        while (currentDate <= now) {
            const dateStr = currentDate.toISOString().split('T')[0];
            dateMap.set(dateStr, { date: dateStr, clicks: 0, earnings: 0 });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Fill in actual data
        clickEvents.forEach((event) => {
            const dateStr = event.createdAt.toISOString().split('T')[0];
            if (dateMap.has(dateStr)) {
                const data = dateMap.get(dateStr);
                data.clicks += 1;
                data.earnings += Number(event.earnings);
                dateMap.set(dateStr, data);
            }
        });

        // Convert map to array and format dates
        dateMap.forEach((value) => {
            const date = new Date(value.date);
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
            dailyData.push({
                date: formattedDate,
                clicks: value.clicks,
                earnings: value.earnings,
            });
        });

        return {
            balance: user ? Number(user.balance) : 0,
            totalClicks: totalStats._sum.clicks || 0,
            totalEarnings: totalStats._sum.earnings ? Number(totalStats._sum.earnings) : 0,
            clicksPercentChange,
            earningsPercentChange,
            activeUrlsCount,
            newUrlsCount,
            avgEarningsPerClick,
            dailyData,
        };
    }

    async getTopUrls(userId: string, timeRange: string = '30d', metric: string = 'clicks', limit: number = 5) {
        const startDate = this.getStartDate(timeRange);

        const urls = await this.prisma.url.findMany({
            where: { userId },
            include: {
                _count: {
                    select: {
                        clickEvents: {
                            where: {
                                createdAt: { gte: startDate },
                            },
                        },
                    },
                },
                clickEvents: {
                    where: {
                        createdAt: { gte: startDate },
                    },
                    select: {
                        earnings: true,
                    },
                },
            },
        });

        const topUrls = urls.map((url) => {
            const earnings = url.clickEvents.reduce((sum, event) => sum + Number(event.earnings), 0);
            return {
                url: url.shortUrl,
                originalUrl: url.originalUrl,
                clicks: url._count.clickEvents,
                earnings: earnings,
                totalClicks: url.clicks,
                totalEarnings: Number(url.earnings),
            };
        });

        // Sort by metric
        topUrls.sort((a, b) => {
            if (metric === 'earnings') {
                return b.earnings - a.earnings;
            }
            return b.clicks - a.clicks;
        });

        return topUrls.slice(0, limit);
    }

    async getAudienceData(userId: string, timeRange: string = '30d') {
        const startDate = this.getStartDate(timeRange);

        const clickEvents = await this.prisma.clickEvent.findMany({
            where: {
                url: { userId },
                createdAt: { gte: startDate },
            },
            select: {
                device: true,
                country: true,
                referer: true,
            },
        });

        const deviceCount = new Map();
        const countryCount = new Map();
        const refererCount = new Map();

        clickEvents.forEach((event) => {
            const device = event.device || 'Unknown';
            const country = event.country || 'Unknown';
            const referer = event.referer || 'Direct';

            deviceCount.set(device, (deviceCount.get(device) || 0) + 1);
            countryCount.set(country, (countryCount.get(country) || 0) + 1);
            refererCount.set(referer, (refererCount.get(referer) || 0) + 1);
        });

        const formatMap = (map: Map<string, number>) => {
            const result: { name: string; value: number }[] = [];
            map.forEach((value, name) => {
                result.push({ name, value });
            });
            return result.sort((a, b) => b.value - a.value);
        };

        return {
            deviceData: formatMap(deviceCount),
            locationData: formatMap(countryCount),
            referrerData: formatMap(refererCount),
            totalClicks: clickEvents.length,
        };
    }

}
