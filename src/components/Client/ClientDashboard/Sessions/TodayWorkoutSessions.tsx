import { useCallback, useEffect, useState } from "react";
import { Card, Spinner, Tabs } from "@heroui/react";
import { CalendarDays } from "lucide-react";
import CustomModal from "@/components/global/Modal";
import ActivityLogModal from "@/components/ActivityLog/ActivityLogModal";

import {
  getActiveSession,
  getTodayScheduledSessions,
  startScheduledSession,
} from "@/services/Sessions/sessionService";

import type {
  ActiveWorkoutSession,
  ScheduledWorkoutSession,
} from "@/utils/Interfaces/Sessions/sessions";

import ActiveSessionCard from "./ActiveSessionCard";
import ScheduledSessionCard from "./ScheduledSessionCard";

interface TodayWorkoutSessionsProps {
  refreshKey?: number;
  onActivityLogged?: () => void;
}

const TodayWorkoutSessions = ({
  refreshKey,
  onActivityLogged,
}: TodayWorkoutSessionsProps) => {
  const [scheduledSessions, setScheduledSessions] = useState<
    ScheduledWorkoutSession[]
  >([]);

  const [activeSession, setActiveSession] =
    useState<ActiveWorkoutSession | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [startingEventId, setStartingEventId] = useState<number | null>(null);

  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );
  const [blockStartModalOpen, setBlockStartModalOpen] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);

      const [scheduledData, activeData] = await Promise.all([
        getTodayScheduledSessions(),
        getActiveSession(),
      ]);

      setScheduledSessions(scheduledData.events || []);
      setActiveSession(activeData.session || null);
    } catch (error) {
      console.error("Failed to load today workout sessions", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions, refreshKey]);

  const openActivityLog = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setIsActivityLogOpen(true);
  };

  const handleStartSession = async (eventId: number) => {
    if (activeSession) {
      setBlockStartModalOpen(true);
      return;
    }

    try {
      setStartingEventId(eventId);

      const data = await startScheduledSession(eventId);
      const sessionId = data.session?.sessionId;

      if (sessionId) {
        openActivityLog(sessionId);
      }

      await fetchSessions();
      onActivityLogged?.();
    } catch (error) {
      console.error("Failed to start scheduled session", error);
    } finally {
      setStartingEventId(null);
    }
  };

  const handleActivityLogged = async () => {
    await fetchSessions();
    onActivityLogged?.();
  };

  const handleWorkoutFinished = async () => {
    setIsActivityLogOpen(false);
    setSelectedSessionId(null);

    await fetchSessions();
    onActivityLogged?.();
  };

  return (
    <div className="mx-auto w-full px-38 py-3 pb-6">
      <Card className="w-full overflow-hidden rounded-3xl bg-white shadow-xs">
        <Card.Header className="flex flex-row items-center justify-between gap-2 border-b border-indigo-50 px-5 py-4">
          <div>
            <Card.Title className="text-lg font-semibold text-zinc-950">
              Today&apos;s Workout Sessions
            </Card.Title>
            <Card.Description className="mt-1 text-sm text-zinc-500">
              Start your scheduled workout or continue an active one.
            </Card.Description>
          </div>
        </Card.Header>

        <Card.Content className="px-5 py-2">
          {isLoading ? (
            <div className="flex min-h-24 items-center justify-center">
              <Spinner size="sm" />
            </div>
          ) : (
            <Tabs
              className="w-full"
              defaultSelectedKey="active"
              variant="primary"
            >
              <Tabs.ListContainer className="mb-2">
                <Tabs.List
                  aria-label="Workout session tabs"
                  className="flex w-fit gap-1 rounded-full bg-transparent *:relative *:h-8 *:rounded-full *:px-4 *:text-sm *:font-semibold *:text-zinc-600 *:data-[selected=true]:text-indigo-700"
                >
                  <Tabs.Tab id="active">
                    Active
                    <Tabs.Indicator className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm" />
                  </Tabs.Tab>

                  <Tabs.Tab id="scheduled">
                    Scheduled
                    <Tabs.Indicator className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm" />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>

              <Tabs.Panel id="active">
                <ActiveSessionCard
                  activeSession={activeSession}
                  onContinue={openActivityLog}
                />
              </Tabs.Panel>

              <Tabs.Panel id="scheduled">
                <div className="space-y-2">
                  {scheduledSessions.length === 0 ? (
                    <div className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-4 text-center">
                      <div className="mb-2 flex size-9 items-center justify-center rounded-xl bg-white text-indigo-500 shadow-sm">
                        <CalendarDays size={18} />
                      </div>

                      <p className="text-base font-semibold text-zinc-950">
                        No workouts scheduled today
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        Add a workout session from the calendar.
                      </p>
                    </div>
                  ) : (
                    scheduledSessions.map((session) => (
                      <ScheduledSessionCard
                        key={session.eventId}
                        session={session}
                        startingEventId={startingEventId}
                        onStart={handleStartSession}
                        onContinue={openActivityLog}
                      />
                    ))
                  )}
                </div>
              </Tabs.Panel>
            </Tabs>
          )}
        </Card.Content>
      </Card>

      <CustomModal
        isOpen={blockStartModalOpen}
        onClose={() => setBlockStartModalOpen(false)}
        title="Finish your active workout first"
      >
        You already have an active workout session. Finish that workout before
        starting another scheduled session.
      </CustomModal>

      {isActivityLogOpen && selectedSessionId && (
        <ActivityLogModal
          isOpen={isActivityLogOpen}
          sessionId={selectedSessionId}
          initialTab="strength"
          onClose={() => setIsActivityLogOpen(false)}
          onLogged={handleActivityLogged}
          onFinished={handleWorkoutFinished}
        />
      )}
    </div>
  );
};

export default TodayWorkoutSessions;
