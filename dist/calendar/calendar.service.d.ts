import { HttpService } from "@nestjs/axios";
export declare class CalendarService {
    private readonly httpService;
    private readonly EVENT_API_URL;
    private readonly HEADERS;
    constructor(httpService: HttpService);
    fetchHighImportanceEvents: () => Promise<any>;
    parseEventTime: (time: any) => number[] | null;
    getCalendar(res: Response): Promise<void>;
}
//# sourceMappingURL=calendar.service.d.ts.map