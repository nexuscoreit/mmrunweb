require('dotenv').config();
const mercadopago = require('mercadopago'); //mercadopago@1.5.14
const db = require("../database/connection");
const {getDiscountByCode, discountUse} = require("../models/discount");
const {getTempInscriptionById, deleteTempInscriptionById, saveInscription, saveTempInscription} = require("../models/inscripcion");
const { v4: uuidv4 } = require('uuid'); // para generar IDs únicos

// Inicializar l tu access token - mercadopago@1.5.14
//mercadopago.configure({access_token: process.env.MP_ACCESS_TOKEN});

const cuentasMercadoPago = [
 { nombre: "Franco", token: process.env.MP_TOKEN_FRANCO },
 { nombre: "Yahir", token: process.env.MP_TOKEN_YAHIR },
 { nombre: "Tercero", token: process.env.MP_TOKEN_TERCERO }
];

const createPreference = async (req, res) => {
  const datos = req.body;
  const id = uuidv4();
  const precioBase = parseFloat(datos.precio);

  getDiscountByCode(datos.codigoDescuento, (err, descuento) => {
    const porcentaje = descuento ? descuento.porcentaje : 0;
    const precioFinal = +(precioBase * (1 - porcentaje / 100)).toFixed(2);
    console.log(precioFinal);
    const inscripcionTemp = {
      id: id ,
      ...req.body,
      precio: precioFinal
    };

    saveTempInscription(inscripcionTemp, (err) => {
      if (err) {
        console.error("Error al guardar inscripción temporal:", err.message);
        return res.status(500).json({ error: "Error al guardar inscripción temporal" });
      }

      // Obtener total de inscriptos definitivos para seleccionar cuenta MP
      db.get("SELECT COUNT(*) AS total FROM inscripciones", (err, row) => {
        if (err) {
          console.error("Error al contar inscriptos:", err);
          return res.status(500).send("Error al obtener el total de inscriptos");
        }

        const totalInscriptos = row.total;
        const indiceCuenta = Math.floor(totalInscriptos / 200) % cuentasMercadoPago.length;
        const cuentaActual = cuentasMercadoPago[indiceCuenta];

        console.log("Usando la cuenta de:", cuentaActual.nombre);

        // Configurar MercadoPago SDK
        mercadopago.configure({
          access_token: cuentaActual.token
        });

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

        mercadopago.preferences.create(preference)
          .then((mpResponse) => res.json({ init_point: mpResponse.body.init_point }))
          .catch((err) => {
            console.error("Error al crear preferencia:", err);
            res.status(500).json({ error: "Error al crear la preferencia de pago" });
          });
      });
    });
  });
};

const successPayment = async (req, res) => {
    const paymentId = req.query.payment_id;
    const externalRef = req.query.external_reference;
  
    try {
      const pago = await mercadopago.payment.findById(paymentId);
  
      if (pago.body.status === "approved") {
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
            precio: tempData.precio
          };
          console.log("tempinsc", inscripto);
          saveInscription(inscripto, (err2) => {
            console.error("Error al guardar inscripción:", err2);
            if (err2) return res.status(500).send("Error al guardar inscripción definitiva");
  
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
