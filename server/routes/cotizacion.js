const app = require('express')();
// const PDFDocument = require('pdfkit')
const db = require('../libs/database/database');
const cotizacionUtil = require('../util/cotizacion')


app.post('/cotizacion', async(req, res) => {
    const params = [req.body.id_negocio, JSON.stringify(req.body.cotizacion), db.Out('id_cotizacion')];
    try {
        const { outputs } = await db.exec('SP_COTIZACION_INSERT', params);
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

app.get('/cotizacion', async(req, res) => {
    const params = [undefined, req.query.id_negocio]
    try{
        const { outputs, results } = await db.exec('SP_COTIZACION_LIST', params);
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

app.post('/cotizacion/aprobar', async(req, res) => {
    const params = [req.body.id_cotizacion, 1];
    try{
        const { outputs } = await db.exec('SP_COTIZACION_ESTADO_UPDATE', params);
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

app.post('/cotizacion/rechazar', async(req, res) => {
    const params = [req.body.id_cotizacion, 2];
    try{
        const { outputs } = await db.exec('SP_COTIZACION_ESTADO_UPDATE', params);
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

app.get('/cotizacion/descarga', async(req, res) => {
    const id_cotizacion = req.query.id_cotizacion;
    // cotizacionUtil.genPDF('', res)
    try{
        const { outputs, results } = await db.exec('SP_COTIZACION_LIST', [id_cotizacion, undefined]);        
        // res.json(results[0])
        cotizacionUtil.genPDF(results[0], res)
    }catch(err){
        console.log(err)
        res.status(400).json({
            complete: false,
            err
        });
    }
})

module.exports = app;