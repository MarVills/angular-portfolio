import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Allow all origins (or replace "*" with your frontend URL)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Preflight request
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await resend.emails.send({
      from: `Portfolio <onboarding@resend.dev>`, // or any verified Resend sender
      to: [process.env.MY_EMAIL],
      subject,
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p>${message}</p>`,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }

  // try {
  //   const transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: process.env.SMTP_PORT,
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASS,
  //     },
  //   });

  //   await transporter.sendMail({
  //     from: `"${name}" <${email}>`,
  //     to: process.env.MY_EMAIL, // your email
  //     subject,
  //     text: message,
  //   });

  //   return res.status(200).json({ message: "Email sent successfully" });
  // } catch (error) {
  //   console.error(error);
  //   return res.status(500).json({ message: "Internal server error" });
  // }
}
