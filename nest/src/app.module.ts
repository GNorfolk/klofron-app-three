import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from './person/person.module';
import { FamilyModule } from './family/family.module';
import { HouseModule } from './house/house.module';
import { ResourceModule } from './resource/resource.module';
import { TradeModule } from './trade/trade.module';
import { UserModule } from './user/user.module';
import { ActionModule } from './action/action.module';

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
    ResourceModule,
    TradeModule,
    UserModule,
    ActionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
