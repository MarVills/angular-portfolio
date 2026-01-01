import express from "express";
import cors from "cors";
import { Resend } from "resend";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_FILES = 30;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: MAX_FILES, // allow up to 30 files
    fileSize: MAX_TOTAL_SIZE, // absolute max per file
  },
});

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
      // from: "New message from your portfolio  <contact@marvills.dev>",
      from: "Marvills Portfolio Message <onboarding@resend.dev>",
      to: ["villaflormarbenc@gmail.com"],
      subject: `Portfolio Message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

app.post("/send-email-with-attachment", upload.array("attachments"), async (req, res) => {
  try {
    const files = req.files || [];
    const { name, email, subject, message } = req.body;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    // BASIC VALIDATION
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }
    // TOTAL SIZE VALIDATION
    if (totalSize > MAX_TOTAL_SIZE) {
      return res.status(400).json({
        success: false,
        error: "Total attachment size must not exceed 20MB",
      });
    }

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }
    // DYNAMIC PER-FILE SIZE VALIDATION
    const maxPerFile = MAX_TOTAL_SIZE / Math.max(files.length, 1);
    for (const file of files) {
      if (file.size > maxPerFile) {
        return res.status(400).json({
          success: false,
          error: `Each file must be under ${Math.floor(maxPerFile / (1024 * 1024))}MB when uploading ${files.length} files`,
        });
      }
    }

    const attachments = (req.files || []).map((file) => ({
      filename: file.originalname,
      content: file.buffer,
    }));

    await resend.emails.send({
      from: "Marvills Portfolio Message <onboarding@resend.dev>",
      to: ["villaflormarbenc@gmail.com"],
      subject: subject || `Portfolio Message from ${name}`,
      html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p>${message}</p>
        `,
      attachments,
    });

    console.log("✅ Email sent successfully");
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send email",
    });
  }
});

app.listen(3000, () => console.log("Email API running on port 3000"));
