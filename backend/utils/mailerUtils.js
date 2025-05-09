const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendConfirmEmail(inscripto) {
  const mailOptions = {
    from: `"Mari Menuco Run" <${process.env.EMAIL_USER}>`,
    to: inscripto.email,
    subject: "Confirmación de inscripción",
    html: `
      <h2>¡Gracias por inscribirte, ${inscripto.nombre}!</h2>
      <p>Tu inscripción a la distancia <strong>${inscripto.distancia}</strong> fue confirmada.</p>
      <p>¡Nos vemos en la carrera!</p>
      <p>Equipo MMRun25</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar mail:", error);
    } else {
      console.log("Mail enviado:", info.response);
    }
  });
}

module.exports = { sendConfirmEmail };
