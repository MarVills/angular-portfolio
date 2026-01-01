import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // ⚠️ Must handle preflight first
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "https://marvills.github.io");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end(); // preflight response
  }

  // Only POST allowed
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ✅ CORS headers for actual POST request
  res.setHeader("Access-Control-Allow-Origin", "https://marvills.github.io");

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.DESTINATION_EMAIL,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
}

// const express = require("express");
// const nodemailer = require("nodemailer");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing form-urlencoded

// // Route to handle sending email
// app.post("/send-email", async (req, res) => {
//   try {
//     const { name, email, subject, message } = req.body;

//     if (!name || !email || !subject || !message) {
//       return res.status(400).json({ error: "All fields are required." });
//     }

//     // Create transporter (use your SMTP credentials)
//     const transporter = nodemailer.createTransport({
//       host: "smtp.example.com", // e.g., smtp.gmail.com
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: "your_email@example.com",
//         pass: "your_email_password",
//       },
//     });

//     // Email options
//     const mailOptions = {
//       from: `"${name}" <${email}>`, // sender info
//       to: "recipient@example.com", // your destination email
//       subject: subject,
//       text: message,
//       html: `<p>${message}</p>`,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: "Email sent successfully!" });
//   } catch (error) {
//     console.error("Email send error:", error);
//     res.status(500).json({ error: "Failed to send email." });
//   }
// });

// // Start server (for local testing)
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// =======================================================

// import nodemailer from "nodemailer";

// export default async function handler(req, res) {
//   // Handle CORS preflight request
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//   console.log("req.method", req.method);

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" + req.method });
//   }

//   const { name, email, subject, message } = req.body;

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: email,
//       to: process.env.EMAIL_USER,
//       subject: `New message from ${name}`,
//       text: message,
//     });

//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Email failed" });
//   }
// }

// ===========================================================

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
