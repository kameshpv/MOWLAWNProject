import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MowLawnModule } from './mow_lawn/mowlawn.module'

@Module({
  imports: [
    MowLawnModule,
    MongooseModule.forRoot(
    'mongodb+srv://kameshpv:Sheru123*@cluster0-klywr.mongodb.net/mow-lawndb?retryWrites=true&w=majority'
    )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
