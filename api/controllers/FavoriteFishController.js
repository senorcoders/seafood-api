
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
  }

};

