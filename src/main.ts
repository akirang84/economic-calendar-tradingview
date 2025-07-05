import { NestFactory } from '@nestjs/core';
import {CalendarModule} from "./calendar/calendar.module";

async function bootstrap() {
    const app = await NestFactory.create(CalendarModule);
    app.enableCors(); // in case frontend or Calendar app requires it
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
