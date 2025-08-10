import type { EventDataMap } from "./gamelogic/dixitLogic";

export interface BaseEvent<T extends keyof EventDataMap = keyof EventDataMap> {
  id: string;
  lobby_id: string;
  event_type: T;
  event_data: EventDataMap[T];
  created_at: string;
}
