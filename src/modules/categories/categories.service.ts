import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Body, Param } from '@nestjs/common';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  create(@Body() createCategoryDto: CreateCategoryDto) {
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  findAll() {
    return this.categoryModel.find().exec();
  }

  findOne(@Param('id') id: string) {
    return this.categoryModel.findById(id).exec();
  }

  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<UpdateCategoryDto>,
  ) {
    return this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
  }

  delete(@Param('id') id: string) {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }
}
