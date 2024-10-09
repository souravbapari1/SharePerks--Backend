import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get()
  async getAll() {
    return await this.categoriesService.getAllCategories();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.categoriesService.getCategoryById(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() body: CreateCategoryDto) {
    return await this.categoriesService.createCategory(body);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return await this.categoriesService.updateCategory(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string) {
    return await this.categoriesService.deleteCategory(id);
  }
}
