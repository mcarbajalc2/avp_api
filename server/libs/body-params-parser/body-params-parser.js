const convert = (toEval) => {
    try {
        return JSON.parse(toEval);
    } catch (err) {
        return false;
    }
}

const convertJSON = (json) => {
    for (let i in json) {
        const new_json = convert(json[i]);
        if (new_json) {
            json[i] = convertJSON(new_json);
        }
    }
    return json;
}

const bodyParamsParser = () => {
    return (req, res, next) => {
        const newReq = convertJSON(req.body);
        next();
    }
}

module.exports = bodyParamsParser;