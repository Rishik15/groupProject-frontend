"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { differenceInDays } from "date-fns";
import { useRef, useState } from "react";

import type { CalendarEvent } from "./types";
import { EventItem } from "./event-item";
import { useCalendarDnd } from "./calendar-dnd-context";

type CalendarEventWithDrag = CalendarEvent & {
  isDraggable?: boolean;
};

interface DraggableEventProps {
  event: CalendarEventWithDrag;
  view: "month" | "week" | "day";
  showTime?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  height?: number;
  isMultiDay?: boolean;
  multiDayWidth?: number;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  "aria-hidden"?: boolean | "true" | "false";
}

export function DraggableEvent({
  event,
  view,
  showTime,
  onClick,
  height,
  isMultiDay,
  multiDayWidth,
  isFirstDay = true,
  isLastDay = true,
  "aria-hidden": ariaHidden,
}: DraggableEventProps) {
  const { activeId } = useCalendarDnd();
  const elementRef = useRef<HTMLDivElement>(null);
  const [dragHandlePosition, setDragHandlePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const isEventDraggable = event.isDraggable !== false;

  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  const isMultiDayEvent =
    isMultiDay || event.allDay || differenceInDays(eventEnd, eventStart) >= 1;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${event.id}-${view}`,
      disabled: !isEventDraggable,
      data: {
        dragHandlePosition,
        event,
        height: height || elementRef.current?.offsetHeight || null,
        isFirstDay,
        isLastDay,
        isMultiDay: isMultiDayEvent,
        multiDayWidth: multiDayWidth,
        view,
      },
    });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEventDraggable) {
      return;
    }

    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setDragHandlePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  if (isDragging || activeId === `${event.id}-${view}`) {
    return (
      <div
        className="opacity-0"
        ref={setNodeRef}
        style={{ height: height || "auto" }}
      />
    );
  }

  const style = transform
    ? {
      height: height || "auto",
      transform: CSS.Translate.toString(transform),
      width:
        isMultiDayEvent && multiDayWidth ? `${multiDayWidth}%` : undefined,
    }
    : {
      height: height || "auto",
      width:
        isMultiDayEvent && multiDayWidth ? `${multiDayWidth}%` : undefined,
    };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isEventDraggable) {
      return;
    }

    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        setDragHandlePosition({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
      }
    }
  };

  return (
    <div
      className={isEventDraggable ? "touch-none" : undefined}
      ref={(node) => {
        setNodeRef(node);
        elementRef.current = node;
      }}
      style={style}
    >
      <EventItem
        aria-hidden={ariaHidden}
        dndAttributes={isEventDraggable ? attributes : undefined}
        dndListeners={isEventDraggable ? listeners : undefined}
        event={event}
        isDragging={isDragging}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        onMouseDown={isEventDraggable ? handleMouseDown : undefined}
        onTouchStart={isEventDraggable ? handleTouchStart : undefined}
        showTime={showTime}
        view={view}
      />
    </div>
  );
}