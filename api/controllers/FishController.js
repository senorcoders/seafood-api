const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const writeImage = async function(nameFile, directory, image){
    return new Promise(function(resolve, reject){
  
        fs.writeFile(path.join(directory, nameFile+'.jpg'), image, function(err) {
            
            if(err){
                return reject(err);
            }
  
            resolve({ message : "success" });
            
        });
  
    });
  }
  
  const saveimage = async function(nameFile, directory, image, size){

    return new Promise(function(resolve, reject){

        sharp(image).resize(size.width, size.height)
        .crop(sharp.strategy.entropy)
        .toBuffer(async function(err, data, info){
            if( err ){ return reject(err); }

            try{
                let write = await writeImage(nameFile, directory, data);
                resolve(directory, data, info, true);
            }
            catch(e){
                reject(e);
            }

        });

    });
}
  

module.exports = {
  
    imagesUpload: async function(req, res){
    
    let base64 = req.body.image.replace(/^data:image\/jpeg;base64,/, '');
    base64 = base64.replace(/^data:image\/png;base64,/, '');
    let image = new Buffer(base64, 'base64');

    let directory = [];

    directory.push( path.resolve(__dirname, '../../assets/images/'+ req.body.model) );
    directory.push( path.resolve(__dirname, '../../assets/images/'+ req.body.model+ '/'+ req.body.id) );
    
    let nameFile = req.body.id;

    //create directory if not exists
    if (!fs.existsSync(directory[0]) ){
      fs.mkdirSync(directory[0]);
    }
            
    if( !fs.existsSync(directory[1]) ){
      fs.mkdirSync(directory[1]);
    }

    //Para imagenes de 250 x 200
    let m250x200 = await saveimage(nameFile+ '300x200', directory[1], image, { width: 300, height: 200 });
  
    //Para imagenes de 350 x 300
    let m450x350 = await saveimage(nameFile+ '400x300', directory[1], image, { width: 400, height: 300 });

    //Para imagenes de 450 x 350
    let m700x600 = await saveimage(nameFile+ '700x600', directory[1], image, { width: 700, height: 600 });
        

    //para original
    let original = await writeImage(nameFile, directory[1], image);

    res.json([m250x200, m450x350, m700x600, original]);

    }

};

