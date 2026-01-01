import multer from "multer";
import { Resend } from "resend";

/**
 * Disable Vercel default body parser
 * (required for multipart/form-data)
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Multer config (memory only – required for serverless)
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB per file
    files: 5, // max 5 files
  },
});

/**
 * Helper to run middleware in Vercel
 */
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Run multer
    await runMiddleware(req, res, upload.array("attachments"));

    const { name, email, subject, message } = req.body;
    const files = req.files || [];

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (files.length === 0) {
      return res.status(400).json({
        message: "No attachments found",
      });
    }

    // Prepare attachments for Resend
    const attachments = files.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
    }));

    // Init Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["your-email@example.com"],
      subject,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      attachments,
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully with attachments",
    });
  } catch (error) {
    console.error("Send email with attachment error:", error);

    // Multer-specific errors
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "One or more files exceed the size limit",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "Too many files uploaded",
      });
    }

    return res.status(500).json({
      message: "Failed to send email with attachments",
    });
  }
}
