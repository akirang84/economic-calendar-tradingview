import {Controller, Get, Res} from '@nestjs/common';
import {CalendarService} from './calendar.service';

@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) {
    }

    @Get()
    getCalendar(@Res() res: Response) {
        return this.calendarService.getCalendar(res);
    }
}
