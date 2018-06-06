
module.exports = {
    verificationCode: async (req, res)=>{

        try{
            let id = req.param("id"), code = req.param("code");
            let us = await User.findOne({id});
            if(us === undefined)
                return res.json({message: "code invalid"});
                
            if( us.code === code ){
                us = await User.update({id}, { verification: true }).fetch();
                res.ok();
            }else{
                res.json({message: "code invalid"});
            }
            
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    resetEmail: async ()=>{
        
    }

};

