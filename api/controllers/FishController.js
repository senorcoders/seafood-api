const path = require("path"), fs = require("fs");
const IMAGES = path.resolve(__dirname, '../../images/');

module.exports = {

    getAllPagination: async function (req, res) {
        try {
            let start = Number(req.params.page);
            --start;
            let productos = await Fish.find( {status: '5c0866f9a0eda00b94acbdc2'} ).populate("type").populate("store").paginate({ page: start, limit: req.params.limit });
            productos = await Promise.all(productos.map(async function (m) {
                if (m.store === null)
                    return m;
                m.store.owner = await User.findOne({ id: m.store.owner });            
                m.shippingCost =  await require('./ShippingRatesController').getShippingRateByCities( m.city, m.weight.value ); 
                return m;
            }));

            let arr = await Fish.find( {status: '5c0866f9a0eda00b94acbdc2'} ),
                page_size = Number(req.params.limit), pages = 0;
            console.log(arr.length, Number(arr.length / page_size));
            if (parseInt(arr.length / page_size, 10) < Number(arr.length / page_size)) {
                pages = parseInt(arr.length / page_size, 10) + 1;
            } else {
                pages = parseInt(arr.length / page_size, 10)
            }

            res.json({ productos, pagesNumber: pages });
        }
        catch (e) {
            res.serverError(e);
        }
    },

    customWhere: async function (req, res) {
        try {

            var db = Fish.getDatastore().manager;

            // Now we can do anything we could do with a Mongo `db` instance:
            var fish = db.collection(Fish.tableName);

            if (req.params.hasOwnProperty("where"))
                where = JSON.parse(req.params.where);
            else
                res.json({ message: "where not correct" });

            let productos = await fish.find(where);

            res.json(productos);
        }
        catch (e) {
            res.serverError(e);
        }
    },

    search: async function (req, res) {
        try {

            var db = Fish.getDatastore().manager;

            // Now we can do anything we could do with a Mongo `db` instance:
            var fish = db.collection(Fish.tableName);
            console.log(req.param("search"));
            let pages;
            let productos = await new Promise((resolve, reject) => {
                fish.find({
                    $or:
                        [
                            { name: { '$regex': '^.*' + req.param("search") + '.*$', '$options': 'i' } },
                            { description: { '$regex': '^.*' + req.param("search") + '.*$', '$options': 'i' } }
                        ]
                })
                    .toArray(async (err, arr) => {
                        if (err) { return reject(err); }

                        arr = await Promise.all(arr.map(async function (it) {
                            if (it.store === null)
                                return it;

                            it.store = await Store.findOne({ id: it.store.toString() }).populate("owner");
                            return it;
                        }));
                        if (arr.length > 0) {
                            let page_number = Number(req.param("page"));
                            let page_size = Number(req.param("limit"));
                            console.log(arr.length, Number(arr.length / page_size));
                            if (parseInt(arr.length / page_size, 10) < Number(arr.length / page_size)) {
                                pages = parseInt(arr.length / page_size, 10) + 1;
                            } else {
                                pages = parseInt(arr.length / page_size, 10)
                            }
                            --page_number; // because pages logically start with 1, but technically with 0
                            arr = arr.slice(page_number * page_size, (page_number + 1) * page_size);
                        }
                        resolve(arr);
                    });
            });

            res.json({ fish: productos, pagesCount: pages });

            /*let productos = await Fish.find({name: {contains: req.param("name") } }).populate("type");
            
            res.json(productos);*/
        }
        catch (e) {
            res.serverError(e);
        }
    },

    getSuggestions: async (req, res) => {
        try {
            
            let name = req.param("name");

            var db = Fish.getDatastore().manager;
            var fish = db.collection(Fish.tableName);

            console.log(req.param("search"));
            let fishs = await new Promise((resolve, reject) => {
                fish.find({ status: '5c0866f9a0eda00b94acbdc2', name: { '$regex': '^.*' + name + '.*$', '$options': 'i' } })
                    .toArray(async (err, arr) => {
                        if (err) { return reject(err); }

                        resolve(arr);
                    });
            });

            let countAndFish = [];
            fishs.map(function (it) {
                let index = countAndFish.findIndex((t) => { if (t.name === it.name) return true; else return false; });
                if (
                    index === -1
                ) {
                    let f = { name: it.name, id: it._id };
                    f.count = 1;
                    countAndFish.push(f);
                } else {
                    countAndFish[index].count += 1;
                }

                return null;
            });

            res.json(countAndFish);

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getXMultipleID: async function (req, res) {
        try {
            let ids = false;
            try {
                ids = JSON.parse(req.params.ids);
                if (Object.prototype.toString.call(ids) !== "[object Array]") {
                    throw new Error("ids not is Array");
                }
            }
            catch (e) {
                console.error(e);
            }

            if (ids === false)
                return res.json({ message: "ids not correct array" });

            let productos = [];
            for (let id of ids) {
                let prod = await Fish.findOne({ id: id }).populate("type");
                productos.push(prod);
            }

            res.json(productos);
        }
        catch (e) {
            res.serverError(e);
        }
    },

    delete: async (req, res) => {
        try {

            let id = req.param("id");
            if (id === "" || id === undefined)
                return res.status(500).send("not id");

            let fish = await Fish.findOne({ id });
            if (fish === undefined) {
                return res.status(400).send("fish not found!");
            }

            let namefile, dirname;
            if (fish.hasOwnProperty("imagePrimary") && fish.imagePrimary !== "" && fish.imagePrimary !== null) {
                namefile = fish.imagePrimary.split("/");
                namefile = namefile[namefile.length - 2];
                console.log(IMAGES, fish.id, namefile);
                dirname = path.join(IMAGES, "primary", fish.id, namefile);
                console.log(dirname);
                if (fs.existsSync(dirname)) {
                    console.log("exits primary");
                    fs.unlinkSync(dirname);
                    //dirname = path.join(IMAGES, "primary", fish.id);
                    //fs.unlinkSync(dirname);
                }
            }

            if (fish.hasOwnProperty("images") && fish.iamges !== null && Object.prototype.toString.call(fish.images) === "[object Array]") {
                for (let file of fish.images) {

                    namefile = file.filename;
                    dirname = path.join(IMAGES, fish.id, namefile);
                    console.log(dirname);
                    if (fs.existsSync(dirname)) {
                        console.log("exists");
                        fs.unlinkSync(dirname);
                    }
                }

                //dirname = path.join(IMAGES, fish.id);
                //if (fs.existsSync(dirname)) {
                //    console.log("exists");
                //    fs.unlinkSync(dirname);
                //}
            }

            await Fish.destroy({ id });

            res.json(fish);

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getXTypeWithDataEspecified: async (req, res) => {
        try {

            let type = req.param("type");

            //Para cagar los items de cada carrito cargado
            async function getItemsCart(shoppingCart) {
                let items = await ItemShopping.find({ shoppingCart: shoppingCart.id }).populate("fish", { where: {status: '5c0866f9a0eda00b94acbdc2'} });
                items = items.filter(function (it) {
                    return it.fish.type === type;
                });

                //Cargamos el comprador y la tienda
                items = items.map(function (it) {
                    return {
                        id: it.fish.id,
                        name: it.fish.name,
                        quantity: it.quantity
                    };
                });

                return items;
            }

            let itemsFish = [];
            let cartsPaid = await ShoppingCart.find({ status: "paid" }).populate("buyer");
            for (let cart of cartsPaid) {
                let its = await getItemsCart(cart);
                itemsFish = itemsFish.concat(its);
            }

            let itemsP = [];
            for (let it of itemsFish) {
                let index = itemsP.findIndex(function (ite) {
                    return ite.name === it.name;
                });

                if (index === -1) {
                    let parser = it;
                    parser.quantity = [it.quantity];
                    itemsP.push(parser);
                } else {

                    let find = false;
                    for (let i = 0; i < itemsP[index].quantity.length; i++) {
                        if (itemsP[index].quantity[i].type === it.quantity.type) {
                            find = true;
                            itemsP[index].quantity[i].value += it.quantity.value;
                            break;
                        }
                    }

                    if (find === false) {
                        itemsP[index].quantity.push(it.quantity);
                    }
                }
            }

            res.json(itemsP);

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getWithDataEspecified: async (req, res) => {
        try {

            //Para cagar los items de cada carrito cargado
            async function getItemsCart(shoppingCart) {
                let items = await ItemShopping.find({ shoppingCart: shoppingCart.id }).populate("fish", { where: {status: '5c0866f9a0eda00b94acbdc2'} });

                //Cargamos el comprador y la tienda
                items = await Promise.all(items.map(async function (it) {

                    it.fish = await Fish.findOne({ id: it.fish.id }).populate("type");
                    return {
                        quantity: it.quantity,
                        type: it.fish.type
                    };
                }));

                return items;
            }

            let itemsFish = [];
            let cartsPaid = await ShoppingCart.find({ status: "paid" });
            for (let cart of cartsPaid) {
                let its = await getItemsCart(cart);
                itemsFish = itemsFish.concat(its);
            }

            let itemsP = [];
            for (let it of itemsFish) {
                let index = itemsP.findIndex(function (ite) {
                    return ite.type.id === it.type.id;
                });

                if (index === -1) {
                    let parser = it;
                    parser.quantity = [it.quantity];
                    itemsP.push(parser);
                } else {

                    let find = false;
                    for (let i = 0; i < itemsP[index].quantity.length; i++) {
                        if (itemsP[index].quantity[i].type === it.quantity.type) {
                            find = true;
                            itemsP[index].quantity[i].value += it.quantity.value;
                            break;
                        }
                    }

                    if (find === false) {
                        itemsP[index].quantity.push(it.quantity);
                    }
                }
            }

            res.json(itemsP);

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    saveMulti: async (req, res) => {
        try {
            let products = req.body.products;
            for (let pro of products) {
                await Fish.create(pro);
            }

            res.json({ msg: "success" })
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    searchAvanced: async (req, res) => {
        try {

            let params = `
            name,
            country,
            fishType,
            raised,
            preparation,
            treatment`;

            let par = {};
            for (let p of await sails.helpers.parserNameParams(params)) {
                if (req.param(p) !== undefined) {
                    if ("fishType" === p) {
                        par["type"] = req.param(p);
                    } else
                        par[p] = { "contains": req.param(p) };
                }
            }
            console.log(par);

            let start = Number(req.params.page), page_size = Number(req.params.limit)
            --start;
            if (start < 0) start = 0;
            let productos = await Fish.find(par).populate("type").populate("store").paginate(start, page_size);

            let arr = await Fish.find(par).populate("type").populate("store"), pages = 0;
            console.log(arr.length, Number(arr.length / page_size));
            if (parseInt(arr.length / page_size, 10) < Number(arr.length / page_size)) {
                pages = parseInt(arr.length / page_size, 10) + 1;
            } else {
                pages = parseInt(arr.length / page_size, 10)
            }

            res.json({ productos, pagesNumber: pages, count: arr.length });

        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getDistinctCountry: async (req, res) => {
        try {
            var db = Fish.getDatastore().manager;
            var fish = db.collection(Fish.tableName);

            let fishs = await new Promise((resolve, reject) => {
                fish.distinct("country", {},
                    function (err, docs) {
                        if (err) {
                            return reject(err);
                        }
                        if (docs) {
                            resolve(docs);
                        }
                    })
            });


            res.json(fishs);
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    filterProducts: async ( req, res ) => {
        try {
            let preparation = req.param('preparation');
            let treatment = req.param('treatment');
            let raised = req.param('raised');

            let country = req.param('country');
            let category = req.param('category');
            let subcategory = req.param('subcategory');

            let minimumOrder = req.param('minimumOrder');
            let maximumOrder = req.param('maximumOrder');
            let cooming_soon = req.param('cooming_soon');
            let minPrice = req.param('minPrice'); //price.value
            let maxPrice = req.param('maxPrice'); //price.value

            let condWhere = { where: {status: '5c0866f9a0eda00b94acbdc2'} };

            if( preparation !== '0' && preparation !== undefined && preparation.length != 0 )
                condWhere.where['preparation'] = preparation;

            if( treatment !== '0' && treatment !== undefined && treatment.length != 0 )
                condWhere.where['treatment'] = treatment;

            if( raised !== '0' && raised !== undefined && raised.length != 0 )
                condWhere.where['raised'] = raised;

            if( country !== '0' )
                condWhere.where['country'] = country;

            if( maximumOrder !== '0' )
                condWhere.where['maximumOrder'] = { '<=': maximumOrder };

            if( minimumOrder !== '0' )
                condWhere.where['minimumOrder'] = { '>=': minimumOrder };
            
            if( cooming_soon !== '0' ){
                condWhere.where['cooming_soon'] = cooming_soon;
            }
            
            if( subcategory !== '0' ){
                condWhere.where['type'] = subcategory;                
            }else {
                if( category !== '0' ){
                    let categoryChilds = await FishType.find({
                        where: { parent: category, status: '5c0866f9a0eda00b94acbdc2' }
                    })
                    .then(function ( result ) {
                        return result.map( value => {
                            return value.id;
                        } )
                    })
                    .catch(function (error) {
                        console.log(error);
                        return res.serverError(error);
                    })
                    categoryIds = categoryChilds ;
                    categoryIds.push(category);
                    condWhere.where['type'] = categoryIds;
                }                
            }
            let fish_price_ids = '';
            if( minPrice!== '0' || maxPrice !== '0' ){
                
                fish_price_ids = await Fish.native(  function(err, collection) {
                    if (err) return res.serverError(err);

                    let price_ids =  collection.find(
                        {
                            $and: [ 
                                {status: '5c0866f9a0eda00b94acbdc2'},
                                { 
                                    "price.value": { $gte: parseInt(minPrice) } 
                                }, 
                                { 
                                    "price.value": { $lte: parseInt(maxPrice) }  
                                } ] 
                        }, {}).toArray( async function (err, results) {
                        if (err) return res.serverError(err);
                        
                        justIds =  results.map( ( row ) => {
                            return row._id.toString()
                        } )
                        condWhere.where['id'] =  justIds ;
                                  
                        /*let fishes = await Fish.find(
                            condWhere
                        ).populate("type")
                        .then(function ( result ) {
                            let shippingRate = 
                            res.status(200).json( result );
                        }) */     
                        let productos = await Fish.find( condWhere ).populate("type").populate("store");
                        productos = await Promise.all(productos.map(async function (m) {
                            m.shippingCost =  await require('./ShippingRatesController').getShippingRateByCities( m.city, m.weight.value ); 
                            if (m.store === null)
                                return m;
                            m.store.owner = await User.findOne({ id: m.store.owner });            
                            return m;
                        }));
                        res.status(200).json( productos );
                        return justIds;
                    });
                    return price_ids
                });            
            }else{
                /*let fishes = await Fish.find(
                    condWhere
                ).populate("type")
                .then(function ( result ) {
                    res.status(200).json( result );
                })*/
                let productos = await Fish.find( condWhere ).populate("type").populate("store");
                productos = await Promise.all(productos.map(async function (m) {
                    m.shippingCost =  await require('./ShippingRatesController').getShippingRateByCities( m.city, m.weight.value ); 
                    if (m.store === null)
                        return m;
                    m.store.owner = await User.findOne({ id: m.store.owner });            
                    return m;
                }));
                res.status(200).json( productos );
            }
            console.log( fish_price_ids );             
            
            

        } catch (error) {
            console.log(error);
            res.serverError(error);
        }            

    },  

    generateSKU: async (req, res) => {
        let store = req.param('store_code');
        let category = req.param('category_code');
        let subcategory = req.param('subcategory_code');
        let country = req.param('country');
        
        let store_name = await Store.find( 
            {
                where: {
                    "id": store
                }
            } 
        )
	

        let country_name = await Countries.find( 
            {
                where: {
                    "code": country
                }
            }
        )

        let category_name = await FishType.find( 
            {
                where: {
                    "id": category
                }
            } 
        )
        
        let subcategory_name = await FishType.find( 
            {
                where: {
                    "id": subcategory
                }
            } 
        )

        let fishes = await Fish.count( {
            country: country,
            store: store,
            type: subcategory,
            country: country            
        } )

        let body = {
            store_name: store_name[0].name,
            country: country_name[0].name,
            category: category_name[0].name,
            sub: subcategory_name[0].name,
            country: country_name[0].name
        }
        fishes += 1;
        if(fishes < 10)
            fishes = '0' + fishes;        

        res.status(200).json( `${store_name[0].name.substring(0, 3).toUpperCase()}-${category_name[0].name.substring(0, 3).toUpperCase()}-${subcategory_name[0].name.substring(0, 3).toUpperCase()}-${country_name[0].name.substring(0, 3).toUpperCase()}-${fishes}` );
        
    },

    updateStatus: async ( req, res ) => {
        try {
            let id = req.param("id");
            let statusID = req.param("statusID");
            let SFSAdminFeedback=req.param("SFSAdminFeedback")
            let fishUpdated;
            //let fish = await Fish.update({id}, { status: statusID,statusReason:reason }).fetch();
            let fish=await Fish.findOne({id}).populate('store');
            let store=await Store.findOne({id:fish.store.id}).populate('owner');
            if( statusID == '5c0866f2a0eda00b94acbdc1' ){ //Not Approved
                if( SFSAdminFeedback && SFSAdminFeedback!==''){
                    fishUpdated = await Fish.update({id}, { status: statusID,SFSAdminFeedback:SFSAdminFeedback }).fetch();
                    await require("./../../mailer").sendEmailProductRejected(store.owner, fish,SFSAdminFeedback);
                }
                else{
                    res.serverError( {'msg':"You need to provide a reason for not approved the product"} )
                }
            }else if( statusID == '5c0866f9a0eda00b94acbdc2' ){ //Approved
                //TODO: add here email templates
                fishUpdated = await Fish.update({id}, { status: statusID }).fetch();
                await require("./../../mailer").sendEmailProductApproved(store.owner, fish);
            }

            res.status( 200 ).json( fishUpdated )
        } catch (error) {
            res.serverError( error );
        }
    },

    getPendingProducts: async ( req, res ) => {
        try {
            let fishes = await Fish.find( { status: '5c0866e4a0eda00b94acbdc0' } ).populate( 'store' ).populate( 'type' );
            fishes = await Promise.all(fishes.map(async (it) => {
                try {
                    let owner = await User.findOne( { id:  it.store.owner } )
                    it.owner = {
                        id: owner.id,
                        email: owner.email,
                        firstName: owner.firstName,
                        lastName: owner.lastName,
                        location: owner.location,
                        dataExtra: owner.dataExtra
                    }
                }
                catch (e) {
                    console.error(e);
                }                
                return it;
            }))


            res.status( 200 ).json( fishes );
        } catch (error) {
            console.log( error );
            res.serverError( error );
        }
    },
    getItemCharges: async ( req, res ) => {
        try {
            
            let id = req.param( 'id' );
            let weight = req.param( 'weight' );

            let fish = await Fish.findOne( { id } ).populate( 'type' ).populate( 'store' );
            let fishPrice = fish.price.value;
            let owner = await User.findOne( { id: fish.store.owner } ) ;
            let firstMileCost = owner.firstMileCost * weight * fishPrice;
            let firstMileFee = firstMileCost * weight * fishPrice;

            shipping = await require( './ShippingRatesController' ).getShippingRateByCities( fish.city, weight );
            shippingCost = shipping * weight;

            currentAdminCharges = await require( './PricingChargesController' ).CurrentPricingCharges();
            customs         = currentAdminCharges.customs[0].price;
            uaeTaxes        = currentAdminCharges.uaeTaxes[0].price;
            handlingFees    = currentAdminCharges.handlingFees[0].price;
            lastMileCost    = currentAdminCharges.lastMileCost[0].price;
            let sfsMargin   =  fish.type.sfsMargin;
            let shippingFee = shipping * weight;
            let customsFee  = ( ( customs / 100 ) + 1) * ( fishPrice * weight );
            let handlingFee = handlingFees * weight;            

            let charges = {
                weight: weight,
                sfsMargin: sfsMargin,
                shipping: shipping,
                customs: customs,
                uaeTaxes: uaeTaxes,
                firstMileCost: firstMileCost,
                lastMileCost: lastMileCost,
                shippingFee: shippingFee,
                customsFee: customsFee,                
                handlingFee: handlingFee,
                firstMileFee: firstMileFee,
                shippingCost: {
                    cost: firstMileCost + shippingFee + lastMileCost,
                    include: 'first mile cost + shipping fee + last mile cost'
                },
                sfsMarginCost: sfsMargin * weight,
                
            }

            res.status( 200 ).json( charges );

        } catch (error) {
            console.log( error );
            res.serverError( error );
        }
    },

    getFishs: catchErrors(async (req, res) => {
        let fishstypes = await FishType.find().populate("childsTypes").populate("parentsTypes");
        fishstypes = await Promise.all(fishstypes.map(async (it) => {
            try {
                it.childsTypes = await getChildsTypes(it.childsTypes);
                it.parentsTypes = await getParentsTypes(it.parentsTypes);
            }
            catch (e) {
                console.error(e);
            }

            return it;
        }))
        res.json(fishstypes);
    })
};

getChildsTypes = async childs => {
    childs = await Promise.all(childs.map(async it => {
        it.child = await FishType.findOne({ id: it.child });
        return it;
    }));

    return childs;
};

getParentsTypes = async parents => {
    parents = await Promise.all(parents.map(async it => {
        it.parent = await FishType.findOne({ id: it.parent });
        return it;
    }));

    return parents;
}
