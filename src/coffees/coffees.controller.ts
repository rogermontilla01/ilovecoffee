import { Body, Controller, Delete, Get, Param, Patch, Post, Query, SetMetadata, } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Public } from "../common/decorators/public.decorator"
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("Coffees")
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {

  }

  @Get()
  @Public()
  @ApiForbiddenResponse({ description: "Forbidden." })
  async findAll(@Protocol("Http default") protocol: string, @Query() paginationQuery: PaginationQueryDto) {
    console.log("Protocol: ", protocol)
    // await new Promise(resolve => setTimeout(resolve, 5000))
    return this.coffeeService.findAll(paginationQuery)
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    console.log(id)
    return this.coffeeService.findOne("" + id)
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    console.log(createCoffeeDto instanceof CreateCoffeeDto)
    return this.coffeeService.create(createCoffeeDto)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeeService.update(id, updateCoffeeDto)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.coffeeService.remove(id)
  }
}
