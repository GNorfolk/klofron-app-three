import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from './person/person.module';
import { FamilyModule } from './family/family.module';
import { HouseModule } from './house/house.module';
import { ResourceModule } from './resource/resource.module';
import { TradeModule } from './trade/trade.module';
import { UserModule } from './user/user.module';
import { ActionModule } from './action/action.module';
import { MoveHouseModule } from './move-house/move-house.module';
import { BetrothalModule } from './betrothal/betrothal.module';
import { AuthModule } from './auth/auth.module';
import { HexModule } from './hex/hex.module';
import { ToolModule } from './tool/tool.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'ka3',
      autoLoadEntities: true,
    }),
    PersonModule,
    FamilyModule,
    HouseModule,
    ResourceModule,
    TradeModule,
    UserModule,
    ActionModule,
    MoveHouseModule,
    BetrothalModule,
    AuthModule,
    HexModule,
    ToolModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
