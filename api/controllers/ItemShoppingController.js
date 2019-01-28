const favoriteFsihCtrl = require("./FavoriteFishController");

module.exports = {
    getWithAllData: async function(req, res){
        try{
            let item = await ItemShopping.findOne({id: req.param("id")}).populate("fish").populate("shoppingCart").populate( 'status' );
            item.shoppingCart = await ShoppingCart.findOne({id: item.shoppingCart.id}).populate("buyer").populate( 'orderStatus' );

            res.json(item);
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    getItemsXCart: async function (req, res) {
        try{
            let items = await ItemShopping.find({shoppingCart: req.param("id") }).populate('status');
            items = await Promise.all(items.map(async function(it){
                //console.log(it);
                try{
                    it.fish = await Fish.findOne({ id: it.fish });
                    it.fish.store = await Store.findOne({ id: it.fish.store });
                    // it.ItemStatus = await OrderStatus.findOne( { id: it.status } );
                    it.fish.storeOwner = await User.findOne( { id: it.fish.store.owner } );                
                    it.favorite = await new Promise((resolve, reject)=>{
                        let ress = {
                            json: resolve,
                            serverError: reject
                        };
                        reqq = {
                            param: function(id){
                                let params = {
                                    user: req.param("user"),
                                    fish: it.fish.id
                                };

                                return params[id];
                            }
                        }
                        favoriteFsihCtrl.getXUserAndFish(reqq, ress);
                    });
                }
                catch(e){
                    console.error(e);
                }

                return it;
            }));

            res.json(items);
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    getItemsXStorePaid: async function(req, res){
        try{
            let id = req.param("id");
            let store = await Store.findOne({id});
            if( store === undefined ){
                return res.status(400).send("not found");
            }

            //cargamos los fish de la tienda
            let fishs = await Fish.find({store: store.id});

            //cargamos los items shopping con los datos de cart
            let itemsShoppings = [];
            for(let f of fishs){
                let items = await ItemShopping.find({fish: f.id}).populate("fish").populate("shoppingCart").populate("status").sort('updatedAt DESC');
                itemsShoppings = itemsShoppings.concat(items);
            }

            //filtrmos los items que ya esten pagados
            itemsShoppings = itemsShoppings.filter(function(it){
                if( it.shoppingCart === null || it.shoppingCart.status === null ) return false;
                return it.shoppingCart.status == "paid" && it.shippingStatus === "pending";
            });

            //Agregamos los datos del comprador
            itemsShoppings = await Promise.all(itemsShoppings.map(async function(it){
                it.shoppingCart = await ShoppingCart.findOne({ id: it.shoppingCart.id}).populate("buyer");
                return it;
            }));

            res.json(itemsShoppings);
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    getItemsXStoreAndItemPaid: async function(req, res){
        try{
            let id = req.param("id");
            let store = await Store.findOne({id});
            if( store === undefined ){
                return res.status(400).send("not found");
            }

            //cargamos los fish de la tienda
            let fishs = await Fish.find({store: store.id});

            //cargamos los items shopping con los datos de cart
            let itemsShoppings = [];
            for(let f of fishs){
                let items = await ItemShopping.find({fish: f.id}).populate("fish").populate("shoppingCart");
                itemsShoppings = itemsShoppings.concat(items);
            }

            //filtrmos los items que ya esten pagados
            itemsShoppings = itemsShoppings.filter(function(it){
                if( it.shoppingCart === null || it.shoppingCart.status === null ) return false;
                return it.shoppingCart.status === "paid" && it.shippingStatus === "shipped";
            });

            //Agregamos los datos del comprador
            itemsShoppings = await Promise.all(itemsShoppings.map(async function(it){
                it.shoppingCart = await ShoppingCart.findOne({ id: it.shoppingCart.id}).populate("buyer");
                return it;
            }));

            itemsShoppings = itemsShoppings.sort((a, b)=>{
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.createdAt) - new Date(a.createdAt);
              });

              itemsShoppings = itemsShoppings.map((a)=>{
                  a.createdAt = new Date(a.createdAt);
                  return a;
              });

            res.json(itemsShoppings);
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    updateStatusToShipped: async function(req, res){
        try{

            let  id = req.param("id");
            let item = await ItemShopping.findOne({id}).populate("shoppingCart").populate("fish");
            if( item === undefined ){
                res.status(400).send("not found");
            }

            let cart = await ShoppingCart.findOne({id: item.shoppingCart.id}).populate("buyer")

            await ItemShopping.update({id}, {shippingStatus:"shipped", status: '5c017b0e47fb07027943a406'})

            await require("./../../mailer").sendEmailItemRoad(cart.buyer.email, item.trackingID, item.trackingFile, item);

            res.json({msg: "success"});
        }
        catch(e){
            console.error(e);
            res.serverError(e);
        }
    },

    updateItemStatus: async ( req, res ) => {
        try {
            let id = req.param("id");
            let status = req.param("status");            
            let userEmail = req.body.userEmail;
            let userID = req.body.userID;
            var ts = Math.round((new Date()).getTime() / 1000);

            let item = await ItemShopping.findOne({id}).populate("shoppingCart").populate("fish");
            if( item === undefined ){
                res.status(400).send("not found");
            }
            let currentUpdateDates = [];
            
            if( item.hasOwnProperty('updateInfo') ){
            	if(item.updateInfo!=null){
            		currentUpdateDates =  item.updateInfo;
            	}
            }
            let newStatus = await OrderStatus.findOne( { id: status } );
            let user = await User.findOne( { id: userID } );
            currentUpdateDates.push( 
                { 
                    action: newStatus.status,
                    at: ts,
                    by: `${user.firstName} ${user.lastName}`,
                    userID: userID,
                    email: userEmail,
                    name: `${user.firstName} ${user.lastName}`,
                    ip: req.ip
                } 
            )
            let store=await Store.findOne({id:item.fish.store}).populate("owner")
            let cart = await ShoppingCart.findOne({id: item.shoppingCart.id}).populate("buyer")
            let name=cart.buyer.firstName+' '+cart.buyer.lastName;
            if( status == '5c017af047fb07027943a405' ){//pending seller fulfillment

                let buyerDateParts = item.buyerExpectedDeliveryDate.split('/');
                let buyerMonth = buyerDateParts[0] - 1;
                let buyerDay = buyerDateParts[1];
                let buyerYear = buyerDateParts[2];

                let buyerDate = new Date( buyerYear, buyerMonth, buyerDay );

                let sellerDateParts = req.body.sellerExpectedDeliveryDate.split('/');
                let sellerMonth = sellerDateParts[0] - 1;
                let sellerDay = sellerDateParts[1];
                let sellerYear = sellerDateParts[2];

                let sellerDate = new Date( sellerYear, sellerMonth, sellerDay );
                console.log( 'seller', sellerDate);
                console.log( 'buyer', buyerDate );  
                if( sellerDate > buyerDate ){
                    //sent email to the admin with an alert
                    console.log( 'sent email' );
                    await MailerService.sentAdminWarningETA(cart,store,item,name);
                }
                
                await ItemShopping.update({id}, { status: '5c017af047fb07027943a405', sellerExpectedDeliveryDate: req.body.sellerExpectedDeliveryDate , updateInfo: currentUpdateDates});

                //                    


            }else if( status == '5c017b0e47fb07027943a406' ){ //admin marks the item as shipped
                
                let data=await ItemShopping.update({id}, 
                    { 
                        shippingStatus:"shipped", 
                        status: '5c017b0e47fb07027943a406',
                        shippedAt: ts,
                        updateInfo: currentUpdateDates
                    }
                ).fetch();
                if(data.length > 0){
                	await MailerService.itemShipped(name,cart,store,item)
                    //await require("./../../mailer").sendEmailItemRoad(name,cart,store,item);
                }
            }else if( status == '5c017b1447fb07027943a407' ) {//admin marks the item as arrived
                let data=await ItemShopping.update({id}, { 
                    status: '5c017b1447fb07027943a407',
                    arrivedAt: ts,
                    updateInfo: currentUpdateDates
                }).fetch()
                if(data.length > 0){
                    //send email to buyer 
                    await MailerService.orderArrived(name,cart,store,item)
                    // await require("./../../mailer").sendEmailOrderArrived(name,cart,store,item);
                }
            }else if( status == '5c017b2147fb07027943a408' ){ //out for delivery
                await ItemShopping.update({id}, { status: '5c017b2147fb07027943a408', outForDeliveryAt: ts, updateInfo: currentUpdateDates })
            }else if( status == '5c017b3c47fb07027943a409' ){ //Delivered
                let data=await ItemShopping.update({id}, { status: '5c017b3c47fb07027943a409', deliveredAt: ts, updateInfo: currentUpdateDates}).fetch()

                //check if order is close
                let orderItems = await ItemShopping.find( { where: { shoppingCart: item.shoppingCart.id } } );
                console.log( 'status' )
                let isClose = true;
                orderItems.map( itemOrder => {
                    console.log( itemOrder.status );
                    if( itemOrder.status !== '5c017b3c47fb07027943a409' && itemOrder.status !== '5c017b7047fb07027943a40e'  ) {
                        isClose = false;
                    }
                } )
                // all items are delivered or refunded, so let's update the order status
                if( isClose ) {
                    await ShoppingCart.update( { id: item.shoppingCart.id }, {
                        orderStatus: '5c40b364970dc99bb06bed6a',
                        status: 'closed'
                    } )
                }

                if(data.length > 0){
                    //send email to buyer 
                    // await require("./../../mailer").sendEmailOrderDelivered(name,cart,store,item);
                    await MailerService.orderDeliveredBuyer(name,cart,store,item);
                    //send email to seller
                    await MailerService.orderArrivedSeller(cart,store,item);
                    // await require("./../../mailer").sendEmailOrderDeliveredSeller(cart,store,item);
                }
                

            }else if( status == '5c017b4547fb07027943a40a' ){ //Pending Repayment
                await ItemShopping.update({id}, { status: '5c017b4547fb07027943a40a', updateInfo: currentUpdateDates})
            }else if( status == '5c017b4f47fb07027943a40b' ){ //Seller Repaid
                let repayedRef = req.param("ref");
                await ItemShopping.update({id}, { status: '5c017b4f47fb07027943a40b', repayedAt: ts, repayedRef: repayedRef, updateInfo: currentUpdateDates})
            }else if( status == '5c017b5a47fb07027943a40c' ){ //Client Cancelled Order"
                let data=await ItemShopping.update({id}, { status: '5c017b5a47fb07027943a40c', cancelAt:ts}).fetch();
                if(data.length > 0){
                    //send email to buyer
                    await MailerService.buyerCancelledOrderBuyer(name,cart,store,item)
                    // await require("./../../mailer").sendEmailOrderStatus(name,cart,store,item);
                    //send email to seller
                    await MailerService.buyerCancelledOrderSeller(cart,store,item)
                    // await require("./../../mailer").sendEmailOrderStatusSeller(name,cart,store,item);
                    //send email to admin
                    await MailerService.buyerCancelledOrderAdmin(cart,store,item)
                    // await require("./../../mailer").sendEmailOrderStatusAdmin(name,cart,store,item);
                }
            }else if( status == '5c017b7047fb07027943a40e' ){ //Refunded
                await ItemShopping.update({id}, { status: '5c017b7047fb07027943a40e', updateInfo: currentUpdateDates})

                let orderItems = await ItemShopping.find( { where: { shoppingCart: item.shoppingCart.id } } );

                let isClose = true;
                console.log( 'status' );
                orderItems.map( itemOrder => {
                    console.log( itemOrder.status );
                    if( itemOrder.status !== '5c017b3c47fb07027943a409' && itemOrder.status !== '5c017b7047fb07027943a40e'  ) {
                        isClose = false;
                    }
                } )
                // all items are delivered or refunded, so let's update the order status
                if( isClose ) {
                    await ShoppingCart.update( { id: item.shoppingCart.id }, {
                        orderStatus: '5c40b364970dc99bb06bed6a',
                        status: 'closed'
                    } )
                }


            }else if( status == '5c06f4bf7650a503f4b731fd' ){ //Seller Cancelled Order
                let data=await ItemShopping.update({id}, { status: '5c06f4bf7650a503f4b731fd', cancelAt: ts, updateInfo: currentUpdateDates}).fetch();
                if(data.length > 0){
                    //send email to buyer
                    await MailerService.sellerCancelledOrderBuyer(name,cart,store,item);
                    // await require("./../../mailer").orderCancelledBySellerBuyerNotified(name,cart,store,item);
                    //send email to admin
                    await MailerService.sellerCancelledOrderAdmin(name,cart,store,item);
                    // await require("./../../mailer").orderCancelledBySellerAdminNotified(name,cart,store,item);
                }
            }else if ( status == '5c13f453d827ce28632af048'){//pending fulfillment
                let data=await ItemShopping.update({id}, { status: '5c13f453d827ce28632af048', cancelAt: ts, updateInfo: currentUpdateDates}).fetch();                
            }else{
                let data=await ItemShopping.update({id}, { status: status, updateInfo: currentUpdateDates}).fetch();                                
            }
            res.status(200).json( { "message": "status updated" } );




        } catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getItemsByStatus: async ( req, res ) => {
        try {                                    
            let status_id = req.param("status");
            let items = await ItemShopping.find({ status: status_id }).populate("fish").populate("shoppingCart").populate("status").sort('createdAt DESC');
            
            items = await Promise.all(items.map(async function(it){
                it.store = await Store.findOne({ id: it.fish.store});
                fishCountry = await Countries.findOne( { code: it.fish.country } );
                
                it.country = {
                    code: fishCountry.code,  
                    name: fishCountry.name
                }

                Promise.all(fishCountry.cities.map(async function(city){ 
                    if( city.code === it.fish.city ){
                        it.city = city;
                    }
                    return city;
                } ) );

                return it;
            }));

            

            res.status(200).json( items );
            
        } catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },
    getPayedItems: async ( req, res ) => {
        try {                                    
            //let status_id = req.param("status");
            let items = await ItemShopping.find(
                { 
                    where: {
                        status: '5c017b3c47fb07027943a409'
                    } 
                }
            ).populate("fish").populate("shoppingCart").populate("status").sort('createdAt DESC');
            
            items = await Promise.all(items.map(async function(it){
                it.store = await Store.findOne({ id: it.fish.store});
                if(it.fish.country){
                    fishCountry = await Countries.findOne( { code: it.fish.country } );
                    it.country = {
                        code: fishCountry.code,  
                        name: fishCountry.name
                    }

                    Promise.all(fishCountry.cities.map(async function(city){ 
                        if( city.code === it.fish.city ){
                            it.city = city;
                        }
                        return city;
                    } ) );    
                }
                

                return it;
            }));

            

            res.status(200).json( items );
            
        } catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },
    getCancelledItems: async ( req, res ) => {
        try {                                    
            //let status_id = req.param("status");
            let items = await ItemShopping.find(
                { 
                    where: {
                        status: ['5c017b5a47fb07027943a40c','5c06f4bf7650a503f4b731fd']
                    } 
                }
            ).populate("fish").populate("shoppingCart").populate("status").sort('createdAt DESC');
            
            items = await Promise.all(items.map(async function(it){
                it.store = await Store.findOne({ id: it.fish.store});
                if(it.fish.country){
                    fishCountry = await Countries.findOne( { code: it.fish.country } );
                    it.country = {
                        code: fishCountry.code,  
                        name: fishCountry.name
                    }

                    Promise.all(fishCountry.cities.map(async function(city){ 
                        if( city.code === it.fish.city ){
                            it.city = city;
                        }
                        return city;
                    } ) );    
                }
                

                return it;
            }));

            

            res.status(200).json( items );
            
        } catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },
    getPayedItemsByOrderNumber: async ( req, res ) => {
        let orderNumber=req.param('orderNumber')
        try {  
            let shoppingCart=await ShoppingCart.find({'orderNumber':orderNumber}); 
            let items=[];
            for(let sc of shoppingCart){
                items= await ItemShopping.find(
                { 
                    where: {
                        shoppingCart:sc.id,
                        status: [ '5c017af047fb07027943a405', '5c017b0e47fb07027943a406', '5c017b1447fb07027943a407', '5c017b2147fb07027943a408', '5c017b3c47fb07027943a409', '5c017b4547fb07027943a40a' ],

                    } 
                }
                ).populate("fish").populate("shoppingCart").populate("status").sort('createdAt DESC');
            }      
            await Promise.all(items.map(async function(it){
                it.store = await Store.findOne({ id: it.fish.store});
                if(it.fish.country){
                    fishCountry = await Countries.findOne( { code: it.fish.country } );
                    it.country = {
                        code: fishCountry.code,  
                        name: fishCountry.name
                    }

                    Promise.all(fishCountry.cities.map(async function(city){ 
                        if( city.code === it.fish.city ){
                            it.city = city;
                        }
                        return city;
                    } ) );    
                }
                return it;
            }));                        
            res.status(200).json( items );
            
        } catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },
    getBuyerCanceledDeliveredOrders: async ( req, res ) => {
        try {
            let where = {
                status: [ '5c06f4bf7650a503f4b731fd', '5c017b5a47fb07027943a40c', '5c017b3c47fb07027943a409' ]
            }
            let items = await ItemShopping.find( where ).populate( 'fish' ).populate( 'shoppingCart' ).populate( 'status' ).sort( 'createdAt DESC' ).limit( 1000 );

            await Promise.all(items.map(async function(it){
                it.store = await Store.findOne({ id: it.fish.store});               
                return it;
            }));      
            
           

            res.status(200).json( items );
        } catch (error) {
            console.error(error);
            res.serverError(error);
        }
    },
    getAllOrders: async (req, res) => {
        try {
            let where = { };
            if( req.param("status") ) {
                if( req.param("status") !==undefined ){
                    where.status = req.param('status')
                    console.log( 'by status' );
                }
            }else {
                let status = await OrderStatus.find();
                let statusIDs = [];
                status.map( record => {
                    statusIDs.push( record.id );
                } )
    
                where.status = statusIDs;
            }
            if( req.param("orderNumber" ) ) {
                let shoppingCart = await ShoppingCart.findOne( { orderNumber: req.param( 'orderNumber' ) } )
                if( !shoppingCart )
                    return res.status( 200 ).json( { "message": "Order not found" } );

                if( shoppingCart !== undefined ){                    
                    where.shoppingCart = shoppingCart.id;
                    console.log( 'by orderNumber' );
                }
            
            }
             // get items status available, this way we don't get items in the cart
             
             
            console.log( where );
            let items = await ItemShopping.find( where ).populate( 'fish' ).populate( 'shoppingCart' ).populate( 'status' ).sort( 'createdAt DESC' ).limit( 100 );

            await Promise.all(items.map(async function(it){
//		console.log( it.fish.store );
		if( it.hasOwnProperty( 'fish' ) && it.fish !== undefined && it.fish !== null ){
		  if( it.fish.hasOwnProperty('store') && it.fish.store !== null && it.fish.store !== undefined ){
                	it.store = await Store.findOne({ id: it.fish.store});
		  }
		}
                return it;
            }));      
            
           

            res.status(200).json( items );
        } catch (error) {
            console.error(error);
            res.serverError(error);
        }
    },
    getBuyerOrders: async (req, res) => {
        try {
            let buyer = req.param("buyer");
            let where = { };

            // check if we had to filter by status
            if( req.param("status") ) {
                if( req.param("status") !==undefined ){
                    where.status = req.param('status')
                    console.log( 'by status' );
                }
            }else{
                // get items status available, this way we don't get items in the cart
                let status = await OrderStatus.find();
                let statusIDs = [];
                status.map( record => {
                    statusIDs.push( record.id );
                } )
                where.status = statusIDs;
            }

            // check if we had to filter by order number
            if( req.param("orderNumber" ) ) {
                let shoppingCart = await ShoppingCart.findOne( { buyer: buyer, orderNumber: req.param( 'orderNumber' ) } )
                if( !shoppingCart )
                    return res.status( 200 ).json( { "message": "Order not found" } );

                if( shoppingCart !== undefined ){
                    where.shoppingCart = shoppingCart.id;
                    console.log( 'by orderNumber' );
                }
            }else { // just getting buyer orders
                let shoppingCart = await ShoppingCart.find( { buyer: buyer } )
                if( !shoppingCart )
                    return res.status( 200 ).json( { "message": "Order not found" } );

                if( shoppingCart !== undefined ){
                    let shoppingCartIDs = [];
                    shoppingCart.map( cart => {
                        shoppingCartIDs.push( cart.id );
                    } )
                    where.shoppingCart = shoppingCartIDs;
                    console.log( 'by orderNumber' );
                }                
            }
            

            
            console.log('where', where);
            let items = await ItemShopping.find( where ).populate( 'fish' ).populate( 'shoppingCart' ).populate( 'status' ).sort( 'createdAt DESC' ).limit( 100 );

            await Promise.all(items.map(async function(it){
                it.store = await Store.findOne({ id: it.fish.store});               
                return it;
            }));      
            
           

            res.status(200).json( items );
        } catch (error) {
            console.error(error);
            res.serverError(error);
        }
    },
    updateBuyerETA: async( req, res ) => {
        try {
            let etas = req.body.etas;
            items = await Promise.all(etas.map(async function(eta){
                await ItemShopping.update( { id: eta.id }, { buyerExpectedDeliveryDate: buyerExpectedDeliveryDate } );
            } ) );

            res.status(200).json(etas);

        } catch (error) {
            res.status(400).json( error );
        }
    }
};

