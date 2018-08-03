
module.exports = {
  getXUser: async (req, res)=>{
    try{
        let id = req.param("id");
        let favorites = await FavoriteFish.find({user: id});
        favorites = await Promise.all(favorites.map(async it=>{
          it.fish = await Fish.findOne({id: it.fish}).populate("type");
          return it;
        }));

        res.json(favorites);

    }
    catch(e){
        console.error(e);
        res.serverError(e);
    }
  },
  getXUserAndFish: async (req, res)=>{
    try{
        let user = req.param("user"), fish = req.param("fish");
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

