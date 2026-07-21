import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRole } from '../users/schema/user.schema';
import { Product } from '../products/schema/product.schema';
import { CartsService } from '../carts/carts.service';
import { Order, OrderStatus } from './schema/order.schema';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly cartsService: CartsService,
  ) {}

  /**
   * Turn the user's current cart into an order:
   *  1. read the cart and reject if empty
   *  2. snapshot each item's name + price
   *  3. validate & decrement product stock (rolled back on any failure)
   *  4. persist the order and clear the cart
   */
  async checkout(userId: string, dto: CheckoutDto) {
    const cart = await this.cartsService.getRawCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Giỏ hàng đang trống');
    }

    const products = await this.productModel
      .find({ _id: { $in: cart.items.map((i) => i.productId) } })
      .exec();
    const byId = new Map(products.map((p) => [p._id.toString(), p]));

    // Build snapshotted order lines + validate availability.
    const orderItems = cart.items.map((it) => {
      const p = byId.get(it.productId.toString());
      if (!p) {
        throw new BadRequestException(
          `Một sản phẩm trong giỏ không còn tồn tại`,
        );
      }
      if (p.stock < it.quantity) {
        throw new ConflictException(
          `Không đủ tồn kho cho "${p.name}" (còn ${p.stock})`,
        );
      }
      return {
        productId: p._id,
        name: p.name,
        price: p.price,
        quantity: it.quantity,
        subtotal: p.price * it.quantity,
      };
    });

    // Decrement stock atomically per item; roll back if any line loses a race.
    const decremented: Array<{ productId: Types.ObjectId; quantity: number }> =
      [];
    for (const item of orderItems) {
      const res = await this.productModel
        .updateOne(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
        )
        .exec();
      if (res.modifiedCount !== 1) {
        await this.restock(decremented);
        throw new ConflictException(
          `Tồn kho của "${item.name}" vừa thay đổi, vui lòng thử lại`,
        );
      }
      decremented.push({ productId: item.productId, quantity: item.quantity });
    }

    const totalPrice = orderItems.reduce((sum, i) => sum + i.subtotal, 0);
    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      items: orderItems,
      totalPrice,
      status: OrderStatus.PENDING,
      shippingAddress: dto.shippingAddress,
    });

    await this.cartsService.clearCart(userId);
    return order;
  }

  /** Orders belonging to the current user, newest first. */
  findMine(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  /** A single order the user owns (admins may read any order). */
  async findOneForUser(orderId: string, userId: string, role: UserRole) {
    const order = await this.findByIdOrThrow(orderId);
    if (role !== UserRole.ADMIN && order.userId.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem đơn hàng này');
    }
    return order;
  }

  /** User cancels their own pending order; stock is returned. */
  async cancel(orderId: string, userId: string, role: UserRole) {
    const order = await this.findByIdOrThrow(orderId);
    if (role !== UserRole.ADMIN && order.userId.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền hủy đơn hàng này');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new ConflictException(
        'Chỉ có thể hủy đơn hàng đang ở trạng thái pending',
      );
    }
    await this.restock(
      order.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    );
    order.status = OrderStatus.CANCELLED;
    await order.save();
    return order;
  }

  // ---- Admin ----

  /** All orders across every user (admin only). */
  findAll() {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  /** Admin transitions an order to a new status. */
  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await this.findByIdOrThrow(orderId);
    order.status = status;
    await order.save();
    return order;
  }

  // ---- helpers ----

  private async findByIdOrThrow(orderId: string) {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return order;
  }

  private async restock(
    items: Array<{ productId: Types.ObjectId; quantity: number }>,
  ) {
    for (const item of items) {
      await this.productModel
        .updateOne({ _id: item.productId }, { $inc: { stock: item.quantity } })
        .exec();
    }
  }
}
