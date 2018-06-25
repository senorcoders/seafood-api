const random = require("randomatic");

module.exports = {
    verificationCode: async (req, res) => {

        try {
            let id = req.param("id"), code = req.param("code");
            let us = await User.findOne({ id });
            if (us === undefined)
                return res.json({ message: "code invalid" });

            if (us.code === code) {
                us = await User.update({ id }, { verification: true }).fetch();
                res.redirect('http://165.227.125.190:1337/verification' + "/" + id + "/" + code);
            } else {
                res.json({ message: "code invalid" });
            }

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    resetEmail: async (req, res) => {
        try {
            let email = req.param("email");
            let user = await User.findOne({ email });

            if (user === undefined) {
                return res.status(400).send("user not found");
            }

            let code = random("0", 6);
            let fod = await ForgotPassword.findOne({ valid: false, code });
            console.log(fod);
            while (fod !== undefined) {
                code = random("0", 6);
                fod = await ForgotPassword.findOne({ valid: false, code });
                console.log(fod);
            }

            let forgot = {
                user: user.id,
                code,
                valid: false
            };

            forgot = await ForgotPassword.create(forgot).fetch();

            require("./../../mailer").sendEmailForgotPassword(email, forgot.code);

            res.ok();

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    changePassword: async (req, res) => {
        try {
            let code = req.param("code");
            let forg = await ForgotPassword.findOne({ code, valid: false });
            let moment = require("moment");
            if (forg === undefined) {
                return res.status(400).send("not found code");
            } else if (moment(forg.createdAt).isAfter(moment())) {
                return res.status(400).send("code expired");
            }

            await ForgotPassword.update({ id: forg.id }, { valid: true })
            let password = await sails.helpers.passwords.hashPassword(req.param("password"));
            let user = await User.update({ id: forg.user }, { password }).fetch();
            console.log(user);
            res.ok();
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    updatePassword: async (req, res) => {
        try {
            let email = req.param("email"), password = req.param("password"), 
            newPassword = req.param("newPassword");
            let user = await User.findOne({ email });
            if (user === undefined) {
                return res.status(400).send("user not found!");
            }
            
            await sails.helpers.passwords.checkPassword(password, user.password);

            await User.update({id: user.id}, {
                password: await sails.helpers.passwords.hashPassword(newPassword)
            });

            res.json({msg: "success"});
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    sendMessageContact: async (req, res)=>{
        try{
            let id = req.param("id"), name = req.param("name"),
            email= req.param("email"), message = req.param("message");

            let user = await User.findOne({id});
            if( user === undefined ){
                return res.status(400).send("not found");
            }

            await require("./../../mailer").sendDataFormContactToSeller(user.email, {
                name,
                email,
                message
            });

            res.json({msg : "success"});
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    getAdmins: async (req, res)=>{
        try{

            let users = await User.find({role: 0});
            res.json(users);
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    deleteUser: async (req, res)=>{
        try{

            let imageCtrl = require("./ImageController"), 
            id = req.param("id"), 
            user = await User.destroy({id}).fetch(); 

            if( user.length === 0 ){
                return res.status(400).send("not found");
            } 

            if( user[0].role === 1 ){

                //Eliminamos los store
                let stores = await Store.find({owner: id});

                //Eliminamos las imagenes de los stores
                //Y los productos y sus imagenes
                for(let store of stores){
                    if( store.hasOwnProperty("logo") && store.logo !== '' ){
                        let dirs = store.logo.split("/");
                        await imageCtrl.deleteImageXDirName(["store", dirs.pop()]);
                    }
                    
                    let fishs = await Fish.destroy({store: store.id}).fetch();
                    for(let fish of fishs){ console.log(fish);
                        await imageCtrl.deleteImageXDirName([fish.id]);
                        await imageCtrl.deleteImageXDirName(["primary", fish.id]);
                    }
                }

                await Store.destroy({owner: id});
            }

            res.json({msg: "success"});
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    }
};
