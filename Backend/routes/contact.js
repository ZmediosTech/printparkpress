import Contact from "../models/Contact.js";
import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const app = express();
app.use(bodyParser.json());


router.post("/", async (req, res) => {
  const { phone, email, message } = req.body;

  // Basic validation
  if (!phone || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newContact = new Contact({ phone, email, message });
    await newContact.save();
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
      subject: "We will get back to you soon",
      html: `<p>Dear ${email},</p><p>Thank you for reaching out to us. We have received your message and will get back to you soon.</p><p>Best regards,</p><p>Glority</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({success:true, message: "We will contact you soon." });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
});
router.get("/",async (req,res)=>{
    try {
        const contacts = await Contact.find();
        if (contacts.length === 0) {
            return res.status(404).json({
                success:false,
                message:"No contacts found"
            })
        }
        res.status(200).json({
            success:true,
            count:contacts.length,
            data:contacts
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            error:error.message
        })
        
    }
})
export default router;
