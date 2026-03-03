import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) { }

  @Post('chat')
  async chat(@Req() req: any, @Body('messages') messages: { role: string; content: string }[]) {
    return this.supportService.getChatResponse(messages, req.user);
  }
}
