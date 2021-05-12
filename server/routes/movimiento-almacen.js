const app = require('express')();
const db = require('../libs/database/database');

app.post('/movimiento-almacen', async (req, res) => {
    try{
        const params = [req.body.id_motivo, req.body.id_orden_compra, req.body.guia_remision, req.body.items, db.Out('id_movimiento')]
        const { outputs } = await db.exec('SP_MOVIMIENTO_ALMACEN_INSERT', params)
        res.json({
            complete: true,
            ...outputs
        })
    }catch(err){
        if(err && err.sqlState && err.sqlState === '45000'){
            res.status(406).json({
                complete: false,
                message: err.sqlMessage
            })
        }else{
            res.status(400).json({
                complete: false,
                err
            })
        }        
    }
})

app.get('/movimiento-almacen', async(req, res) => {
    try{
        const { results } = await db.exec('SP_MOVIMIENTO_ALMACEN_LIST', [undefined])
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

app.get('/movimiento-almacen/motivo', async (req, res) => {
    const tipo = req.query.tipo
    try{
        const { results } = await db.exec('SP_MOVIMIENTO_ALMACEN_MOTIVO', [tipo])
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

app.get('/movimiento-almacen/:idMovimientoAlmacen', async(req, res) => {
    try{
        const { results } = await db.exec('SP_MOVIMIENTO_ALMACEN_LIST', [req.params.idMovimientoAlmacen])
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

module.exports = app