const app = require('express')();
const db = require('../libs/database/database');

app.get('/ubicacion/departamento', async(req, res) => {
    try {
        const { results } = await db.exec('SP_DEPARTAMENTO_LIST', []);
        res.json({
            complete: true,
            results: results[0]
        })
    } catch (err) {
        res.status(400).json({
            complete: false,
            err
        });
    }
});

app.get('/ubicacion/provincia', async(req, res) => {
    try {
        const id_departamento = req.query.id_departamento
        const { results } = await db.exec('SP_PROVINCIA_LIST', [id_departamento]);
        res.json({
            complete: true,
            results: results[0]
        })
    } catch (err) {
        res.status(400).json({
            complete: false,
            err
        });
    }
});

app.get('/ubicacion/distrito', async(req, res) => {
    try {
        const id_provincia = req.query.id_provincia
        const { results } = await db.exec('SP_DISTRITO_LIST', [id_provincia]);
        res.json({
            complete: true,
            results: results[0]
        })
    } catch (err) {
        res.status(400).json({
            complete: false,
            err
        });
    }
});

app.get('/ubicacion/tipo-via', async(req, res) => {
    try {
        const { results } = await db.exec('SP_TIPO_VIA_LIST', []);
        res.json({
            complete: true,
            results: results[0]
        });
    } catch (err) {
        res.status(400).json({
            complete: false,
            err
        });
    }
});

module.exports = app;