import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user) {
      const { password, ...result } = user;
      return {
        ...result,
        balance: Number(result.balance)
      };
    }
    return null;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        role: true,
        balance: true,
        paymentEmail: true,
        paymentMethod: true,
        city: true,
        zipCode: true,
        country: true,
        address: true,
        settings: true,
      },
    });

    if (!user) return null;

    return {
      ...user,
      balance: Number(user.balance)
    };
  }


  async updateProfile(userId: string, data: any) {
    const { name, username, paymentEmail, paymentMethod, address, city, country, zipCode } = data;

    if (username) {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          username,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new Error('Username is already taken');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        username: username || undefined,
        paymentEmail: paymentEmail || undefined,
        paymentMethod: paymentMethod || undefined,
        address,
        city,
        country,
        zipCode,
      },
    });
  }

  async getApiKeyStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true },
    });

    if (!user) return { enabled: false, lastGenerated: null };

    try {
      const settings = user.settings ? JSON.parse(user.settings) : {};
      return {
        enabled: settings.api?.apiKeyEnabled || false,
        lastGenerated: settings.api?.lastGenerated || null,
      };
    } catch (e) {
      return { enabled: false, lastGenerated: null };
    }
  }

  async generateApiKey(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true },
    });

    let settings = {};
    try {
      settings = user?.settings ? JSON.parse(user.settings) : {};
    } catch (e) { }

    const apiKey = `sk_${require('crypto').randomBytes(24).toString('hex')}`;
    const now = new Date().toISOString();

    const updatedSettings = {
      ...settings,
      api: {
        ...(settings as any).api,
        apiKeyEnabled: true,
        apiKey: apiKey,
        lastGenerated: now,
      },
    };

    await this.prisma.user.update({
      where: { id: userId },
      data: { settings: JSON.stringify(updatedSettings) },
    });

    return { apiKey, lastGenerated: now };
  }

  async revokeApiKey(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true },
    });

    let settings = {};
    try {
      settings = user?.settings ? JSON.parse(user.settings) : {};
    } catch (e) { }

    const updatedSettings = {
      ...settings,
      api: {
        ...(settings as any).api,
        apiKeyEnabled: false,
        apiKey: undefined,
      },
    };

    await this.prisma.user.update({
      where: { id: userId },
      data: { settings: JSON.stringify(updatedSettings) },
    });

    return { message: 'API key revoked successfully' };
  }

  async changePassword(userId: string, data: any) {
    const { currentPassword, newPassword } = data;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new Error('User not found or password not set');
    }

    const isMatch = await require('bcryptjs').compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await require('bcryptjs').hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    const { password, ...result } = user;
    return result;
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
