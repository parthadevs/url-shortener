import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  updateProfile(@Request() req, @Body() updateData: any) {
    return this.usersService.updateProfile(req.user.id, updateData);
  }

  @Get('api-key')
  getApiKeyStatus(@Request() req) {
    return this.usersService.getApiKeyStatus(req.user.id);
  }

  @Post('api-key')
  generateApiKey(@Request() req) {
    return this.usersService.generateApiKey(req.user.id);
  }

  @Delete('api-key')
  revokeApiKey(@Request() req) {
    return this.usersService.revokeApiKey(req.user.id);
  }

  @Post('password')
  changePassword(@Request() req, @Body() data: any) {
    return this.usersService.changePassword(req.user.id, data);
  }

  @Patch('settings')
  updateSettings(@Request() req, @Body() settings: any) {
    // Assuming settings are handled in updateProfile or similar for now
    return this.usersService.updateProfile(req.user.id, { settings: JSON.stringify(settings) });
  }
}
