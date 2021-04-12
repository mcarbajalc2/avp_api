const app = require('express')();
const db = require('../libs/database/database');

app.get('/producto', async(req, res) => {
    const id_tipo_item = 1;
    try{
        const { results } = await db.exec('SP_ITEM_LIST', [id_tipo_item])
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
});

app.get('/producto/combinacion', async(req, res) => {
    const id_producto = req.query.id_producto;
    try{
        const { results, outputs } = await db.exec('SP_COMBINACION_LIST', [id_producto])       

        res.json({
            complete: true,
            results: results[0],
            ...outputs
        })
        
    }catch(err){
        res.status(400).json({
            complete: false,
            err
        })
    }
});

module.exports = app;