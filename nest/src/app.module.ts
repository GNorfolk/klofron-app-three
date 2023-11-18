import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from './person/person.module';
import { FamilyModule } from './family/family.module';
import { HouseModule } from './house/house.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'klofron-app-three',
      autoLoadEntities: true,
    }),
    PersonModule,
    FamilyModule,
    HouseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
