import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesModule } from './coffees.module';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {

  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModule: Model<Coffee>,
  ) { }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery
    return await this.coffeeModule
      .find()
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeModule.findById({ _id: id }).exec()
    if (!coffee) throw new NotFoundException(`Coffee #${id} not found`)
    return coffee
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModule(createCoffeeDto)
    return await coffee.save()
  }

  async update(id: string, updateCoffeeDto: any) {
    const existingCoffee = await this.coffeeModule
      .findOneAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
      .exec()

    if (!existingCoffee) throw new NotFoundException(`Coffee #${id} not found`)
    return existingCoffee
  }

  async remove(id: string) {
    const coffee = await this.findOne(id)
    return coffee.remove()
  }
}
