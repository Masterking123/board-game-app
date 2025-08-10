-- Drop dependent tables first
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS lobby_users;
DROP TABLE IF EXISTS lobby;
DROP TABLE IF EXISTS game_states;

-- Recreate tables in the correct order
CREATE TABLE lobby (
    host_code TEXT, 
    id UUID PRIMARY KEY,
    game_route TEXT,
);

CREATE TABLE lobby_users (
    lobby_id UUID,
    user_name TEXT,
    is_host BOOLEAN,
    PRIMARY KEY (lobby_id, user_name),
    FOREIGN KEY (lobby_id) REFERENCES lobby(id)
);

CREATE TABLE events (
    id UUID PRIMARY KEY,
    lobby_id UUID,
    event_type TEXT,
    event_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (lobby_id) REFERENCES lobby(id)
);

 CREATE TABLE game_states (
    lobby_id UUID,
    user_name TEXT,
    game_state JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (lobby_id, user_name)
);