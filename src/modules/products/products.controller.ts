import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Admin only: create products
  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: any) {
    return this.productsService.create(body);
  }

  // Public: anyone can browse products
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Logged-in users only: view a single product
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // Admin only: update products
  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  // Admin only: delete products
  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
