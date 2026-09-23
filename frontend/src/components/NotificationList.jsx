import "./Notificationlist.css";
function NotificationList({ notifications }) {
  return (
    <div className="card">
      <div className="card-title">
        <div>
          <p className="eyebrow">RECENT ACTIVITY</p>
          <h2>Delivery history</h2>
        </div>
        <span className="history-count">{notifications.length} records</span>
      </div>

      {/* Horizontal scrolling keeps all columns usable on phones. */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Sent at</th>
            </tr>
          </thead>

          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan="4">
                  No notifications found. Send your first email above.
                </td>
              </tr>
            ) : (
              notifications.map((notification) => (
                <tr key={notification.id}>
                  <td>{notification.recipient}</td>
                  <td>{notification.subject}</td>
                  <td>
                    <span
                      className={`status ${notification.status.toLowerCase()}`}
                    >
                      {notification.status}
                    </span>
                  </td>
                  <td>{new Date(notification.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NotificationList;
