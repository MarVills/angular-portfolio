import nodemailer from "nodemailer";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.MY_EMAIL, // your email
      subject,
      text: message,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// import nodemailer from "nodemailer";

// export const config = {
//   runtime: "nodejs",
// };

// export default async function handler(req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   if (req.method !== "POST") {
//     res.setHeader("Allow", "POST, OPTIONS");
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   try {
//     const { name, email, subject, message } = req.body;

//     if (!name || !email || !subject || !message) {
//       return res.status(400).json({ error: "All fields are required." });
//     }

//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT || 587,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"${name}" <${email}>`,
//       to: process.env.DESTINATION_EMAIL,
//       subject,
//       text: message,
//       html: `<p>${message}</p>`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: "Email sent successfully!" });
//   } catch (error) {
//     console.error("Email send error:", error);
//     res.status(500).json({ error: "Failed to send email." });
//   }
// }
