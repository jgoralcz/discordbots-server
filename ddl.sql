CREATE TABLE IF NOT EXISTS "clientsTable" (
  "userId" varchar(32) PRIMARY KEY NOT NULL,
  prefix varchar(51) NOT NULL DEFAULT 'b.',
  "paidRespectsCount" INTEGER NOT NULL DEFAULT 0,
  "allowGuild" BOOLEAN NOT NULL DEFAULT FALSE,
  "allowGuildId" varchar(32),
  "allowAnyone" BOOLEAN NOT NULL DEFAULT FALSE,
  "bankPoints" INTEGER DEFAULT 0,
  game_points INTEGER DEFAULT 0,
  waifu_list_title varchar(200),
  pokemon_list_title varchar(200),
  amiibo_list_title varchar(200),
  daily_gather BOOLEAN,
  waifu_list_url varchar(128),
  streak_daily INTEGER DEFAULT 0,
  streak_daily_date timestamp,
  streak_vote INTEGER DEFAULT 0,
  streak_vote_date timestamp,
  vote_date timestamp,
  vote_enabled BOOLEAN,
  donut INTEGER DEFAULT 0,
  pizza INTEGER DEFAULT 0,
  cookie INTEGER DEFAULT 0,
  fuel INTEGER DEFAULT 0,
  ramen INTEGER DEFAULT 0,
  stones TEXT ARRAY,
  patron BOOLEAN NOT NULL DEFAULT FALSE,
  anime_reactions BOOLEAN NOT NULL DEFAULT FALSE,
  waifu_guess_correct INTEGER NOT NULL DEFAULT 0,
  waifu_guess_wrong INTEGER NOT NULL DEFAULT 0,
  series_guess_correct INTEGER NOT NULL DEFAULT 0,
  series_guess_wrong INTEGER NOT NULL DEFAULT 0,
  user_roll_claimed BOOLEAN NOT NULL DEFAULT TRUE,
  play_first BOOLEAN NOT NULL DEFAULT TRUE,
  gauntlet BOOLEAN NOT NULL DEFAULT FALSE,
  gauntlet_quest_complete BOOLEAN NOT NULL DEFAULT FALSE,
  achievement_sniper BOOLEAN NOT NULL DEFAULT FALSE,
  achievement_tag BOOLEAN NOT NULL DEFAULT FALSE,
  sniped BOOLEAN NOT NULL DEFAULT FALSE,
  pats INTEGER NOT NULL DEFAULT 0,
  owoify BOOLEAN NOT NULL DEFAULT FALSE,
  achievement_aki BOOLEAN NOT NULL DEFAULT FALSE,
  achievement_reddit BOOLEAN NOT NULL DEFAULT FALSE,
  achievement_search_anime BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE IF NOT EXISTS "guildsTable" (
  "guildId" varchar(32) PRIMARY KEY NOT NULL,
  "prefixForAllEnable" BOOLEAN NOT NULL DEFAULT TRUE,
  "guildPrefix" varchar(11) NOT NULL DEFAULT 'b.',
  "maxVolume" SMALLINT NOT NULL DEFAULT 500,
  "voteSkip" SMALLINT NOT NULL DEFAULT 50,
  auto_now_play BOOLEAN NOT NULL DEFAULT FALSE,
  show_skips BOOLEAN NOT NULL DEFAULT TRUE,
  max_songs_per_user SMALLINT NOT NULL DEFAULT 1000,
  patron_one BOOLEAN NOT NULL DEFAULT FALSE,
  patron_two BOOLEAN NOT NULL DEFAULT FALSE,
  claim_seconds SMALLINT NOT NULL DEFAULT 120,
  unlimited_claims BOOLEAN NOT NULL DEFAULT FALSE,
  roll_claimed BOOLEAN NOT NULL DEFAULT FALSE,
  shuffle_index SMALLINT NOT NULL DEFAULT 0,
  seek INTEGER NOT NULL DEFAULT 0,
  volume NUMERIC NOT NULL DEFAULT 0,
  loop varchar(3) NOT NULL default 'off',
  shuffle BOOLEAN NOT NULL DEFAULT FALSE,
  bass_boost NUMERIC NOT NULL DEFAULT 0,
  auto_timeout BOOLEAN NOT NULL DEFAULT FALSE,
  autoplay BOOLEAN NOT NULL DEFAULT FALSE,
  roll_claim_minute SMALLINT NOT NULL DEFAULT 0,
  wait_minutes SMALLINT NOT NULL DEFAULT 0,
  dj_only BOOLEAN NOT NULL DEFAULT FALSE,
  buy_rolls BOOLEAN NOT NULL DEFAULT TRUE,
  buy_claims BOOLEAN NOT NULL DEFAULT FALSE,
  "severQueue" json[],
  music_channel varchar(32), -- music channel I send messages to.
  voice_channel varchar(32), -- last voice channel I was in
  vote_skippers varchar(32)[],
  queue_last_updated TIMESTAMP
);
create index idx_server_queue_date_added on "guildsTable"(queue_last_updated);


CREATE TABLE IF NOT EXISTS "clientsGuildsTable" (
  id varchar(65) PRIMARY KEY NOT NULL,
  "userId" varchar(32) NOT NULL REFERENCES "clientsTable" ON DELETE CASCADE ON UPDATE CASCADE,
  "guildId" varchar(32) NOT NULL REFERENCES "guildsTable",
  "friendsFromServer" TEXT ARRAY,
  "totalFriends" INTEGER DEFAULT 0,
  "marryFromServer" TEXT ARRAY,
  "totalMarriages" INTEGER DEFAULT 0,
  daily BOOLEAN,
  streak INTEGER DEFAULT 0,
  streak_date timestamp,
  rolls_waifu SMALLINT DEFAULT 0,
  claim_waifu BOOLEAN,
  public_wish_list BOOLEAN DEFAULT FALSE,
  anime_rolls BOOLEAN DEFAULT TRUE,
  UNIQUE("userId", "guildId")
);
-- TODO: normalize friendsFromServer an marryFromServer
CREATE UNIQUE INDEX IF NOT EXISTS client_guild ON "clientsGuildsTable"("userId", "guildId");
CREATE INDEX IF NOT EXISTS idx_claim_waifu ON "clientsGuildsTable"(claim_waifu);
CREATE INDEX IF NOT EXISTS idx_rolls_waifu ON "clientsGuildsTable"(rolls_waifu);
CREATE INDEX IF NOT EXISTS idx_total_friends ON "clientsGuildsTable"("totalFriends");
CREATE INDEX IF NOT EXISTS idx_total_f ON "clientsGuildsTable"("totalMarriages");

CREATE TABLE IF NOT EXISTS guild_lastplayed_queue (
  guild_id varchar(32) NOT NULL REFERENCES "guildsTable"("guildId"),
  track JSON NOT NULL,
  date_added timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_last_played_date_added ON guild_lastplayed_queue(date_added);


