const db = require("../config/db");

const createNotification = async (
    userId,
    recipient,
    subject,
    message,
    status = "PENDING"
) => {
    const result = await db.query(
        `INSERT INTO notifications
        (user_id, recipient, subject, message, status)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *`,
        [userId, recipient, subject, message, status]
    );

    return result.rows[0];
};

const updateStatus = async (id, status) => {
    const result = await db.query(
        "UPDATE notifications SET status=$1 WHERE id=$2",
        [status, id]
    );
    return { id, status, updated: result.rowCount === 1 };
};

const getUserNotifications = async (userId, limit, offset) => {
    const result = await db.query(
        `SELECT
            id,
            recipient,
            subject,
            message,
            status,
            created_at
         FROM notifications
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    );

    const countResult = await db.query("SELECT COUNT(*)::int AS total FROM notifications WHERE user_id = $1", [userId]);
    return { notifications: result.rows, total: countResult.rows[0].total };
};

module.exports = {
    createNotification,
    updateStatus,
      getUserNotifications
};
