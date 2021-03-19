const app = require('express')();
const db = require('../libs/database/database');

app.get('/empresa/actividad-comercial', async(req, res) => {
    try{
        const { results } = await db.exec('SP_ACTIVIDAD_COMERCIAL_LIST', [])
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

app.get('/empresa/domicilio-condicion', async(req, res) => {
    try {
        const { results } = await db.exec('SP_DOMICILIO_FISCAL_CONDICION_LIST', [])
        res.json({
            complete: true,
            results: results[0]
        })
    } catch (err) {
        res.status(400).json({
            complete: false,
            err
        })
    }
})

app.get('/empresa/tipo', async(req, res) => {
    try {
        const { results } = await db.exec('SP_EMPRESA_TIPO_LIST', []);
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

app.get('/empresa/:id_empresa', async(req, res) => {
    const id_empresa = req.params.id_empresa;
    try {
        const { results } = await db.exec('SP_PERSONA_JURIDICA_LIST', [undefined, id_empresa]);
        const empresa = results[0].length == 1 ? results[0][0] : undefined;
        if (results[0].length == 1) {
            res.json({
                complete: true,
                ...results[0][0]
            });
        } else {
            res.status(400).json({
                complete: false,
                err: {
                    message: `No se encontro una empresa con el código ${id_empresa}`
                }
            });
        }

    } catch (err) {
        res.status(400).json({
            complete: false,
            err
        });
    }
});

app.get('/empresa', async(req, res) => {
    const buscar = req.query.buscar;
    try {
        const { results } = await db.exec('SP_PERSONA_JURIDICA_LIST', [buscar, undefined]);
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

app.post('/empresa', async(req, res) => {
    const params = [req.body.id_empresa_tipo, req.body.id_domicilio_fiscal_condicion, req.body.razon_social, req.body.RUC, req.body.id_actividad_comercial, req.body.fecha_inscripcion, req.body.id_distrito_direccion_fiscal, req.body.id_tipo_via_direccion_fiscal, req.body.via_direccion_fiscal, req.body.direccion_fiscal, req.body.numeracion_via_direccion_fiscal, db.Out('id_empresa')];
    try {
        const { outputs } = await db.exec('SP_PERSONA_JURIDICA_INSERT', params);
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

app.post('/empresa/contacto', async(req, res) => {
    const params = [
        req.body.id_empresa, 
        req.body.id_persona_relacion, 
        req.body.id_tipo_documento_identidad,
        req.body.documento,
        req.body.nombres,
        req.body.ap_paterno,
        req.body.ap_materno,
        req.body.telefono,
        req.body.email,
        req.body.fecha_nacimiento,
        req.body.id_distrito_domicilio,
        req.body.id_tipo_via_domicilio,
        req.body.via_domicilio,
        req.body.numeracion_via_domicilio,
        req.body.direccion_domicilio,
        db.Out('id_persona_contacto')
    ]
    
    try {
        const { outputs } = await db.exec('SP_PERSONA_CONTACTO_INSERT', params);
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
})

module.exports = app;