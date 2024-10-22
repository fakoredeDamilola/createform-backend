import { Module } from '@nestjs/common';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { Response, ResponseSchema } from './schemas/response.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FormModule } from 'src/form/form.module';

@Module({
  imports: [
    FormModule,
    MongooseModule.forFeature([
      {
        name: Response.name,
        schema: ResponseSchema,
      },
    ]),
  ],
  controllers: [ResponseController],
  providers: [ResponseService],
})
export class ResponseModule {}
