const mysql = require('mysql');

class Output {
    constructor(name) {
        this.name = name;
    }
}

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
});

const connect = () => {
    connection.connect((err) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + connection.threadId);
    });
}

const getProcedureStatement = (procedure, params) => {
    let sql = `CALL ${procedure} (`;
    if (params !== undefined) {
        params.forEach((elm, idx) => {
            if (typeof(elm) === 'number') {
                sql += (idx !== 0 ? ',' : '') + elm;
            } else if (typeof(elm) === 'object' && elm instanceof Output) {
                sql += (idx !== 0 ? ',' : '') + `@${elm.name}`;
            } else if (typeof(elm) === 'object') {
                sql += `${(idx !== 0  ? ',' : '')}'${JSON.stringify(elm)}'`;
            } else if (elm === undefined || elm === null) {
                sql += (idx !== 0 ? ',' : '') + null;
            } else if (typeof(elm) === 'string') {
                sql += `${(idx !== 0  ? ',' : '')}'${elm}'`;
            }
        });
    }
    sql += ');';
    // console.log(sql);
    return sql;
}

const query = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, function(error, results, fields) {
            if (error) {
                reject(error);
            } else{
                resolve(results);
            }            
        });
    });
};

const getOutputsStatement = (params) => {
    let sql = undefined;
    const outputParams = params.filter(elm => {
        if (typeof(elm) === 'object' && elm instanceof Output) {
            return elm;
        }
    });
    if (outputParams !== undefined && outputParams.length > 0) {
        sql = 'SELECT ';
        outputParams.forEach((elm, idx) => {
            sql += (idx === 0 ? '' : ',') + `@${elm.name}`;
        });
    }
    return sql;
}

const exec = async(procedure, params = undefined) => {
    let outputs = undefined;

    const sql = getProcedureStatement(procedure, params);
    const sql_out = getOutputsStatement(params);

    console.log(sql);

    let results = await query(sql);
    if (results.length == 1) {
        results = results[0]
    }
    const aux_outputs = sql_out ? await query(sql_out) : undefined;

    if (aux_outputs !== undefined) {
        outputs = {};
        for (let i in aux_outputs[0]) {
            outputs[i.substring(1)] = aux_outputs[0][i];
        }
    }

    return { results, outputs };
}

const Out = (name) => {
    return new Output(name)
}

module.exports = {
    connect,
    exec,
    Out
};