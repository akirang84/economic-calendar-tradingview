import { NestFactory } from '@nestjs/core';
import {CalendarModule} from "./calendar/calendar.module";

async function bootstrap() {
    const app = await NestFactory.create(CalendarModule);
    await app.listen(process.env.PORT || 8889, "0.0.0.0");
}
bootstrap();
