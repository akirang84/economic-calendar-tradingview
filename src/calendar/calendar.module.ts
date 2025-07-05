import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
