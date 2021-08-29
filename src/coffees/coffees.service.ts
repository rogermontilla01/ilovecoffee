import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
  ) { }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery
    return await this.coffeeRepository.find({
      relations: ["flavors"],
      skip: offset, //saltar una cantidad de resultados
      take: limit, //tomar una cantidad de resultados
    });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne(id, { relations: ["flavors"] });
    if (!coffee) throw new NotFoundException(`Coffee #${id} not found`)
    return coffee
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
    )

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    })

    return this.coffeeRepository.save(coffee)
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {

    //validate if the dto contains a flavor before updating de object
    const flavors = updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
      ));

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors
    })
    if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);
    return await this.coffeeRepository.save(coffee)
  }

  async remove(id: string) {
    const coffee = await this.coffeeRepository.findOne(id);
    return await this.coffeeRepository.remove(coffee)
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      coffee.recommendations++ // se incrementa si el cafe fue recomendado

      const recommendEvent = new Event() //se guarda el evento recomendacion
      recommendEvent.name = "recommend_coffee";
      recommendEvent.type = "coffee"
      recommendEvent.payload = { coffeeId: coffee.id }

      await queryRunner.manager.save(coffee) // guarda la venta del cafe
      await queryRunner.manager.save(recommendEvent) // guarda el evento recomendacion

      await queryRunner.commitTransaction() // ejecuta la transaccion
    } catch (err) {
      await queryRunner.rollbackTransaction() // revierte la transaccion si hay un error
    } finally {
      await queryRunner.release() // libera la transaccion
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
