DROP TABLE lobby;
DROP TABLE lobby_users;

CREATE TABLE lobby (
    host_code TEXT, 
    id UUID,
    PRIMARY KEY (id)
);

CREATE TABLE lobby_users (
    lobby_id UUID,
    user_name TEXT,
    PRIMARY KEY (lobby_id, user_name),
    FOREIGN KEY (lobby_id) REFERENCES lobby(id)
);
