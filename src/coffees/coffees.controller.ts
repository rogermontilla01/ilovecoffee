import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CoffeesService } from './coffees.service';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {

  }

  @Get()
  findAll(@Query() paginationQuery: any) {
    // const { limit, offset } = paginationQuery;
    return this.coffeeService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.coffeeService.findOne(id)
  }

  @Post()
  create(@Body() body: any) {
    return this.coffeeService.create(body)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: any) {
    return this.coffeeService.update(id, body)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.coffeeService.remove(id)
  }
}
