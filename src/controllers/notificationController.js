const { sendEmail } = require("../services/emailService");
const {
  createNotification,
  updateStatus,
  getUserNotifications,
} = require("../models/notificationModel");

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const parseRecipients = (value) => {
  const input = Array.isArray(value) ? value.join(",") : value;
  if (typeof input !== "string") return [];
  return [
    ...new Set(
      input
        .split(/[,;\n]+/)
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
};

const sendNotification = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const recipients = parseRecipients(
      req.body.recipients || req.body.recipient,
    );

    if (
      !recipients.length ||
      recipients.some((recipient) => !isValidEmail(recipient)) ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res
        .status(400)
        .json({
          message:
            "Add one or more valid email addresses, a subject, and a message",
        });
    }

    if (
      recipients.length > 50 ||
      recipients.some((recipient) => recipient.length > 255) ||
      subject.length > 200 ||
      message.length > 10000
    ) {
      return res
        .status(400)
        .json({ message: "Notification content exceeds the allowed length" });
    }

    const deliveries = await Promise.all(
      recipients.map(async (recipient) => {
        const notification = await createNotification(
          req.user.id,
          recipient,
          subject.trim(),
          message.trim(),
        );
        try {
          await sendEmail(
            recipient,
            subject.trim(),
            message.trim(),
            req.user.email,
          );
          await updateStatus(notification.id, "SENT");
          return { recipient, status: "SENT" };
        } catch (emailError) {
          await updateStatus(notification.id, "FAILED");
          console.error(
            `Email delivery to ${recipient} failed:`,
            emailError.message,
          );
          return { recipient, status: "FAILED" };
        }
      }),
    );

    const sent = deliveries.filter(
      (delivery) => delivery.status === "SENT",
    ).length;
    res.status(sent === recipients.length ? 200 : 207).json({
      message: `${sent} of ${recipients.length} email${recipients.length === 1 ? "" : "s"} sent`,
      deliveries,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      100,
    );
    const { notifications, total } = await getUserNotifications(
      req.user.id,
      limit,
      (page - 1) * limit,
    );

    res.status(200).json({
      notifications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  sendNotification,
  getNotifications,
};
