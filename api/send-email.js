import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // REQUIRED for file uploads
  },
};

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    const { name, email, message } = fields;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const attachments = [];

      if (files.attachments) {
        const fileArray = Array.isArray(files.attachments) ? files.attachments : [files.attachments];

        for (const file of fileArray) {
          attachments.push({
            filename: file.originalFilename,
            content: fs.readFileSync(file.filepath),
          });
        }
      }

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New message from ${name}`,
        text: message,
        attachments,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Email error:", error);
      return res.status(500).json({ error: "Email failed" });
    }
  });
}
