const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

async function sendBookingConfirmationEmail(user, booking) {
  const filePath = `./booking_${booking._id}.pdf`;
  try {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // HEADER
    doc.fillColor("#0f172a").fontSize(22).text("Grand Horizon Luxury Hotel & Resort", { align: "center" });
    doc.fontSize(12).fillColor("#c5a880").text("Official Booking Confirmation Receipt", { align: "center" });
    doc.moveDown(1.5);

    // LINE DIVIDER
    doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1.5);

    // DETAILS
    doc.fillColor("#0f172a").fontSize(13).text("Guest & Reservation Information", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor("#334155");
    doc.text(`Guest Name: ${user.name}`);
    doc.text(`Guest Email: ${user.email}`);
    doc.text(`Booking Reference ID: ${booking._id}`);
    doc.text(`Transaction ID: ${booking.transactionId || "N/A"}`);
    doc.moveDown(1);

    doc.fillColor("#0f172a").fontSize(13).text("Stay Details", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor("#334155");
    doc.text(`Suite Reserved: ${booking.room}`);
    doc.text(`Check-In Date: ${booking.fromDate}`);
    doc.text(`Check-Out Date: ${booking.toDate}`);
    doc.text(`Total Nights: ${booking.totalDays}`);
    doc.text(`Total Amount Paid: ₹${booking.totalamt}`);
    doc.text(`Reservation Status: Confirmed`);
    doc.moveDown(2);

    // FOOTER
    doc.fontSize(10).fillColor("#64748b").text("Thank you for choosing Grand Horizon. We look forward to welcoming you!", { align: "center" });

    doc.end();

    await new Promise((resolve) => writeStream.on("finish", resolve));

    // Send Email if credentials configured
    if (process.env.ADMIN_EMAIL_USER && process.env.ADMIN_EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.ADMIN_EMAIL_USER,
          pass: process.env.ADMIN_EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `Grand Horizon Concierge <${process.env.ADMIN_EMAIL_USER}>`,
        to: user.email,
        subject: "Booking Confirmation - Grand Horizon Luxury Hotel & Resort",
        text: `Dear ${user.name},\n\nThank you for choosing Grand Horizon Luxury Hotel & Resort. Your reservation for ${booking.room} has been successfully confirmed for the period of ${booking.fromDate} to ${booking.toDate}.\n\nPlease find your official booking confirmation invoice PDF attached.\n\nWarm regards,\nGrand Horizon Concierge Team`,
        attachments: [
          {
            filename: `booking_${booking._id}.pdf`,
            path: filePath,
          },
        ],
      };
      await transporter.sendMail(mailOptions);
    } else {
      console.log("Email notification skipped: ADMIN_EMAIL_USER or ADMIN_EMAIL_PASS not configured in .env.");
    }
  } catch (err) {
    console.error("Error generating/sending booking confirmation email:", err);
  } finally {
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }
  }
}

module.exports = { sendBookingConfirmationEmail };
