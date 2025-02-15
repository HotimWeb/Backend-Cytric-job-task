import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NftService } from './nft/nft.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NftSchema } from './nft/nft.model';
import { ConfigModule } from '@nestjs/config';
import { NftModule } from './nft/nft.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb+srv://samsonudo:65AnWll8xR6rmagY@nft.oqbox.mongodb.net/?retryWrites=true&w=majority&appName=nft'),
    MongooseModule.forFeature([{ name: 'Nft', schema: NftSchema }]),
    NftModule,
  ],
  controllers: [AppController],
  providers: [AppService, NftService],
})
export class AppModule { }