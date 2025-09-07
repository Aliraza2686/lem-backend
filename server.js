import express from "express";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import cors from "cors";
dotenv.config();

const app = express();

// ✅ enable CORS for all origins
app.use(cors());

// ✅ if you only want JSON body parsing
app.use(express.json());


const PORT = process.env.PORT || 5000;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.json());

// API endpoint to send email
app.post("/submit-contact-form", async (req, res) => {
  try {
    const { name, email, phone, country, message, product_slug } =
      req.body;

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
                <p><strong style="color:#0d47a1;">Product Slug:</strong> ${
                  product_slug || "N/A"
                }</p>
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

    const msg = {
      to: process.env.TO_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCountry: ${country}\nMessage: ${message}\nProduct Slug: ${
        product_slug || "N/A"
      }`, // Plain-text fallback
      html: htmlContent,
    };

    await sgMail.send(msg);

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    if (error.response) console.error(error.response.body);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
