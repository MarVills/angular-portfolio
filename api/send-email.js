import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false });
  }

  try {
    await resend.emails.send({
      from: "Marvills Portfolio <onboarding@resend.dev>",
      to: ["villaflormarbenc@gmail.com"],
      subject: `Portfolio Message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
}

// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default async function handler(req, res) {
//   // CORS
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//   if (req.method === "OPTIONS") return res.status(200).end();
//   if (req.method !== "POST")
//     return res.status(405).json({ message: "Method not allowed" });

//   const { name, email, subject, message } = req.body;

//   if (!name || !email || !subject || !message) {
//     return res.status(400).json({ message: "Missing fields" });
//   }

//   try {
//     await resend.emails.send({
//       from: `Marvills Portfolio <onboarding@resend.dev>`,
//       to: [process.env.MY_EMAIL],
//       subject: subject || `Portfolio Message from ${name}`,
//       html: `
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p>${message}</p>
//       `,
//     });

//     return res.status(200).json({ message: "Email sent successfully" });
//   } catch (err) {
//     console.error("Resend error:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }

// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST() {
//   const response = await resend.emails.send({
//     from: "Acme <onboarding@resend.dev>",
//     to: ["delivered@resend.dev"],
//     subject: "hello world",
//     html: "<strong>it works!</strong>",
//   });

//   return Response.json(response, {
//     status: response.error ? 500 : 200,
//   });
// }

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
