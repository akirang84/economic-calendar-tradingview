import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";
import {createEvents, EventAttributes} from "ics";

@Injectable()
export class CalendarService {

    private readonly EVENT_API_URL = "https://economic-calendar.tradingview.com/events";
    private readonly HEADERS = {Origin: "https://www.tradingview.com"};

    constructor(private readonly httpService: HttpService) {
    }

    fetchHighImportanceEvents = async () => {
        const now = new Date();

        // Start of the current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            .toISOString()
            .replace(/\.\d+Z$/, ".000Z");

        // End of the current month
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
            .toISOString()
            .replace(/\.\d+Z$/, ".000Z");

        const params = {
            from: startOfMonth,
            to: endOfMonth,
            countries: "US", // Filter for specific countries
            importance: 3, // High importance events only
        };

        const response = await firstValueFrom(
            this.httpService.get(this.EVENT_API_URL, {
                headers: this.HEADERS,
                params,
            })
        );

        return response.data.result;
    };

    parseEventTime = (time: any): number[] | null => {
        if (!time) return null; // Check for undefined or null
        const date = new Date(time);
        if (isNaN(date.getTime())) return null; // Invalid date
        return date.toISOString().split(/[-T:.]/).slice(0, 6).map(Number);
    };

    async getCalendar(res: Response) {
        try {
            // Fetch high-importance events
            const eventsData = await this.fetchHighImportanceEvents();

            // Convert API events to iCalendar format
            const events: EventAttributes[] = eventsData.map((event: any) => {
                const importance = event.importance;

                if (!importance || importance <= 0) return null;

                const start = this.parseEventTime(event.date);
                if (!start) {
                    console.warn(`Skipping invalid event time: ${event.time}`, event);
                    return null; // Skip invalid events
                }

                return {
                    uid: `akira-eco-cal-tradingview-${event.id}`,
                    title: event.title || "Economic Event",
                    description: `${event.indicator}

Source: ${event.source}.
SourceUrl: ${event.source_url}.
Previous: ${event.previous}.
Forecast: ${event.forecast}.
Period: ${event.period}.

${event.comment}`,
                    start: start,
                    duration: {minutes: 15},
                    location: event.country || "No location",
                    alarms: [
                        {
                            action: "display", // Type of alarm
                            trigger: 0, // Trigger at event time
                            description: `${event.title || "Economic Event"}`,
                        },
                    ],
                };
            }).filter(Boolean); // Remove invalid events;

            if (events.length === 0) {
                console.log('No valid events found for the current month.');
                return;
            }

            // Generate ICS file
            const {error, value} = createEvents(events);
            if (error) {
                throw new Error("Failed to generate ICS: " + error.message);
            }

            // Set response headers for ICS
            // @ts-ignore
            res.setHeader("Content-Type", "text/calendar; charset=utf-8");
            // @ts-ignore
            res.setHeader("Content-Disposition", 'attachment; filename="high_important_calendar.ics"');
            // @ts-ignore
            res.status(200).send(value);
        } catch (error) {
            console.error("Error generating calendar feed:", error);
            // @ts-ignore
            res.status(500).send("Error generating calendar feed.");
        }
    }
}
