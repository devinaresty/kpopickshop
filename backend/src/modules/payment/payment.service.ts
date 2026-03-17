import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as axios from 'axios';

@Injectable()
export class PaymentService {
  private xenditApiUrl = 'https://api.xendit.co/v2/invoices';
  private xenditSecretKey: string | undefined;

  constructor() {
    this.xenditSecretKey = process.env.XENDIT_SECRET_KEY;
    
    if (!this.xenditSecretKey) {
      console.warn('⚠️  XENDIT_SECRET_KEY not found in environment variables. Payment integration will fail until configured.');
    }
  }

  async createInvoice(
    orderId: number,
    amount: number,
    email: string,
    description: string = `Order #${orderId}`,
  ): Promise<{ id: string; invoice_url: string }> {
    if (!this.xenditSecretKey) {
      throw new InternalServerErrorException(
        'XENDIT_SECRET_KEY is not configured. Please add it to your .env file.',
      );
    }

    try {
      const auth = Buffer.from(`${this.xenditSecretKey}:`).toString('base64');

      const response = await axios.default.post(
        this.xenditApiUrl,
        {
          external_id: `order-${orderId}`,
          amount: Math.round(amount),
          payer_email: email,
          description,
          currency: 'IDR',
        },
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.data || !response.data.id || !response.data.invoice_url) {
        throw new InternalServerErrorException('Failed to create Xendit invoice - missing response data');
      }

      return {
        id: response.data.id,
        invoice_url: response.data.invoice_url,
      };
    } catch (error: any) {
      console.error('Xendit Invoice Creation Error:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        `Failed to create payment invoice: ${error.response?.data?.message || error.message || 'Unknown error'}`,
      );
    }
  }

  async getInvoiceStatus(invoiceId: string): Promise<any> {
    if (!this.xenditSecretKey) {
      throw new InternalServerErrorException('XENDIT_SECRET_KEY is not configured');
    }

    try {
      const auth = Buffer.from(`${this.xenditSecretKey}:`).toString('base64');

      const response = await axios.default.get(`${this.xenditApiUrl}/${invoiceId}`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Xendit Status Check Error:', error.message);
      throw new InternalServerErrorException(
        `Failed to check payment status: ${error.message}`,
      );
    }
  }

  async getInvoiceByExternalId(externalId: string): Promise<any> {
    if (!this.xenditSecretKey) {
      throw new InternalServerErrorException('XENDIT_SECRET_KEY is not configured');
    }

    try {
      const auth = Buffer.from(`${this.xenditSecretKey}:`).toString('base64');

      // Query invoices by external_id
      const response = await axios.default.get(
        `${this.xenditApiUrl}?external_id=${externalId}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      );

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Return the most recent invoice for this external_id
        return response.data[0];
      }

      throw new InternalServerErrorException(`No invoice found for external_id: ${externalId}`);
    } catch (error: any) {
      console.error('Xendit Get Invoice By External ID Error:', error.message);
      throw error;
    }
  }

  verifyWebhookSignature(token: string): boolean {
    const expectedToken = process.env.XENDIT_CALLBACK_TOKEN;
    return token === expectedToken;
  }
}
