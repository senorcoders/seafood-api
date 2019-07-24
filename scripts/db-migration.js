catchErrors = callback => {

  return async function (req, res) {
      try {
          await callback(req, res);
      }
      catch (e) {
          sails.log("error", e);
          console.error(e);
          res.serverError();
      }
  }

};
Object.defineProperty(Object.prototype, 'typeObject', {
  value: function() {
      return Object.prototype.toString.call(this).split(" ")[1].replace("]", "").toLowerCase();
  },
  enumerable: false
});

Object.defineProperty(Object.prototype, 'isDefined', {
  value: function(attribute) {
      return this[attribute] !== null && this[attribute] !== undefined;
  },
  enumerable: false
});

module.exports = {

  friendlyName: 'Db migration',


  description: 'here we check if the database has the records needed for start working',


  fn: async function () {

    sails.log('Running custom shell script... (`sails run db-migration`)');

    //adding basic unit of measure
    let unitOfMeasureFound = await UnitOfMeasure.find();

    if( unitOfMeasureFound.length == 0 ) {
      UnitOfMeasure.create({
        name: "KG",
        kgConversionRate: 1,
        isActive: true
      })
    }
    await Promise.all( unitOfMeasureFound.map( async unit => {
      
      if(unit.kgConversionRate == undefined || unit.kgConversionRate == null || !unit.hasOwnProperty('kgConversionRate') ) {
        if( unit.name === "LBS" ) {
          unit['kgConversionRate'] = 0.4535;
        } else {
          unit['kgConversionRate'] = 1;
        }
        await UnitOfMeasure.update({ id: unit.id }, { kgConversionRate: unit.kgConversionRate });
      } 
    } ) )

    //add parent category for fillete fishpreparation
    
    //fillete and package
    let fillete = await FishPreparation.findOne( { id: '5c93c01465e25a011eefbcc4', parent: '0' } );
    let package = await FishPreparation.findOne( { id: '5d1cc9cd29dc5790fa2537f3', parent: '0' } );

    if( fillete ){
      // creating the parent for the current fillete
      let parentFillete = await FishPreparation.create( {
        "name" : "Filleted",
        "isTrimming" : false,
        "defaultProccessingParts" : null,
        "parent" : "0",
        "identifier" : "filleted_parent",
        "isActive" : true
      } ).fetch();
      // update fillete with the parent what we just create
      await FishPreparation.update( { id: fillete.id } ).set( { parent: parentFillete.id } );
      await FishPreparation.update( { parent: fillete.id } ).set( { parent: parentFillete.id } );

    }

    if( package ) {
      let parentPackage = await FishPreparation.create( {
        "name" : "Package",
        "isTrimming" : false,
        "defaultProccessingParts" : null,
        "parent" : "0",
        "identifier" : "package_parent",
        "isActive" : true
      } ).fetch();
      // update fillete with the parent what we just create
      await FishPreparation.update( { id: package.id } ).set( { parent: parentPackage.id } );
      await FishPreparation.update( { parent: package.id } ).set( { parent: parentPackage.id } );
    }

    let fishes = await Fish.find().populate('type');

    await Promise.all( fishes.map( async fish => {
      let categorySetup = {
        unitOfMeasure: fish.type.unitOfSale !== undefined ? fish.type.unitOfMeasure :  '',
        raised: fish.type.raised !== undefined ? fish.type.raised : [],
        treatment: fish.type.treatment !== undefined ? fish.type.treatment : [],
        fishPreparation: fish.type.fishPreparation !== undefined ? fish.type.fishPreparation : {}
      }

      // let's check the unit of measure
      if( categorySetup.unitOfMeasure === '' ) { // if not founded, let's use the one in the fish
        if( fish.unitOfSale == undefined || fish.unitOfSale == null || !fish.hasOwnProperty('unitOfSale') || fish.unitOfSale == '' )  {
          await Fish.update( { id: fish.id } ).set( { unitOfSale: 'KG' } )
          fish['unitOfSale'] = 'KG';
        }
        //console.log( fish.unitOfSale );
        let unitOfMeasureFound = await UnitOfMeasure.find( { name: fish.unitOfSale } ).limit(1);
        categorySetup.unitOfMeasure = unitOfMeasureFound[0].name;
      }

      // check if raised is there
      if( !categorySetup.raised.includes( fish.raised ) ) {       
        categorySetup.raised.push( fish.raised );
      }

      // check if treatment is there
      if( !categorySetup.treatment.includes( fish.treatment ) ) {
        categorySetup.treatment.push( fish.treatment );
      }

      // check if fishPreparation is there
      // first let's look for the variations of this fish

      let variations = await Variations.find( { fish: fish.id } ).populate('fishPreparation')
      await Promise.all( variations.map( async variation => {
        let isParentFishPreparationAlreadyInSetup = false;
        let isFishPreparationAlreadyInSetup = false;
        // let iterate each fishPreparation in the setup                
        Object.keys( categorySetup.fishPreparation ).forEach(function(key) {
          if( key == variation.fishPreparation.parent ) {
            isParentFishPreparationAlreadyInSetup = true;

            // let's see if the child preparation is in the setup
            if( !categorySetup.fishPreparation[key].includes( variation.fishPreparation.id ) ) {
              categorySetup.fishPreparation[key].push( variation.fishPreparation.id );
            }
          }
          //console.table('Key : ' + key + ', Value : ' + data[key])
        })

        // if the parentCategory is no there, let's added with the child preparation too
        if( !isParentFishPreparationAlreadyInSetup ) {
          categorySetup.fishPreparation[ variation.fishPreparation.parent ] = [ variation.fishPreparation.id ]
        }

        // now let's look for the variations (wholefishweight)
        let variationExists = await FishVariations.findOne( { fishType: fish.type.id, fishPreparation: variation.fishPreparation.id } )

        // if variation not exists, let's create it
        if( !variationExists ) {
          //await FishVariations.create( { fishType: fish.type.id, fishPreparation: variation.fishPreparation.id, variations: [ variation.wholeFishWeight ] } )
        } else {
          // the fish has variations, but let's check if it have the current one
          if( !variationExists.variations.includes( variation.wholeFishWeight ) ) {
            variationExists.variations.push( variation.wholeFishWeight );
          }
        }

      } ) )
      console.log('--------------------------------------------------------------------------');
      console.log( 'beforeSetup', categorySetup );
    } ) );



  }


};

