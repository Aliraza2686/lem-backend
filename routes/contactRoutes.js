import express from "express";
import sgMail from "@sendgrid/mail";
import { Resend } from "resend";

const router = express.Router();
// if (!process.env.RESEND_API_KEY) {
//   throw new Error("RESEND_API_KEY is missing. Check your .env or Railway variables.");
// }


// ✅ contact form route-- previous sendgrid system 
router.post("/submit-contact-form", async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.info(process.env.SENDGRID_API_KEY, "process.env.SENDGRID_API_KEY")
  try {
    const { name, email, phone, country, message, product_slug } = req.body;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background: #f4f6f8; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#0d47a1; padding:20px; text-align:center; color:#ffffff;">
              <h2 style="margin:0; font-size:22px; font-weight:600;">New Contact Form Submission</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:20px; color:#333333; font-size:15px; line-height:1.6;">
              <p><strong style="color:#0d47a1;">Name:</strong> ${name}</p>
              <p><strong style="color:#0d47a1;">Email:</strong> ${email}</p>
              <p><strong style="color:#0d47a1;">Phone:</strong> ${phone}</p>
              <p><strong style="color:#0d47a1;">Country:</strong> ${country}</p>
              <p><strong style="color:#0d47a1;">Message:</strong> ${message}</p>
              <p><strong style="color:#0d47a1;">Product Slug:</strong> ${product_slug || "N/A"}</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f1f3f4; padding:15px; text-align:center; font-size:13px; color:#666666;">
              <p style="margin:0;">This email was sent from your website contact form.</p>
              <p style="margin:5px 0 0 0;">&copy; ${new Date().getFullYear()} Lumina Earth Minerals</p>
            </td>
          </tr>
        </table>
      </div>
    `;

    // const msg = {
    //   to: process.env.TO_EMAIL,
    //   from: process.env.FROM_EMAIL,
    //   subject: `New Contact Form Submission from ${name}`,
    //   text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCountry: ${country}\nMessage: ${message}\nProduct Slug: ${product_slug || "N/A"}`,
    //   html: htmlContent,
    // };

    // await sgMail.send(msg);
      const result = await resend.emails.send({
      from: "Lumina Earth <info@luminaearthminerals.com>",
      to: ["contact@luminaearthminerals.com"], // ✅ your inbox
      // replyTo: email, // ✅ reply goes to the customer÷
      subject: `New Contact Form: ${name}`,
      html: htmlContent, // ✅ use the template
      // text: textContent
    });



    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    if (error.response) console.error(error.response.body);
    res.status(500).json({ success: false, error: error.message });
  }
});



// Basic HTML escaping to prevent someone injecting HTML into your email
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}



// new resend system
router.post("/submit-contact-forms", async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  console.log("RESEND_API_KEY loaded?", process.env.RESEND_API_KEY);
  try {
    const { name, email, phone, country, message, product_slug } = req.body;

    // Minimal validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "name, email, and message are required",
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "");
    const safeCountry = escapeHtml(country || "");
    const safeMessage = escapeHtml(message);
    const safeProduct = escapeHtml(product_slug || "N/A");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background: #f4f6f8; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#0d47a1; padding:20px; text-align:center; color:#ffffff;">
              <h2 style="margin:0; font-size:22px; font-weight:600;">New Contact Form Submission</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:20px; color:#333333; font-size:15px; line-height:1.6;">
              <p><strong style="color:#0d47a1;">Name:</strong> ${safeName}</p>
              <p><strong style="color:#0d47a1;">Email:</strong> ${safeEmail}</p>
              <p><strong style="color:#0d47a1;">Phone:</strong> ${safePhone}</p>
              <p><strong style="color:#0d47a1;">Country:</strong> ${safeCountry}</p>
              <p><strong style="color:#0d47a1;">Message:</strong><br/>${safeMessage.replaceAll("\n", "<br/>")}</p>
              <p><strong style="color:#0d47a1;">Product Slug:</strong> ${safeProduct}</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f1f3f4; padding:15px; text-align:center; font-size:13px; color:#666666;">
              <p style="margin:0;">This email was sent from your website contact form.</p>
              <p style="margin:5px 0 0 0;">&copy; ${new Date().getFullYear()} Lumina Earth Minerals</p>
            </td>
          </tr>
        </table>
      </div>
    `;

    const textContent =
      `New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || ""}
Country: ${country || ""}
Product Slug: ${product_slug || "N/A"}

Message:
${message}
`;
    const result = await resend.emails.send({
      from: "Lumina Earth <info@luminaearthminerals.com>",
      to: ["ali.raza@luminaearthminerals.com"], // ✅ your inbox
      // replyTo: email, // ✅ reply goes to the customer÷
      subject: `New Contact Form: ${name}`,
      html: htmlContent, // ✅ use the template
      text: textContent
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully!",
      id: result?.id,
    });
  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to send email",
    });
  }
});
export default router;
