
module.exports = {
  getXUser: async (req, res)=>{
    try{
        let id = req.param("id");
        let favorites = await FavoriteFish.find({user: id}).populate("fish");

        res.json(favorites);

    }
    catch(e){
        console.error(e);
        res.serverError(e);
    }
  },
  getXUserAndFish: async (req, res)=>{
    try{
        let user = req.param("id"), fish = req.param("fish");
        let favorites = await FavoriteFish.find({user, fish}).populate("fish");

        if( favorites.length > 0 ){
          return res.json({msg: true, id: favorites[0].id})
        }

        res.json({msg: false});

    }
    catch(e){
        console.error(e);
        res.serverError(e);
    }
  },

};

