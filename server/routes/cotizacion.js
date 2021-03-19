const app = require('express')();
const db = require('../libs/database/database');

app.post('/cotizacion', async(req, res) => {
    const params = [req.body.id_negocio, JSON.stringify(req.body.cotizacion), db.Out('id_negocio')];
    res.json({
        params
    })
    // try {
    //     const { outputs } = await db.exec('SP_NEGOCIO_INSERT', params);
    //     res.json({
    //         complete: true,
    //         ...outputs
    //     });
    // } catch (err) {
    //     res.status(400).json({
    //         complete: false,
    //         err
    //     });
    // }
});

app.get('/cotizacion', async(req, res) => {
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