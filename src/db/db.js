const { Pool } = require('pg');
const { db, prefix } = require('../../config.json');

const pool = new Pool(db);

/**
 * pool query function
 * @param {string} query the query to use against
 * @param {array<string>} paramsArray
 * @returns {Promise<*>}
 */
const poolQuery = async (query, paramsArray) => {
  const client = await pool.connect();
  try {
    return await client.query(query, paramsArray);
  } finally {
    client.release();
  }
};

/**
 * updates a user when they vote.
 * @param userID the user's id.
 * @param points the user's bank points to update.
 * @returns {Promise<*>}
 */
const updateUserBankPointsVote = async (userID, points) => pool.query(`
  UPDATE "clientsTable"
  SET "bankPoints" = "bankPoints" + $2, vote_date = NOW(), 
  streak_vote_date = NOW() + INTERVAL '2 days', vote_enabled = TRUE,
  streak_vote = streak_vote + 1
  WHERE "userId" = $1
  RETURNING *;
`, [userID, points]);

/**
 * stores a new user in the database.
 * @param userID the user's id.
 * @returns {Promise<void>}
 */
const initializeGetUserInfo = async (userID) => {
  let info = await checkUserExists(userID).catch(console.error);

  if (info != null && info.rowCount <= 0) {
    const startClientInfo = {
      userId: userID,
      prefix: prefix
    };

    //set and then get the info
    info = await setUserInfo(startClientInfo);
  }
  return info.rows[0];
};

/**
 * check if the user exists.
 * @param userID the user's id.
 * @returns {Promise<*>}
 */
const checkUserExists = async (userID) => poolQuery(`
  SELECT *
  FROM "clientsTable"
  WHERE "userId" = $1;
`, [userID]);

/**
 * sets the new user info
 * @param userInfo the user's info
 * @returns {Promise<*>}
 */
const setUserInfo = async (userInfo) => poolQuery(`
  INSERT INTO "clientsTable" ("userId", "prefix")
  VALUES ($1, $2)
  ON CONFLICT("userId") DO NOTHING
  RETURNING *;
`, [userInfo.userId, userInfo.prefix]);

/**
 * resets the rolls for everyone
 * @returns {Promise<*>}
 */
const resetRolls = async () => poolQuery(`
  UPDATE "clientsGuildsTable"
  SET rolls_waifu = 0
  WHERE rolls_waifu > 0;
`, []);

/**
 * resets the claims for non patron members
 * @returns {Promise<*>}
 */
const resetClaimsPlebs = async () => poolQuery(`
  UPDATE "clientsGuildsTable"
  SET claim_waifu = NULL
  WHERE claim_waifu IS NOT NULL AND
    "userId" IN (
      SELECT "userId"
      FROM "clientsTable"
      WHERE patron = FALSE AND "userId" IS NOT NULL AND patron IS NOT NULL
    )
  AND "guildId" IN (
    SELECT "guildId"
    FROM "guildsTable"
    WHERE patron_one = FALSE AND "guildId" IS NOT NULL AND patron_one IS NOT NULL
  );
`, []);

/**
 * resets the claims for patron members
 * @returns {Promise<*>}
 */
const resetClaimsPatrons = async () => poolQuery(`
  UPDATE "clientsGuildsTable"
  SET claim_waifu = NULL
  WHERE claim_waifu IS NOT NULL 
    AND (
      "userId" IN (
        SELECT "userId"
        FROM "clientsTable"
        WHERE patron = TRUE AND "userId" IS NOT NULL AND patron IS NOT NULL
      )
    OR
      "guildId" IN (
        SELECT "guildId"
        FROM "guildsTable"
        WHERE patron_one = TRUE AND "guildId" IS NOT NULL AND patron_one IS NOT NULL
      )
    );
`, []);

/**
 * refreshes everything
 * @returns {Promise<Promise<*>|*>}
 */
const refreshLeaderBoards = async () => poolQuery(`
  BEGIN;
  REFRESH MATERIALIZED VIEW mv_top_buy_amiibo;
  REFRESH MATERIALIZED VIEW mv_top_buy_waifu;
  REFRESH MATERIALIZED VIEW mv_top_claim_waifu;
  REFRESH MATERIALIZED VIEW mv_top_pokemon;
  COMMIT;
`, []);

/**
 * resets the claims for patron level two
 * @returns {Promise<void>}
 */
const resetClaimsPatronsTwo = async minute => poolQuery(`
  UPDATE "clientsGuildsTable"
  SET claim_waifu = NULL
  WHERE claim_waifu IS NOT NULL
    AND (
      "guildId" IN (
        SELECT "guildId"
        FROM "guildsTable"
        WHERE 
          patron_two = TRUE 
          AND "guildId" IS NOT NULL
          AND patron_two IS NOT NULL
          AND roll_claim_minute IS NOT NULL AND roll_claim_minute = $1
      )
    );
`, [minute]);

/**
 * resets the patrons for patron level two
 * @param minute the minute to look for when updating
 * @returns {Promise<void>}
 */
const resetRollsPatronsTwo = async minute => poolQuery(`
  UPDATE "clientsGuildsTable"
  SET rolls_waifu = 0
  WHERE rolls_waifu IS NOT NULL AND rolls_waifu > 0
    AND (
      "guildId" IN (
        SELECT "guildId"
        FROM "guildsTable"
        WHERE patron_two = TRUE and "guildId" IS NOT NULL AND patron_two IS NOT NULL
          AND roll_claim_minute IS NOT NULL AND roll_claim_minute = $1
      )
    );
`, [minute]);

/**
 * clears all streaks if they're before a certain date.
 * @returns {Promise<*>}
 */
const clearStreaks = async () => poolQuery(`
  UPDATE "clientsGuildsTable"
  SET streak = 0, streak_date = NULL
  WHERE streak_date <= NOW();
`, []);

/**
 * clears the vote streak where the time has passed.
 * @returns {Promise<*>}
 */
const clearVoteStreaks = async () => poolQuery(`
  UPDATE "clientsTable"
  SET streak_vote = 0, streak_vote_date = NULL
  WHERE streak_vote_date <= NOW();
`, []);

/**
 * updates the guilds that are waiting
 * @returns {Promise<void>}
 */
const updateClaimsRollsPatronsWaiting = async () => poolQuery(`
  UPDATE "guildsTable"
  SET roll_claim_minute = wait_minutes, wait_minutes = 0
  WHERE wait_minutes > 0;
`, []);

module.exports = {
  updateUserBankPointsVote,
  initializeGetUserInfo,
  resetRolls,
  resetClaimsPlebs,
  resetClaimsPatrons,
  refreshLeaderBoards,
  resetClaimsPatronsTwo,
  resetRollsPatronsTwo,
  clearStreaks,
  clearVoteStreaks,
  updateClaimsRollsPatronsWaiting,
};
