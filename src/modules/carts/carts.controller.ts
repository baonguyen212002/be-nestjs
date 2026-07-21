import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// Every cart action is scoped to the logged-in user (id taken from the JWT).
@ApiTags('carts')
@ApiBearerAuth('access-token')
@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // Get the current user's cart (with product details + totals).
  @Get()
  getMyCart(@CurrentUser('userId') userId: string) {
    return this.cartsService.getMyCart(userId);
  }

  // Add a product (merges quantity if already in the cart).
  @Post('items')
  addItem(@CurrentUser('userId') userId: string, @Body() dto: AddCartItemDto) {
    return this.cartsService.addItem(userId, dto);
  }

  // Set the absolute quantity of one line.
  @Patch('items/:productId')
  updateItem(
    @CurrentUser('userId') userId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartsService.setItemQuantity(userId, productId, dto.quantity);
  }

  // Remove one line from the cart.
  @Delete('items/:productId')
  removeItem(
    @CurrentUser('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartsService.removeItem(userId, productId);
  }

  // Empty the whole cart.
  @Delete()
  clear(@CurrentUser('userId') userId: string) {
    return this.cartsService.clearCart(userId);
  }
}
