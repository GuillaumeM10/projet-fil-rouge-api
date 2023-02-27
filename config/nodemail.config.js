const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'localhost',
  port: 25,
  secure: false,
})

module.exports = transporter;