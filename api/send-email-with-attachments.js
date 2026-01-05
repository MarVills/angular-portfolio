import formidable from "formidable";
import fs from "fs";
import { Resend } from "resend";

export const config = {
  api: {
    bodyParser: false,
  },
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Invalid form data" });
    }

    const attachments = Object.values(files).map((file) => ({
      filename: file.originalFilename,
      content: fs.readFileSync(file.filepath),
    }));

    try {
      await resend.emails.send({
        from: "Marvills Portfolio <onboarding@resend.dev>",
        to: ["villaflormarbenc@gmail.com"],
        subject: fields.subject || "Portfolio Message",
        html: `<p>${fields.message}</p>`,
        attachments,
      });

      res.status(200).json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false });
    }
  });
}
