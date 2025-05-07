const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, status, full_name, date, time } = req.body;

  // Log gelen request
  console.log('GELEN MAIL REQUEST:', req.body);

  if (!email || !status || !full_name || !date || !time) {
    console.error('Eksik bilgi:', req.body);
    return res.status(400).json({ error: 'Eksik bilgi!' });
  }

  const subject = status === 'confirmed' ? 'Randevunuz Onaylandı' : 'Randevunuz Reddedildi';
  const html = `
    <h2>${subject}</h2>
    <p>Sayın ${full_name},</p>
    <p>${date} tarihinde, ${time} saatindeki randevunuz <b>${status === 'confirmed' ? 'ONAYLANDI' : 'REDDEDİLDİ'}</b>.</p>
    <p>Sağlıklı günler dileriz.</p>
  `;

  // Gmail SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // senin gmail adresin
      pass: process.env.GMAIL_APP_PASSWORD // Google uygulama şifresi
    }
  });

  try {
    await transporter.sendMail({
      from: `"Doktor Randevu" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      html
    });
    console.log('Mail başarıyla gönderildi:', email);
    res.json({ ok: true });
  } catch (err) {
    console.error('Mail gönderme hatası:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 