require('dotenv').config();
const mercadopago = require('mercadopago'); //mercadopago@1.5.14
const db = require("../database/connection");
const {getDiscountByCode, discountUse} = require("../models/discount");
const {saveTempInscription, getTempInscriptionById, deleteTempInscriptionById, saveInscription, getTotalInscriptions} = require("../models/inscripcion");
const {sendConfirmEmail} = require("../utils/mailerUtils.js")
const { v4: uuidv4 } = require('uuid'); // para generar IDs únicos

const cuentasMercadoPago = [
 { nombre: "Franco", token: process.env.MP_TOKEN_FRANCO },
 { nombre: "Yahir", token: process.env.MP_TOKEN_YAHIR },
 { nombre: "Tercero", token: process.env.MP_TOKEN_TERCERO }
];

const createPreference = async (req, res) => {
  const datos = req.body;
  const id = uuidv4();
  const precioBase = parseFloat(datos.precio);

  try {
    const descuento = await new Promise((resolve, reject) => {
      getDiscountByCode(datos.codigoDescuento, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    const porcentaje = descuento ? descuento.porcentaje : 0;
    const precioFinal = +(precioBase * (1 - porcentaje / 100)).toFixed(2);

    const inscripcionTemp = {
      id,
      ...datos,
      precio: precioFinal
    };

    //Verificar si ya se alcanzaron los 800 inscriptos
    const totalInscriptos = await getTotalInscriptions();
    if (totalInscriptos >= 800) {
      return res.status(400).json({ error: "Cupos completos. No se permiten más inscripciones." });
    }

    //Guardar inscripción temporal
    await new Promise((resolve, reject) => {
      saveTempInscription(inscripcionTemp, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    //Seleccionar la cuenta según el total actual
    const indiceCuenta = Math.floor((totalInscriptos - 1) / 200) % cuentasMercadoPago.length;
    const cuentaActual = cuentasMercadoPago[indiceCuenta];

    mercadopago.configure({ access_token: cuentaActual.token });

    const preference = {
      items: [
        {
          title: `Inscripción ${datos.distancia}${porcentaje ? ` - ${porcentaje}% OFF` : ""}`,
          unit_price: precioFinal,
          currency_id: "ARS",
          quantity: 1
        }
      ],
      payer: { dni: datos.dni },
      back_urls: {
        success: "https://a5e2-186-0-134-3.ngrok-free.app/api/mercadopago/success",
        failure: "https://a5e2-186-0-134-3.ngrok-free.app/api/mercadopago/failure",
        pending: "https://a5e2-186-0-134-3.ngrok-free.app/api/mercadopago/pending"
      },
      auto_return: "approved",
      external_reference: id
    };

    const mpResponse = await mercadopago.preferences.create(preference);
    res.json({ init_point: mpResponse.body.init_point });

  } catch (error) {
    console.error("Error en createPreference:", error);
    res.status(500).json({ error: "Error al procesar la inscripción." });
  }
};


const successPayment = async (req, res) => {
    const paymentId = req.query.payment_id;
    const externalRef = req.query.external_reference;
  
    try {
      const pago = await mercadopago.payment.findById(paymentId);
  
      if (pago.body.status === "approved") {
        const payerId = pago.body.payer?.id || null;
        const payerEmail = pago.body.payer?.email || null;

        getTempInscriptionById(externalRef, (err, tempData) => {
          if (err || !tempData) return res.status(404).send("Inscripción temporal no encontrada");
  
          const inscripto = {
            id: tempData.id,
            nombre: tempData.nombre,
            apellido: tempData.apellido,
            dni: tempData.dni,
            genero: tempData.genero,
            fechaNacimiento: tempData.fechaNacimiento,
            email: tempData.email,
            telefono: tempData.telefono,
            ciudad: tempData.ciudad,
            distancia_id: tempData.distancia_id,
            distancia: tempData.distancia,
            talle: tempData.talle,
            codigoDescuento: tempData.codigoDescuento,
            precio: tempData.precio,
            mpPayerId: payerId,
            mpPayerEmail: payerEmail,
          };
         
          saveInscription(inscripto, (err2) => {
            if (err2) return res.status(500).send("Error al guardar inscripción definitiva");
  
            sendConfirmEmail(inscripto);

            if (inscripto.codigoDescuento) {
              discountUse(inscripto.codigoDescuento, () => {});
            }
  
            deleteTempInscriptionById(inscripto.id, () => {});
            res.redirect("/"); // o mostrar mensaje de éxito
          });
        });
      } else {
        res.send("El pago no fue aprobado.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error al verificar el pago");
    }
};


const receiveWebhook = (req, res) => {
    console.log(req.query);
    res.send("webhook");
}

module.exports = {createPreference, receiveWebhook, successPayment};
