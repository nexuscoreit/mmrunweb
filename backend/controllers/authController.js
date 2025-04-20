const bcrypt = require('bcrypt');
const adminModel = require('../models/admin');

const login = (req, res) => {
  const { email, password } = req.body;

  adminModel.obtenerAdminPorEmail(email, async (err, admin) => {
    if (err || !admin) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Login exitoso' });
  });
};

module.exports = { login };
