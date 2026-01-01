import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Handle CORS preflight request
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  console.log("req.method", req.method);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" + req.method });
  }

  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: message,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Email failed" });
  }
}

// import express from "express";
// import cors from "cors";
// import { Resend } from "resend";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const resend = new Resend(process.env.RESEND_API_KEY);

// app.post("/send-email", async (req, res) => {
//   const { name, email, message } = req.body;

//   try {
//     const data = await resend.emails.send({
//       // from: "New message from your portfolio  <contact@marvills.dev>",
//       from: "Marvills Portfolio Message <onboarding@resend.dev>",
//       to: ["villaflormarbenc@gmail.com"],
//       subject: `Portfolio Message from ${name}`,
//       html: `
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p>${message}</p>
//       `,
//     });

//     res.status(200).json({ success: true });
//   } catch (error) {
//     res.status(500).json({ success: false, error });
//   }
// });

// app.listen(3000, () => console.log("Email API running on port 3000"));
