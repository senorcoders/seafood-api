
module.exports = {

    getXNamePagination: async function (req, res) {
        try {

            let fisher = await FishType.findOne({ name: req.params.name });
            if (fisher === undefined) {
                return res.json({ fish: [], pagesNumber: 0 });
            }
            let page = req.params.page;
            --page; //Para que empieze desde 1
            let fishers = await Fish.find({ type: fisher.id }).populate('type').populate("store").paginate({ page, limit: req.params.limit });

            //Para calcular la cantidad de paginas
            let arr = await Fish.find({ type: fisher.id }),
                page_size = Number(req.params.limit), pages = 0;
            console.log(arr.length, Number(arr.length / page_size));
            if (parseInt(arr.length / page_size, 10) < Number(arr.length / page_size)) {
                pages = parseInt(arr.length / page_size, 10) + 1;
            } else {
                pages = parseInt(arr.length / page_size, 10)
            }

            fishers = await Promise.all(fishers.map(async function (m) {
                if (m.store === null)
                    return m;

                m.store.owner = await User.findOne({ id: m.store.owner });

                return m;
            }));

            res.json({ fish: fishers, pagesNumber: pages });
        }
        catch (e) {
            res.serverError(e);
        }
    },
    getParentTypes :  async ( req, res ) => {
        try {            
            let childs = await ParentType.find()
            .then(function ( result ) {
                return result.map( value => {
                    return value.child;
                } )
            })
            .catch(function (error) {
                console.log(error);
                return res.serverError(error);
            })

            let cats = await FishType.find({
                where: { id: { '!': childs } },
                sort: 'name ASC'
            })


             res.status(200).json( cats );
        } catch (error) {
            console.log(error);
            res.serverError(error);
        }
    },
    getParentChildTypes: async ( req, res ) => {
        try {            
            let parent_id = req.param('parent_id');
            
            let childs = await ParentType.find({
                where: { parent: parent_id }
            })
            .then(function ( result ) {
                return result.map( value => {
                    return value.child;
                } )
            })
            .catch(function (error) {
                console.log(error);
                return res.serverError(error);
            })
            

            let cats = await FishType.find({
                where: { id: childs  },
                sort: 'name ASC'
            })


             res.status(200).json( cats );
        } catch (error) {
            console.log(error);
            res.serverError(error);
        }
    },
    getChildTypes: async ( req, res ) => {
        try {                        
            let childs = await ParentType.find()
            .then(function ( result ) {
                return result.map( value => {
                    return value.child;
                } )
            })
            .catch(function (error) {
                console.log(error);
                return res.serverError(error);
            })
            

            let cats = await FishType.find({
                where: { id: childs  },
                sort: 'name ASC'
            })


             res.status(200).json( cats );
        } catch (error) {
            console.log(error);
            res.serverError(error);
        }
    },
    getTypeByLevel: async ( req, res ) => {
        try {
            let level = req.param( 'level' );
            let types = await FishType.find( { level } );

            res.status( 200 ).json( { types } );
        } catch (error) {
            res.status( 400 ).json( { error } );   
        }
    },
    getTypeLevel: async ( req, res ) => {
        try {
            let level0 = await FishType.find( { level: 0 } );
            let level1 = await FishType.find( { level: 1 } );
            let level2 = await FishType.find( { level: 2 } );
            let level3 = await FishType.find( { level: 3 } );

            res.status( 200 ).json( {
                level0, level1, level2, level3
            } )
        } catch (error) {
            res.status( 400 ).json( { error } );   
        }
    },
    getFishTypeTree: async (req, res) => {
        try {           
           let types = await sails.helpers.fishTypeTree();
            res.status( 200 ).json( types );
        } catch (error) {
            res.serverError();
        }
    },
    getAllParentsLevel: async ( req, res ) => {
        try {
            
            let types = await FishType.find( { level: [ 0, 1, 2 ] } );

            res.status( 200 ).json( types );
        } catch (error) {
            res.status( 400 ).json( { error } );
        }
    },
    getParentsWithFishes:async ( req, res )=> {
        try {
            let level0 = await FishType.find( { level: 0, totalFishes: { '>': 0 } } );

            res.status(200).json( level0 )
        } catch (error) {
            res.serverError( error );
        }
    },
    ori_getAllChildsByLevel: async ( req, res ) => {
        try {
            let parent_id = req.param( 'parent_id' );
            let parent = await FishType.findOne( { id: parent_id } );

            parentsIDS = [];
            parentsIDS.push( parent_id );
            childs = [];
            for (let index = parent.level + 1; index <= 4; index++) {                
                console.log( parentsIDS );
                directChilds = await FishType.find( { parent: parentsIDS } );
                childs.push( { level: index, fishTypes: directChilds } );
                parentsIDS = [];
                directChilds.map( child => {
                    parentsIDS.push( child.id );
                } )
            }            

            res.status( 200 ).json( { childs } );
        } catch (error) {
            res.serverError( error );   
        }
    },
    getAllChildsByLevel: async ( req, res ) => {
        try {
            let parent_id = req.param( 'parent_id' );
            let parent = await FishType.findOne( { id: parent_id, totalFishes: { '>': 0 } } );

            parentsIDS = [];
            parentsIDS.push( parent_id );
            childs = [];
            for (let index = parent.level + 1; index <= 4; index++) {                
                console.log( parentsIDS );
                directChilds = await FishType.find( { parent: parentsIDS, totalFishes: { '>': 0 } } );
                childs.push( { level: index, fishTypes: directChilds } );
                parentsIDS = [];
                directChilds.map( child => {
                    parentsIDS.push( child.id );
                } )
            }            

            res.status( 200 ).json( { childs } );
        } catch (error) {
            res.serverError( error );   
        }
    },   
    getParentLevel: async ( req, res ) => {
        try {
            let fishID = req.param( 'fishID' );

            console.log( fishID );
            
            let fish = await Fish.findOne( { id: fishID } ).populate('type').populate('descriptor');

            console.log( fish );
            let level2 = fish.type;
            
            let descriptor = fish.descriptor;
            

            let level1 = await FishType.findOne( { id: level2.parent } );

            let level0 = await FishType.findOne( { id: level1.parent } );

            res.status( 200 ).json( { level0, level1, level2, descriptor } );
            

        } catch (error) {
            res.status( 400 ).json( error );
        }
    },
    updateTypeCount: async (req, res) => {
        try {
            await sails.helpers.updateCategoryCount();
            let utypes = await FishType.find();
            res.status(200).json( utypes );
        } catch (error) {
            res.serverError(error);
        }
    },
    delete: async( req, res ) => {
        try {
            let id = req.param( 'id' );
            // check if had childs
            let childs = await FishType.find( { "parent": id } );

            if ( childs.length > 0 ) {
                /// we can't delete the type because had child categories
                res.status(400).json( { message: "Is not possible delete the item. first remove the child items" } );
            } else {
                // lets validate if the type had fishes
                let fishes = await Fish.find( { type: id } );

                if( fishes.length > 0 ) {
                    res.status(400).json( { message: "Is not possible delete the item. there is fishes under this category" } );
                } else {
                // no childs so let's deleted                    
                    let deleteFish = await FishType.destroy( { id } ).fetch();
                    res.status(200).json( deleteFish );
                }
            }

        } catch (error) {
            res.serverError( error );
        }
    },
    saveCategorySetup: async (req, res) => {
        try {
            let category_id = req.param('category_id');
            let body = req.body;
            let fishPreparationTree = {};

            body.fishPreparationChilds.map( row => {
                fishPreparationTree[ row.fishParent ] = row.fishPreparationChild;
            })

            // updating fishtype with preparation, raised and treatment
            let updateTypeJSON = {
                fishPreparation: fishPreparationTree,
                raised: body.raised,
                treatment: body.treatment
            }

            // updating variations related to this fishPreparation
            // first delete existing vartiations for this fishtype
            await FishVariations.destroy( { fishType: category_id } )

            await Promise.all( body.fishVariations.map ( async row => {
                if( row.variations !== "" || row.variations.length !== 0 ) {                    
                    let createVariations = {
                        variations: row.variations,
                        fishType: row.type,
                        fishPreparation: row.preparation
                    }
    
                    await FishVariations.create( createVariations )
                }
                
            } ) )

            let updatedCategory = await FishType.update({ id: category_id }, updateTypeJSON).fetch();

            res.json( updatedCategory );
        } catch (error) {
            res.serverError(error)
        }
    },
    getCategoryInfo: async ( req, res ) => {
        try {
            let category_id = req.param( 'category_id' );

            let categories = await FishType.findOne().where( { id: category_id } );
             
            if ( categories.hasOwnProperty('fishPreparation') ) {
                let fishPreparationInfo = [];
                let fishVariations = [];
                await Promise.all( Object.keys( categories.fishPreparation ).map( async ( category, index ) => {
                    let preparation = await FishPreparation.findOne().where( { id: category } );

                    //let's check all child preparation
                    await Promise.all( categories.fishPreparation[category].map ( async child => {
                        //let preparation = await FishPreparation.findOne().where( { id: child } );
                        // now let's check if this child prepraration have Variations
                        if( child !== null ) {
                            let variations = await sails.helpers.fishVariationByPreparation.with({
                                type: category_id,
                                preparation: child
                            });
                            if ( variations !== null )
                                fishVariations.push( variations );
                        }
                    } ) ) 

                    fishPreparationInfo.push( preparation );
                } ));
                categories['fishPreparationInfo'] = fishPreparationInfo;
                categories['variations'] = fishVariations;
            }

            if( categories.hasOwnProperty( 'raised' ) ) {
                let fishRaisedInfo = [];
                await Promise.all( categories.raised.map( async item => {
                    fishRaisedInfo.push( await Raised.findOne().where({ id: item }) );
                } ) )
                categories['raisedInfo'] = fishRaisedInfo;
            }

            if( categories.hasOwnProperty('treatment') ) {
                let treatmentInfo = [];
                await Promise.all( categories.treatment.map( async item => {
                    treatmentInfo.push( await Treatment.findOne().where( { id: item } ) )
                } ) )
                categories['treatmentInfo'] = treatmentInfo;
            }


            res.json( categories );
            
        } catch (error) {
            res.serverError( error );
        }
    },

    getChildPreparationForCategory: async ( req, res ) => {
        try {
            let fishTypeID = req.param('id');
            let fishPreparationID = req.param('preprarationID')

            let categories = await FishType.findOne().where( { id: fishTypeID } );
             
            let fishPreparationInfo = [];
            if ( categories.hasOwnProperty('fishPreparation') ) {
                await Promise.all( Object.keys( categories.fishPreparation ).map( async ( category, index ) => {
                    console.info( 'info', { category, fishPreparationID } )
                    if( category == fishPreparationID ) { //is this fish preparation the one we are looking for
                        //let's check all child preparation
                        await Promise.all( categories.fishPreparation[category].map ( async child => {
                            let preparation = await FishPreparation.findOne().where( { id: child } );
                            // now let's check if this child prepraration have Variations
                            let variations = await sails.helpers.fishVariationByPreparation.with({
                                type: fishTypeID,
                                preparation: child
                            });
                            preparation['variations'] = variations;
                            fishPreparationInfo.push( preparation );
                        } ) ) 
                    
                    }
                } ));
                categories['fishPreparationInfo'] = fishPreparationInfo;
            }
            res.json(fishPreparationInfo)
        } catch (error) {
            res.serverError(error)
        }
    }
};

