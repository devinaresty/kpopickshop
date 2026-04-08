import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as axios from 'axios';

@Injectable()
export class PaymentService {
  private xenditApiUrl = 'https://api.xendit.co/v2/invoices';
  private xenditSecretKey: string | undefined;

  constructor() {
    this.xenditSecretKey = process.env.XENDIT_SECRET_KEY;
    
    if (!this.xenditSecretKey) {
      console.warn('XENDIT_SECRET_KEY not found in environment variables. Payment integration will fail until configured.');
    }
  }

  private mapPaymentMethod(paymentMethod: any): string[] {
    if (!paymentMethod || !paymentMethod.method) {
      return [];
    }

    const method = paymentMethod.method;

    switch (method) {
      case 'BANK_TRANSFER':
        console.log('Bank Transfer - using Xendit default options');
        return [];
      case 'CREDIT_CARD':
        console.log('Credit/Debit Card - using Xendit default options');
        return [];
      case 'QR_PAYMENT':
        console.log('QR Payment (QRIS) selected');
        return ['QRIS'];
      case 'DIRECT_DEBIT':
        console.log('Direct Debit - using Xendit default options');
        return [];
      case 'E_WALLET':
        console.log('E-Wallet - using Xendit default options');
        return [];
      default:
        return [];
    }
  }

  async createInvoice(
    orderId: number,
    amount: number,
    email: string,
    description: string = `Order #${orderId}`,
    callbackSuccessUrl?: string,
    callbackFailureUrl?: string,
    paymentMethod?: any,
    webhookUrl?: string,
  ): Promise<{ id: string; invoice_url: string }> {
    if (!this.xenditSecretKey) {
      throw new InternalServerErrorException(
        'XENDIT_SECRET_KEY is not configured. Please add it to your .env file.',
      );
    }

    try {
      const auth = Buffer.from(`${this.xenditSecretKey}:`).toString('base64');

      const invoicePayload: any = {
        external_id: `order-${orderId}`,
        amount: Math.round(amount),
        payer_email: email,
        description,
        currency: 'IDR',
      };

      if (paymentMethod && paymentMethod.method) {
        const mappedMethods = this.mapPaymentMethod(paymentMethod);
        if (mappedMethods && mappedMethods.length > 0) {
          invoicePayload.payment_methods = mappedMethods;
          console.log(
            `Payment methods set for Order #${orderId}: ${mappedMethods.join(', ')} (from: ${paymentMethod.method})`,
          );
        }
      }

      if (callbackSuccessUrl) {
        invoicePayload.success_redirect_url = callbackSuccessUrl;
      }
      if (callbackFailureUrl) {
        invoicePayload.failure_redirect_url = callbackFailureUrl;
      }
      if (webhookUrl) {
        invoicePayload.webhook_url = webhookUrl;
        console.log(
          `Webhook URL set for Order #${orderId}: ${webhookUrl}`,
        );
      }

      console.log(`Sending to Xendit Invoice API:`, JSON.stringify(invoicePayload, null, 2));

      try {
        const response = await axios.default.post(
          this.xenditApiUrl,
          invoicePayload,
          {
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
          },
        );

        console.log(`Xendit Response:`, JSON.stringify(response.data, null, 2));
        console.log(`Webhook URL stored in Xendit: ${response.data.webhook_url || 'NOT PRESENT IN RESPONSE'}`);

        if (!response.data || !response.data.id || !response.data.invoice_url) {
          throw new InternalServerErrorException('Failed to create Xendit invoice - missing response data');
        }

        return {
          id: response.data.id,
          invoice_url: response.data.invoice_url,
        };
      } catch (xenditError: any) {
        if (invoicePayload.payment_methods && xenditError.response?.status) {
          console.warn(
            `Retrying without payment_methods restriction due to Xendit error... [Order #${orderId}]`,
          );
          
          delete invoicePayload.payment_methods;
          
          try {
            const retryResponse = await axios.default.post(
              this.xenditApiUrl,
              invoicePayload,
              {
                headers: {
                  Authorization: `Basic ${auth}`,
                  'Content-Type': 'application/json',
                },
              },
            );

            console.log(`Retry Xendit Response:`, JSON.stringify(retryResponse.data, null, 2));

            if (!retryResponse.data || !retryResponse.data.id || !retryResponse.data.invoice_url) {
              throw new InternalServerErrorException('Failed to create Xendit invoice - missing response data');
            }

            return {
              id: retryResponse.data.id,
              invoice_url: retryResponse.data.invoice_url,
            };
          } catch (retryError: any) {
            console.error('Xendit Retry Error:', retryError.response?.data || retryError.message);
            throw retryError;
          }
        }

        throw xenditError;
      }
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

      const response = await axios.default.get(
        `${this.xenditApiUrl}?external_id=${externalId}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      );

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
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
