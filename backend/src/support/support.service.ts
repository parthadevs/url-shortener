import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenRouter } from '@openrouter/sdk';

@Injectable()
export class SupportService {
  private readonly openRouter: OpenRouter;

  constructor() {
    this.openRouter = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
      httpReferer: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      xTitle: 'ShortCash Support',
    });
  }

  async getChatResponse(messages: { role: string; content: string }[], user: any) {
    try {
      const systemPrompt = `
You are the support assistant for ShortCash, a premium URL shortener. 
Users earn money when others click their links.

USER CONTEXT:
- Name: ${user.name || 'User'}
- Username: ${user.username || 'N/A'}
- Current Balance: $${user.balance || 0}
- Payment Method: ${user.paymentMethod || 'Not set'}
- Payment Email: ${user.paymentEmail || 'Not set'}

SHORTCASH INFO:
- Minimum Withdrawal: $5.00
- Payment Methods: PayPal, Payoneer, Wire Transfer, Crypto.
- Withdrawals: Usually processed within 24-48 hours.
- API: Users can find their API key in the Settings page.

Be professional, helpful, and concise. If you don't know the answer, ask the user to contact support@shortcash.com.
`;

      const response = await this.openRouter.chat.send({
        chatGenerationParams: {
          model: 'google/gemini-2.0-flash-001',
          messages: [
            {
              role: 'system',
              content: systemPrompt.trim(),
            },
            ...(messages as any),
          ],
          stream: false,
        },
      });

      return response.choices[0].message;
    } catch (error) {
      console.error('Support Chat Error:', error);
      throw new InternalServerErrorException(
        'An error occurred while communicating with the support AI',
      );
    }
  }
}
