import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categories, CategoriesDocument } from 'src/schemas/categories.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Categories.name)
    private readonly categoriesModel: Model<CategoriesDocument>,
  ) {}

  // Create a new category
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Categories> {
    try {
      const newCategory = new this.categoriesModel(createCategoryDto);
      return await newCategory.save();
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException('Category with this name already exists');
      }
      throw error; // Rethrow unexpected errors
    }
  }

  // Get all categories
  async getAllCategories(): Promise<Categories[]> {
    return await this.categoriesModel.find().exec();
  }

  // Get a single category by ID
  async getCategoryById(id: string): Promise<Categories> {
    const category = await this.categoriesModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  // Update an existing category by ID
  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Categories> {
    const updatedCategory = await this.categoriesModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true }, // Return the updated document
    );
    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return updatedCategory;
  }

  // Delete a category by ID
  async deleteCategory(id: string): Promise<{ message: string }> {
    const result = await this.categoriesModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return { message: 'Category deleted successfully' };
  }
}
