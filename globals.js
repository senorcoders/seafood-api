global.catchErrors = callback => {

    return async function (req, res) {
        try {
            await callback(req, res);
        }
        catch (e) {
            sails.log("error", e);
            console.error(e);
            res.serverError();
        }
    }

};

console.log("load globals")