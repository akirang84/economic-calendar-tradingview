"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const ics_1 = require("ics");
let CalendarService = class CalendarService {
    constructor(httpService) {
        this.httpService = httpService;
        this.EVENT_API_URL = "https://economic-calendar.tradingview.com/events";
        this.HEADERS = { Origin: "https://www.tradingview.com" };
        this.fetchHighImportanceEvents = async () => {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
                .toISOString()
                .replace(/\.\d+Z$/, ".000Z");
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
                .toISOString()
                .replace(/\.\d+Z$/, ".000Z");
            const params = {
                from: startOfMonth,
                to: endOfMonth,
                countries: "US",
                importance: 3,
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(this.EVENT_API_URL, {
                headers: this.HEADERS,
                params,
            }));
            return response.data.result;
        };
        this.parseEventTime = (time) => {
            if (!time)
                return null;
            const date = new Date(time);
            if (isNaN(date.getTime()))
                return null;
            return date.toISOString().split(/[-T:.]/).slice(0, 6).map(Number);
        };
    }
    async getCalendar(res) {
        try {
            const eventsData = await this.fetchHighImportanceEvents();
            const events = eventsData.map((event) => {
                const importance = event.importance;
                if (!importance || importance <= 0)
                    return null;
                const start = this.parseEventTime(event.date);
                if (!start) {
                    console.warn(`Skipping invalid event time: ${event.time}`, event);
                    return null;
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
                    duration: { minutes: 15 },
                    location: event.country || "No location",
                    alarms: [
                        {
                            action: "display",
                            trigger: 0,
                            description: `${event.title || "Economic Event"}`,
                        },
                    ],
                };
            }).filter(Boolean);
            if (events.length === 0) {
                console.log('No valid events found for the current month.');
                return;
            }
            const { error, value } = (0, ics_1.createEvents)(events);
            if (error) {
                throw new Error("Failed to generate ICS: " + error.message);
            }
            res.setHeader("Content-Type", "text/calendar; charset=utf-8");
            res.setHeader("Content-Disposition", 'attachment; filename="high_important_calendar.ics"');
            res.status(200).send(value);
        }
        catch (error) {
            console.error("Error generating calendar feed:", error);
            res.status(500).send("Error generating calendar feed.");
        }
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map