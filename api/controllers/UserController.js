const random= require("randomatic");

module.exports = {
    verificationCode: async (req, res)=>{

        try{
            let id = req.param("id"), code = req.param("code");
            let us = await User.findOne({id});
            if(us === undefined)
                return res.json({message: "code invalid"});
                
            if( us.code === code ){
                us = await User.update({id}, { verification: true }).fetch();
                res.redirect('http://165.227.125.190:1337/login');
            }else{
                res.json({message: "code invalid"});
            }
            
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    resetEmail: async (req, res)=>{
        try{
            let email = req.param("email");
            let user = await User.findOne({email});

            if( user === undefined ){
                return res.status(400).send("user not found");
            }

            let code = random("0", 6);
            let fod = await ForgotPassword.findOne({valid: false, code });
            console.log(fod);
            while(fod !== undefined){
                code = random("0", 6);
                fod = await ForgotPassword.findOne({valid: false, code });
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
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    changePassword: async (req, res)=>{
        try{
            let code = req.param("code");
            let forg = await ForgotPassword.findOne({code, valid: false });
            let moment = require("moment");
            if( forg === undefined ){
                return res.status(400).send("not found code");
            }else if( moment(forg.createdAt).isAfter(moment()) ){
                return res.status(400).send("code expired");
            }

            await ForgotPassword.update({id: forg.id}, {valid: true})
            let password = await sails.helpers.passwords.hashPassword(req.param("password"));
            let user = User.update({id: forg.user}, {password}).fetch();
            res.ok();
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    }

};

