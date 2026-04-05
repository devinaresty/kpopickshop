import { Controller, Get, Post, Body, Req, Res, BadRequestException } from "@nestjs/common";
import { AppService } from "./app.service";
import { Request, Response } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Fallback route for Xendit webhook that arrives at root "/"
   * This handles cases where webhook URL was misconfigured or sent to domain root
   */
  @Post()
  async handleRootPost(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    console.log('🔍 POST request received at root "/"');
    console.log('📦 Body:', JSON.stringify(body, null, 2));
    
    // Check if this looks like a Xendit webhook
    if (body.external_id || body.status || body.id) {
      console.log('✅ Detected Xendit webhook payload. This request should have been sent to /api/payments/webhook/xendit instead.');
      console.log('⚠️ This typically means:');
      console.log('   1. Webhook URL in Xendit is misconfigured (domain without path)');
      console.log('   2. Payment invoice was created before webhook URL was updated');
      console.log('   3. Please create a NEW payment/invoice to test with correct webhook URL');
      
      return res.status(400).json({
        success: false,
        error: 'Webhook endpoint not found',
        message: 'This appears to be a Xendit webhook, but it was sent to the wrong endpoint (/). The correct endpoint is /api/payments/webhook/xendit',
        receivedAt: new Date().toISOString(),
      });
    }

    throw new BadRequestException('POST method not allowed at root endpoint');
  }
}
