import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import coffeesConfig from '../config/coffees.config';
// import { Event } from '../events/entities/event.entity';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from '../coffees/coffees.service';
import { Coffee } from '../coffees/entities/coffee.entity';
import { Flavor } from '../coffees/entities/flavor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor]), ConfigModule.forFeature(coffeesConfig)],
  controllers: [CoffeesController],
  providers: [CoffeesService],
  exports: [CoffeesService]
})
export class CoffeesModule { }
