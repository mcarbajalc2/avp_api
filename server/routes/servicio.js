const app = require('express')();
const db = require('../libs/database/database');

app.get('/servicio', async(req, res) => {
    const id_tipo_item = 2;
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
})

module.exports = app;