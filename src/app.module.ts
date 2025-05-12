import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'dani',
  database: 'hazo',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  ssl: false, // Disable in production
  }),AuthModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
