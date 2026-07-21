import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart, CartSchema } from './schema/cart.schema';
import { Product, ProductSchema } from '../products/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      // Product is needed to validate items and read live prices/stock.
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [CartsController],
  providers: [CartsService],
  // OrdersModule consumes CartsService at checkout time.
  exports: [CartsService],
})
export class CartsModule {}
