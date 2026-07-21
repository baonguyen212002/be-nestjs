import { IsOptional, IsString } from 'class-validator';

/**
 * Checkout turns the current user's cart into an order. No item data is sent —
 * the server reads the cart, snapshots prices, and validates stock server-side.
 */
export class CheckoutDto {
  @IsOptional()
  @IsString()
  shippingAddress?: string;
}
