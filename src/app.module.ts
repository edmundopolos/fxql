import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FxqlModule } from './fxql/fxql.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'fxql123',
      database: 'fxql',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Use only for development; not recommended in production
    }),FxqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
