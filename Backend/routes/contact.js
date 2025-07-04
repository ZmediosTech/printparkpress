import Contact from "../models/Contact.js";
import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const app = express();
app.use(bodyParser.json());
const generateAdminEmail = (contact) => `
  <h2>New Contact Message</h2>
  <p><strong>Name:</strong> ${contact.name}</p>
  <p><strong>Email:</strong> ${contact.email}</p>
  <p><strong>Message:</strong><br>${contact.message}</p>
`;

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Send confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "We will get back to you soon",
      html: `<p>Dear ${name},</p><p>Thank you for contacting us. We have received your message and will get back to you shortly.</p><p>Regards,<br/>Print Pres</p>`,
    };

    // Send notification email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_FROM,
      to: "manish@yopmail.com",
      subject: "New Contact Form Submission",
      html: generateAdminEmail(newContact),
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ success: true, message: "We will contact you soon." });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
});
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    if (contacts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No contacts found",
      });
    }
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
export default router;
