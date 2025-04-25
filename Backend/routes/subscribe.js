import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const app = express();
// app.use(bodyParser.json());

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is  required." });
  }
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Thank you for subscribing",
      html: `<p>Dear Subscriber,</p>
<p>Thank you for subscribing! You'll receive all the latest updates about our new products via email.</p>
<p>Best regards,</p>
<p>Glority Team</p>`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({success:true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});
export default router;