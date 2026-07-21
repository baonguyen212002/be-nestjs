import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/types/jwt-payload.type';

@ApiTags('orders')
@ApiBearerAuth('access-token')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Place an order from the current user's cart.
  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  checkout(@CurrentUser('userId') userId: string, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(userId, dto);
  }

  // The current user's own orders.
  @Get()
  @UseGuards(JwtAuthGuard)
  findMine(@CurrentUser('userId') userId: string) {
    return this.ordersService.findMine(userId);
  }

  // Admin: every order across all users. Declared before ':id' on purpose.
  @Get('admin/all')
  @UseGuards(AdminGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  // A single order (owner or admin).
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.ordersService.findOneForUser(id, user.userId, user.role);
  }

  // Owner (or admin) cancels a pending order; stock is restored.
  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.ordersService.cancel(id, user.userId, user.role);
  }

  // Admin: move an order to a new status.
  @Patch(':id/status')
  @UseGuards(AdminGuard)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
