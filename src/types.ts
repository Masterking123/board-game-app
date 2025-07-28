export type EventType =
  | "game_started"
  | "player_voted"
  | "card_played"
  | "round_ended";

export interface GameStartedEvent {
  gameName: string;
  hostCode: string;
}

export interface EventDataMap {
  game_started: GameStartedEvent;
}

export interface BaseEvent<T extends keyof EventDataMap = keyof EventDataMap> {
  id: string;
  lobby_id: string;
  event_type: T;
  event_data: EventDataMap[T];
  created_at: string;
}

export interface BaseGameState {
  lobby_id: string;
  players: string[];
  currentRound: number;
  gameStarted: boolean;
  hostCode: string;
}
