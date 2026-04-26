"use client";

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type React from "react";
import { useMemo } from "react";

import type { CalendarEvent } from "./types";
import { DraggableEvent } from "./draggable-event";
import { DroppableCell } from "./droppable-cell";
import { EventItem } from "./event-item";
import { getEventsForDay, getSpanningEventsForDay, sortEvents } from "./utils";
import { DefaultStartHour } from "@/components/event-calendar/constants";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  onEventCreate: (startTime: Date) => void;
}

export function MonthView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
}: MonthViewProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ end: calendarEnd, start: calendarStart });
  }, [currentDate]);

  const weekdays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(startOfWeek(new Date()), i);
      return format(date, "EEE");
    });
  }, []);

  const weeks = useMemo<Date[][]>(() => {
    const result: Date[][] = [];
    let week: Date[] = [];

    for (let i = 0; i < days.length; i++) {
      week.push(days[i]);

      if (week.length === 7 || i === days.length - 1) {
        result.push(week);
        week = [];
      }
    }

    while (result.length < 6) {
      const lastWeek = result[result.length - 1];
      const lastDay = lastWeek[lastWeek.length - 1];

      const nextWeek: Date[] = Array.from({ length: 7 }).map((_, index) =>
        addDays(lastDay, index + 1),
      );

      result.push(nextWeek);
    }

    return result;
  }, [days]);

  function handleEventClick(event: CalendarEvent, e: React.MouseEvent) {
    e.stopPropagation();
    onEventSelect(event);
  }

  return (
    <div className="flex h-full min-h-[650px] flex-col" data-slot="month-view">
      <div className="grid h-11 shrink-0 grid-cols-7 border-border/70 border-b">
        {weekdays.map((day) => (
          <div
            className="flex items-center justify-center text-center text-muted-foreground/70 text-sm"
            key={day}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-rows-6">
        {weeks.map((week) => (
          <div
            className="grid min-h-0 grid-cols-7 [&:last-child>*]:border-b-0"
            key={`week-${week[0].toISOString()}`}
          >
            {week.map((day) => {
              const dayEvents = getEventsForDay(events, day);
              const spanningEvents = getSpanningEventsForDay(events, day);
              const allDayEvents = [...spanningEvents, ...dayEvents];
              const isCurrentMonth = isSameMonth(day, currentDate);
              const cellId = `month-cell-${day.toISOString()}`;

              return (
                <div
                  className="group min-h-0 border-border/70 border-r border-b last:border-r-0 data-outside-cell:bg-muted/25 data-outside-cell:text-muted-foreground/70"
                  data-outside-cell={!isCurrentMonth || undefined}
                  data-today={isToday(day) || undefined}
                  key={day.toString()}
                >
                  <DroppableCell
                    date={day}
                    id={cellId}
                    onClick={() => {
                      const startTime = new Date(day);
                      startTime.setHours(DefaultStartHour, 0, 0);
                      onEventCreate(startTime);
                    }}
                  >
                    <div className="mt-1 inline-flex size-6 items-center justify-center rounded-full text-sm group-data-today:bg-primary group-data-today:text-primary-foreground">
                      {format(day, "d")}
                    </div>

                    <div className="mt-1 min-h-[54px] space-y-1">
                      {sortEvents(allDayEvents).map((event) => {
                        const eventStart = new Date(event.start);
                        const eventEnd = new Date(event.end);
                        const isFirstDay = isSameDay(day, eventStart);
                        const isLastDay = isSameDay(day, eventEnd);

                        if (!isFirstDay) {
                          return (
                            <div
                              key={`spanning-${event.id}-${day
                                .toISOString()
                                .slice(0, 10)}`}
                            >
                              <EventItem
                                event={event}
                                isFirstDay={isFirstDay}
                                isLastDay={isLastDay}
                                onClick={(e) => handleEventClick(event, e)}
                                view="month"
                              >
                                <div aria-hidden={true} className="invisible">
                                  {!event.allDay && (
                                    <span>
                                      {format(
                                        new Date(event.start),
                                        "h:mm",
                                      )}{" "}
                                    </span>
                                  )}
                                  {event.title}
                                </div>
                              </EventItem>
                            </div>
                          );
                        }

                        return (
                          <div key={event.id}>
                            <DraggableEvent
                              event={event}
                              isFirstDay={isFirstDay}
                              isLastDay={isLastDay}
                              onClick={(e) => handleEventClick(event, e)}
                              view="month"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </DroppableCell>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
