const app = require('express')();
const db = require('../libs/database/database');

app.post('/auth/login', async(req, res) => {
    const params = [req.body.email, req.body.contrasenia];
    try {
        const { results } = await db.exec('SP_USUARIO_LOGIN', params);

        if(results[0][0]){
            res.json({
                complete: true,
                ...results[0][0]
            });
        }else{
            res.status(401).json({
                complete: false,
                err: 'Usuario y/o contraseña incorrectos'
            });
        }
        
    } catch (err) {
        console.log(err);
        res.status(400).json({
            complete: false,
            err
        });
    }
});

module.exports = app;