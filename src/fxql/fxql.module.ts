import { Body, Get, Module, Param, Patch, Post } from '@nestjs/common';
import { FxqlController } from './fxql.controller';
import { FxqlService } from './fxql.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forex } from './fxql.entity';

@Module({
    controllers: [FxqlController],
    providers: [FxqlService],
     imports: [TypeOrmModule.forFeature([Forex])]
})
export class FxqlModule {

   
}
