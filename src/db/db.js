const { Pool } = require('pg');
const { db, prefix } = require('../../config.json');

const pool = new Pool(db);

/**
 * updates a user when they vote.
 * @param userID the user's id.
 * @param points the user's bank points to update.
 * @param vote_date the date to add to the vote.
 * @param streak_vote_date the streak date to add
 * @returns {Promise<*>}
 */
const updateUserBankPointsVote = async (userID, points, vote_date, streak_vote_date) => {
  const client = await pool.connect();
  try {
    return await client.query(`
      UPDATE "clientsTable"
      SET "bankPoints" = "bankPoints" + $2, vote_date = $3, streak_vote_date = $4, vote_enabled = TRUE, streak_vote = streak_vote + 1
      WHERE "userId" = $1
      RETURNING *;
    `, [userID, points, vote_date, streak_vote_date]);
  } finally {
    client.release();
  }
};

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
const checkUserExists = async (userID) => {
  const client = await pool.connect();
  try {
    return await client.query(`
      SELECT *
      FROM "clientsTable"
      WHERE "userId" = $1;
    `, [userID]);
  } finally {
    client.release();
  }
};

/**
 * sets the new user info
 * @param userInfo the user's info
 * @returns {Promise<*>}
 */
const setUserInfo = async (userInfo) => {
  const client = await pool.connect();
  try {
    return await client.query(`
      INSERT INTO "clientsTable" ("userId", "prefix")
      VALUES ($1, $2)
      ON CONFLICT("userId") DO NOTHING
      RETURNING *;
    `, [userInfo.userId, userInfo.prefix]);
  } finally {
    client.release();
  }
};

module.exports = {
  updateUserBankPointsVote,
  initializeGetUserInfo,
};
