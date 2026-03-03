import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

@Module({
  imports: [],
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule {}
