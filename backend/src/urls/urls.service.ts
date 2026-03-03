import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { generateSlug } from '../utils/slug.util';
import slugify from 'slugify';

@Injectable()
export class UrlsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const urls = await this.prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return urls.map((url) => ({
      ...url,
      earnings: Number(url.earnings),
    }));
  }

  async create(userId: string, createUrlDto: CreateUrlDto) {
    const shortUrl = createUrlDto.customSlug
      ? slugify(createUrlDto.customSlug, { lower: true, strict: true })
      : generateSlug();

    // Check if slug already exists
    const existingUrl = await this.prisma.url.findUnique({
      where: { shortUrl },
    });

    if (existingUrl) {
      throw new BadRequestException('This short URL is already taken');
    }

    // Create new URL
    const newUrl = await this.prisma.url.create({
      data: {
        shortUrl,
        originalUrl: createUrlDto.originalUrl,
        userId: userId,
        expiresAt: createUrlDto.expiresAt
          ? new Date(createUrlDto.expiresAt)
          : null,
      },
    });

    return {
      ...newUrl,
      earnings: Number(newUrl.earnings),
    };
  }
}
