import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) { }

  async createWithdrawal(userId: string, createPaymentDto: CreatePaymentDto) {
    // Get user to check balance and required fields
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        balance: true,
        name: true,
        address: true,
        city: true,
        country: true,
        zipCode: true,
        paymentEmail: true,
        paymentMethod: true,
      },
    });

    if (!user) throw new BadRequestException('User not found');

    // Check if user has completed their profile
    if (!user.name || !user.address || !user.city || !user.country || !user.zipCode || !user.paymentEmail) {
      throw new BadRequestException({
        message: 'Incomplete profile',
        missingFields: {
          name: !user.name,
          address: !user.address,
          city: !user.city,
          country: !user.country,
          zipCode: !user.zipCode,
          paymentEmail: !user.paymentEmail,
        },
      });
    }

    if (Number(user.balance) < createPaymentDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create withdrawal request
    const withdrawal = await this.prisma.withdrawal.create({
      data: {
        userId,
        amount: createPaymentDto.amount,
        paymentEmail: user.paymentEmail,
        paymentMethod: user.paymentMethod || 'paypal',
        status: 'PENDING',
      },
    });

    // Update user balance
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          decrement: createPaymentDto.amount,
        },
      },
    });

    return {
      ...withdrawal,
      amount: Number(withdrawal.amount)
    };
  }

  async findAll(userId: string) {
    const withdrawals = await this.prisma.withdrawal.findMany({ where: { userId } });
    return withdrawals.map(w => ({
      ...w,
      amount: Number(w.amount)
    }));
  }


  findOne(id: string) {
    return this.prisma.withdrawal.findUnique({ where: { id } });
  }
}
