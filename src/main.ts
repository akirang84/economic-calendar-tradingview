import { NestFactory } from '@nestjs/core';
import {CalendarModule} from "./calendar/calendar.module";

async function bootstrap() {
    const app = await NestFactory.create(CalendarModule);
    const port = process.env.PORT || 8889;
    await app.listen(port, "0.0.0.0");
    console.log(`Server is running on port ${port}`, );
}
bootstrap();
