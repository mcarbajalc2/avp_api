const app = require('express')();
const db = require('../libs/database/database');

app.get('/persona/tipo-documento-identidad', async(req, res) => {
    try{
        const { results } = await db.exec('SP_TIPO_DOCUMENTO_IDENTIDAD_LIST', [])
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
app.get('/persona/relacion', async(req, res) => {    
    try{
        const { results } = await db.exec('SP_PERSONA_RELACION_LIST', [])
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

app.get('/persona/contacto', async(req, res) => {
    const id_persona = req.query.id_persona;
    try{
        const { results } = await db.exec('SP_PERSONA_CONTACTO_LIST', [id_persona])
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

app.get('/persona/contacto-por-negocio', async(req, res) => {
    const id_negocio = req.query.id_negocio;
    try{
        const { results } = await db.exec('SP_PERSONA_CONTACTO_POR_NEGOCIO_LIST', [id_negocio])
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