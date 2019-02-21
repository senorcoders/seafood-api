const path = require("path"), fs = require("fs");
const IMAGES = path.resolve(__dirname, '../../images/');

module.exports = {
    addFish: async (req, res) => {
        try {
            let body = req.body;
            let product=await Fish.create(body).fetch();
            let store=await Store.findOne(product.store).populate('owner')
            if(product){
                await MailerService.newProductAddedAdminNotified(product,store.owner);
                await MailerService.newProductAddedSellerNotified(product,store.owner);
                //await require("./../../mailer").sendEmailNewProductAdded(product,store.owner);
                //await require("./../../mailer").sendEmailNewProductAddedSeller(product,store.owner);
                res.json({ product })
            }
            else{
                res.serverError({message:"error saving product"});
            }
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },
    getAllPagination: async function (req, res) {
        try {
            let start = Number(req.params.page);
            --start;
            let productos = await Fish.find( {status: '5c0866f9a0eda00b94acbdc2'} ).populate("type").populate("store").populate('status').paginate({ page: start, limit: req.params.limit });
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

            //check if had records in the carts
            let hasRecords = await ItemShopping.find( { fish: id } );

            if( hasRecords.length > 0 ) { 
                // we can't deleted from the database so we are going to update the status of the fish
                let updatedFish = await Fish.update( { id: id }, { status: '5c45f7a382295a06e36cb304' } );
                res.status( 200 ).json( updatedFish );
            } else {
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
            let subspecies = req.param('subspecies');
            let descriptor = req.param('descriptor');

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

            console.log( 'category', category );
            if( descriptor !== '0' ){
                condWhere.where['descriptor'] = descriptor;
            } else if ( subspecies !== '0' ){
                let descriptorChilds = [];
                
                level1 = await FishType.find({
                    where: { parent: subspecies }
                });
                console.log( 'level1', level1 );
                
                Promise.all( level1.map( async value1 => {
                    descriptorChilds.push( value1.id );

                    level2 = await FishType.find( { parent: value1.id } );
                    console.log( 'level2', level2 );


                    return categoryChilds;
                } ) );
                condWhere.where['descriptor'] = descriptorChilds;
                condWhere.where['type'] = subspecies;
            } else if ( subcategory !== '0' ) {
                
                console.log( 'parent' )
                //condWhere.where['type'] =;
                let categoryChilds = [];
                categoryChilds.push( subcategory );
                level1 = await FishType.find({
                    where: { parent: subcategory }
                });
                console.log( 'level1', level1 );
                
                Promise.all( level1.map( async value1 => {
                    categoryChilds.push( value1.id );

                    level2 = await FishType.find( { parent: value1.id } );
                    console.log( 'level2', level2 );


                    return categoryChilds;
                } ) );

                condWhere.where['type'] =  categoryChilds ;
            } else if ( category !== '0' ) {
                console.log( 'parent' )
                //condWhere.where['type'] =;
                let categoryChilds = [];
                categoryChilds.push( category );
                level1 = await FishType.find({
                    where: { parent: category }
                });
                console.log( 'level1', level1 );
                
                Promise.all( level1.map( async value1 => {
                    categoryChilds.push( value1.id );

                    level2 = await FishType.find( { parent: value1.id } );
                    console.log( 'level2', level2 );

                    Promise.all( level2.map( async value2 => {
                        categoryChilds.push( value2.id );

                        level3 = await FishType.find( { parent: value2.id } );
                        console.log( 'level3', level3 );
                        level3.map( value3 => {
                            categoryChilds.push( value3.id );
                        } )
                        return categoryChilds;

                    } ) )

                    return categoryChilds;
                } ) );

                condWhere.where['type'] =  categoryChilds ;
            }
            
            /*if( subcategory !== '0' ){
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
            }*/
            let fish_price_ids = '';
            if( minPrice!== '0' || maxPrice !== '0' ){
                
                fish_price_ids = await Fish.native(  function(err, collection) {
                    if (err) return res.serverError(err);
                    console.log( 'min', minPrice );
                    console.log( 'max', maxPrice );
                    //{status: '5c0866f9a0eda00b94acbdc2'},
                    let price_ids =  collection.find(
                        {
                            $and: [ 
                                
                                { 
                                    "price.value": { $gte: parseInt(minPrice) } 
                                }, 
                                { 
                                    "price.value": { $lte: parseInt(maxPrice) }  
                                } ] 
                        }, { "status": '5c0866f9a0eda00b94acbdc2' } ).toArray( async function (err, results) {
                        if (err) return res.serverError(err);
                        //console.log( 'justids', results );
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
            //console.log( fish_price_ids );             
            
            

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
            
            let fishUpdated;
            //let fish = await Fish.update({id}, { status: statusID,statusReason:reason }).fetch();
            let fish=  await Fish.findOne({id}).populate('store');
            let store = await Store.findOne({ id: fish.store.id}).populate('owner');
            if( statusID == '5c0866f2a0eda00b94acbdc1' ){ //Not Approved
                let SFSAdminFeedback= req.body['message']; //req.param("SFSAdminFeedback")
                console.log( SFSAdminFeedback )
                if( SFSAdminFeedback && SFSAdminFeedback!==''){
                    fishUpdated = await Fish.update({id}, { status: statusID,SFSAdminFeedback:SFSAdminFeedback }).fetch();
                    //await require("./../../mailer").sendEmailProductRejected(store.owner, fish,SFSAdminFeedback);
                    await MailerService.newProductRejected(store.owner, fish,SFSAdminFeedback);
                }
                else{
                    res.serverError( {'msg':"You need to provide a reason for not approved the product"} )
                }
            }else if( statusID == '5c0866f9a0eda00b94acbdc2' ){ //Approved
                
                fishUpdated = await Fish.update({id}, { status: statusID }).fetch();
                await MailerService.newProductAccepted(store.owner, fish);
                //await require("./../../mailer").sendEmailProductApproved(store.owner, fish);
            }

            res.status( 200 ).json( fishUpdated )
        } catch (error) {
            res.serverError( error );
        }
    },

    getPendingProducts: async ( req, res ) => {
        try {
            let countries = await Countries.find();
            let fishes = await Fish.find( { status: '5c0866e4a0eda00b94acbdc0' } ).populate( 'store' ).populate( 'type' );

            
            fishes = await Promise.all(fishes.map(async (it) => {
                try {
                    let owner = await User.findOne( { id:  it.store.owner } )


                    let fishID = req.param( 'fishID' );

                    let level2 = it.type;
                    
                    let descriptor = await FishType.findOne( { id: it.descriptor } );
                    

                    let level1 = await FishType.findOne( { id: level2.parent } );

                    let level0 = await FishType.findOne( { id: level1.parent } );

                    let parentsLevel = { level0, level1, level2, descriptor } ;
                    it.parentsLevel = parentsLevel;
                    
                    await countries.map( async country => {
                        if( it.country == country.code ){
                            it.countryName = country.name;
                            console.log(country.name)

                            await country.cities.map( city => {
                                if( it.city == city.code ) {
                                    it.cityName = city.name;
                                    console.log(city);
                                }
                            })
                        }
                        if ( it.processingCountry == country.code ) {
                            it.processingCountryName = country.name;
                        }
                    } )

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

            let charges = await  module.exports.getItemChargesByWeight( id, weight ); 

            res.status( 200 ).json( charges );

        } catch (error) {
            console.log( error );
            res.serverError( error );
        }
    },    

    getShippingBySeller: async ( firstMileFee, city, weight ) => {
        shipping = await require( './ShippingRatesController' ).getShippingRateByCities( city, weight );
   
        currentAdminCharges = await require( './PricingChargesController' ).CurrentPricingCharges();
                 
        handlingFees    = currentAdminCharges.handlingFees[0].price;
        lastMileCost    = currentAdminCharges.lastMileCost[0].price;        

        //calculate cost       
        let shippingFee   = shipping * weight; //b1
        let handlingFee   = handlingFees * weight; //b2 //are 3 AED/KG to get the shipment released from Customs.
        let shippingCost  = firstMileFee + shippingFee + handlingFee + lastMileCost; //C = first mile cost + b1 + b2 + last mile cost
        
        return { firstMileFee, shippingFee, handlingFee, shippingCost };

    },

    getItemChargesByWeight: async ( id, weight) => {
        let fish = await Fish.findOne( { where: { id: id } } ).populate( 'type' ).populate( 'store' );
                let fishPrice = fish.price.value;
                let owner = await User.findOne( { id: fish.store.owner } ) ;
                let firstMileCost = owner.firstMileCost;
                let firstMileFee = firstMileCost * weight * fishPrice;
    
                shipping = await require( './ShippingRatesController' ).getShippingRateByCities( fish.city, weight );
                //shippingCost = shipping * weight;
                
                currentAdminCharges = await require( './PricingChargesController' ).CurrentPricingCharges();
                customs         = currentAdminCharges.customs[0].price;  
                uaeTaxes        = currentAdminCharges.uaeTaxes[0].price; //Taxes in the UAE are 5% on the final price paid by the buyer (not by item)
                handlingFees    = currentAdminCharges.handlingFees[0].price;
                lastMileCost    = currentAdminCharges.lastMileCost[0].price;
                sfsMargin       = fish.type.sfsMargin;
                
                //calculate cost
                let fishCost = fishPrice * weight; // A
                let shippingFee   = shipping * weight; //b1
                let handlingFee   = handlingFees * weight; //b2 //are 3 AED/KG to get the shipment released from Customs.
                let shippingCost  = firstMileFee + shippingFee + handlingFee + lastMileCost; //C = first mile cost + b1 + b2 + last mile cost
                let sfsMarginCost = (sfsMargin / 100) * fishCost; // D= SFS Fee A //calculated from the total amount of the the product sales excluding shipping fees and taxes.
                let customsFee    = ( customs / 100 )  * fishCost; //E= Customs rate * A  //Customs in the UAE are 5% on the Seller’s invoice (The seller’s Sale excluding additional Costs
                let uaeTaxesFee   = ( fishCost + shippingCost + customsFee + sfsMarginCost  ) * ( uaeTaxes  / 100 ); //F = (A+C+D+E) Tax
                let finalPrice    = fishCost + shippingCost + sfsMarginCost + customsFee + uaeTaxesFee ;

                //returning json
                let charges = {
                    weight: Number(parseFloat(weight).toFixed(2)),
                    sfsMargin: Number(parseFloat(sfsMargin).toFixed(2)),
                    shipping: Number(parseFloat(shipping).toFixed(2)),
                    customs: Number(parseFloat(customs).toFixed(2)),
                    uaeTaxes: Number(parseFloat(uaeTaxes).toFixed(2)),
                    fishCost: fishCost,
                    firstMileCost: Number(parseFloat(firstMileCost).toFixed(2)),
                    lastMileCost: Number(parseFloat(lastMileCost).toFixed(2)),
                    shippingFee: Number(parseFloat(shippingFee).toFixed(2)),
                    customsFee: Number(parseFloat(customsFee).toFixed(2)),
                    handlingFee: Number(parseFloat(handlingFee).toFixed(2)),
                    firstMileFee: Number(parseFloat(firstMileFee).toFixed(2)),
                    shippingCost: {
                        cost: Number(parseFloat(shippingCost).toFixed(2)),
                        include: 'first mile cost + shipping fee + handling fee + last mile cost'
                    },
                    sfsMarginCost: Number(parseFloat(sfsMarginCost).toFixed(2)),
                    uaeTaxesFee: Number(parseFloat(uaeTaxesFee).toFixed(2)),
                    finalPrice: Number(parseFloat(finalPrice).toFixed(2)) 
                }
                return charges;
    },

    getItemChargesByWeight: async ( id, weight, currentAdminCharges) => {
        let fish = await Fish.findOne( { where: { id: id } } ).populate( 'type' ).populate( 'store' );
                let fishPrice = Number( parseFloat( fish.price.value ) );
                let owner = await User.findOne( { id: fish.store.owner } ) ;
                let firstMileCost = Number( parseFloat( owner.firstMileCost ) );
                let firstMileFee = firstMileCost * weight * fishPrice;
    
                shipping = await require( './ShippingRatesController' ).getShippingRateByCities( fish.city, weight );
                //shippingCost = shipping * weight;
                
                if( currentAdminCharges === undefined ){
                    currentAdminCharges = await require( './PricingChargesController' ).CurrentPricingCharges();
                }

                customs         = currentAdminCharges.customs[0].price;  
                uaeTaxes        = currentAdminCharges.uaeTaxes[0].price; //Taxes in the UAE are 5% on the final price paid by the buyer (not by item)
                handlingFees    = currentAdminCharges.handlingFees[0].price;
                lastMileCost    = currentAdminCharges.lastMileCost[0].price;
                sfsMargin       = fish.type.sfsMargin;
                
                //calculate cost
                let fishCost = (fishPrice * weight); // A
                let shippingFee   = shipping * weight; //b1
                let handlingFee   = handlingFees * weight; //b2 //are 3 AED/KG to get the shipment released from Customs.
                let shippingCost  = firstMileFee + shippingFee + handlingFee + lastMileCost; //C = first mile cost + b1 + b2 + last mile cost
                let sfsMarginCost = (sfsMargin / 100) * fishCost; // D= SFS Fee A //calculated from the total amount of the the product sales excluding shipping fees and taxes.
                let customsFee    = ( customs / 100 )  * fishCost; //E= Customs rate * A  //Customs in the UAE are 5% on the Seller’s invoice (The seller’s Sale excluding additional Costs
                let uaeTaxesFee   = ( fishCost + shippingCost + customsFee + sfsMarginCost  ) * ( uaeTaxes  / 100 ); //F = (A+C+D+E) Tax
                let finalPrice    = fishCost + shippingCost + sfsMarginCost + customsFee + uaeTaxesFee ;

                //returning json
                let charges = {
                    weight: Number(parseFloat(weight).toFixed(2)),
                    sfsMargin: Number(parseFloat(sfsMargin).toFixed(2)),
                    shipping: Number(parseFloat(shipping).toFixed(2)),
                    customs: Number(parseFloat(customs).toFixed(2)),
                    uaeTaxes: Number(parseFloat(uaeTaxes).toFixed(2)),
                    fishCost: fishCost,
                    firstMileCost: Number(parseFloat(firstMileCost).toFixed(2)),
                    lastMileCost: Number(parseFloat(lastMileCost).toFixed(2)),
                    shippingFee: Number(parseFloat(shippingFee).toFixed(2)),
                    customsFee: Number(parseFloat(customsFee).toFixed(2)),
                    handlingFee: Number(parseFloat(handlingFee).toFixed(2)),
                    firstMileFee: Number(parseFloat(firstMileFee).toFixed(2)),
                    shippingCost: {
                        cost: Number(parseFloat(shippingCost).toFixed(2)),
                        include: 'first mile cost + shipping fee + handling fee + last mile cost'
                    },
                    sfsMarginCost: Number(parseFloat(sfsMarginCost).toFixed(2)),
                    uaeTaxesFee: Number(parseFloat(uaeTaxesFee).toFixed(2)),
                    finalPrice: Number(parseFloat(finalPrice).toFixed(2)) 
                }
                return charges;
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

