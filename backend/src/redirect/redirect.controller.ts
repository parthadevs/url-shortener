import {
  Controller,
  Get,
  Param,
  Request,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Response } from 'express';

@Controller('redirect')
export class RedirectController {
  constructor(private prisma: PrismaService) {}

  @Get(':slug')
  async handleRedirect(
    @Param('slug') slug: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers['referer'] || '';
    const ip = req.headers['x-forwarded-for'] || req.ip || '';

    try {
      const url = await this.prisma.url.findUnique({
        where: { shortUrl: slug },
      });

      if (!url) {
        throw new NotFoundException('URL not found');
      }

      // Check if this IP and User-Agent already viewed this specific short URL
      const alreadyViewed = await this.prisma.clickEvent.findFirst({
        where: {
          urlId: url.id,
          ipAddress: ip.toString(),
          browser: userAgent,
        },
      });

      const isUniqueView = !alreadyViewed;
      const earnings = isUniqueView ? 0.003 : 0;

      // Always record the click (for analytics), even if it's not a paid view
      await this.prisma.clickEvent.create({
        data: {
          urlId: url.id,
          ipAddress: ip.toString(),
          browser: userAgent,
          referer,
          earnings,
        },
      });

      // Update clicks always
      await this.prisma.url.update({
        where: { id: url.id },
        data: {
          clicks: { increment: 1 },
          ...(isUniqueView && {
            earnings: { increment: earnings },
          }),
        },
      });

      // Only update user balance for unique view
      if (isUniqueView) {
        await this.prisma.user.update({
          where: { id: url.userId },
          data: {
            balance: { increment: earnings },
          },
        });
      }

      // Return original URL as JSON so the frontend can handle the redirection
      // and avoid CORS issues with external sites
      return res.json({ originalUrl: url.originalUrl });
    } catch (error) {
      console.error('Error processing redirect:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      return res.status(500).json({ error: 'Failed to process redirect' });
    }
  }
}
