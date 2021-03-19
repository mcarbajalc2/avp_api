const app = require('express')();
const db = require('../libs/database/database');

app.post('/negocio', async(req, res) => {
    const params = [req.body.id_empresa, req.body.id_persona_contacto, db.Out('id_negocio')];
    try {
        const { outputs } = await db.exec('SP_NEGOCIO_INSERT', params);
        res.json({
            complete: true,
            ...outputs
        });
    } catch (err) {
        res.status(400).json({
            complete: false,
            err
        });
    }
});

app.get('/negocio', async(req, res) => {
    try{
        const { outputs, results } = await db.exec('SP_NEGOCIO_LIST', []);
        res.json({
            complete: true,
            results: results[0]
        });
    }catch(err){
        res.status(400).json({
            complete: false,
            err
        });
    }
})

module.exports = app;