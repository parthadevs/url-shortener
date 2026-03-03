import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get()
  findAll(@Request() req) {
    return this.urlsService.findAll(req.user.id);
  }

  @Post()
  create(@Request() req, @Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(req.user.id, createUrlDto);
  }
}
