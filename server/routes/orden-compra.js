const app = require('express')();
const db = require('../libs/database/database');

app.post('/orden-compra', async(req, res) => {
    const params = [
        req.body.id_proveedor,
        req.body.orden_compra,
        db.Out('id_orden_compra')
    ]
    try{
        const { outputs } = await db.exec('SP_ORDEN_COMPRA_INSERT', params);
        res.json({
            complete: true,
            ...outputs
        });
    }catch(err){
        res.status(400).json({
            complete: false,
            err
        });
    }
});

app.get('/orden-compra', async(req, res) => {
    try{
        const { results } = await db.exec('SP_ORDEN_COMPRA_LIST', [undefined])
        res.json({
            complete: true,
            results: results[0]
        })
    }catch(err){
        res.status(400).json({
            complete: false,
            err
        })
    }
})

app.get('/orden-compra/:idOrdenCompra', async(req, res) => {
    try{
        const { results } = await db.exec('SP_ORDEN_COMPRA_LIST', [req.params.idOrdenCompra])
        res.json({
            complete: true,
            results: results[0]
        })
    }catch(err){
        res.status(400).json({
            complete: false,
            err
        })
    }
})

module.exports = app;