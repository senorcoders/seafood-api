
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


  friendlyName: 'Basic info migration',


  description: '',


  fn: async function () {

    sails.log('Running custom shell script... (`sails run basic-info-migration`)');


    // let set all basic info as active
    await Raised.update({}).set({ isActive: true });
    await Treatment.update({}).set({ isActive: true });
    await FishPrepraration.update({}).set({ isActive: true });
    await UnitOfMeasure.update({}).set({ isActive: true });

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
        if( unit.name === "LBS" ) 
          unit['kgConversionRate'] = 0.4535;
        else if ( unit.name === 'grams' )
          unit['kgConversionRate'] = 0.001;
        else 
          unit['kgConversionRate'] = 1;
        
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

  }


};

