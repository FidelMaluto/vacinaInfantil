const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.send = async (req, res) => {

    const { email, nomeCrianca, vacina, data } = req.body;

    try {

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Vacinação Infantil',
            html: `
                <h3>VacinaKids</h3>
                <p>${nomeCrianca} deve tomar ${vacina}</p>
                <p>Data: ${data}</p>
            `
        });

        res.json({ mensagem: "Email enviado" });

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};
