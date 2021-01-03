const { rdb } = require('../../util/admin');

const tf = require('@tensorflow/tfjs');

const { validateHousePriceQuery } = require('../../util/validators');

exports.predict = async (request, response) => {
    const houseQuery = {
        sale_yr: request.body.sale_yr,
        sale_month: request.body.sale_month,
        sale_day: request.body.sale_day,
        bedrooms: request.body.bedrooms,
        bathrooms: request.body.bathrooms,
        sqft_living: request.body.sqft_living,
        sqft_lot: request.body.sqft_lot,
        floors: request.body.floors,
        waterfront: request.body.waterfront,
        view: request.body.view,
        condition: request.body.condition,
        grade: request.body.grade,
        sqft_above: request.body.sqft_above,
        sqft_basement: request.body.sqft_basement,
        yr_built: request.body.yr_built,
        yr_renovated: request.body.yr_renovated,
        zipcode: request.body.zipcode,
        lat: request.body.lat,
        long: request.body.long,
        sqft_living15: request.body.sqft_living15,
        sqft_lot15: request.body.sqft_lot15,
    }

    if(!houseQuery.yr_renovated){
        houseQuery.yr_renovated = 0;
    }

    if(request.body.userID){
        houseQuery.userID = request.body.userID
    }

    const { valid, errors } = validateHousePriceQuery(houseQuery);
    if (!valid) return response.status(400).json(errors);

    const model = await tf.loadLayersModel('file://./AI_Models/House_Price/model.json')
        .catch((error) => {
            console.log(`Error - Model Loading - ${error}`);
            return response.status(503).json({message: `${error}`});
        });

    let prediction;
    try {
        prediction = model.predict(tf.tensor([
            parseInt(houseQuery.sale_yr, 10),
            parseInt(houseQuery.sale_month, 10),
            parseInt(houseQuery.sale_day, 10),
            parseInt(houseQuery.bedrooms, 10),
            parseFloat(houseQuery.bathrooms),
            parseInt(houseQuery.sqft_living, 10),
            parseInt(houseQuery.sqft_lot, 10),
            parseInt(houseQuery.floors, 10),
            parseInt(houseQuery.waterfront, 10),
            parseInt(houseQuery.view, 10),
            parseInt(houseQuery.condition, 10),
            parseInt(houseQuery.grade, 10),
            parseInt(houseQuery.sqft_above, 10),
            parseInt(houseQuery.sqft_basement, 10),
            parseInt(houseQuery.yr_built, 10),
            parseInt(houseQuery.yr_renovated, 10),
            parseInt(houseQuery.zipcode, 10),
            parseFloat(houseQuery.lat),
            parseFloat(houseQuery.long),
            parseInt(houseQuery.sqft_living15, 10),
            parseInt(houseQuery.sqft_lot15, 10)
        ], [1, 21]));
    } catch (error){
        console.log(`Error - Prediction failure - ${error}`);
        return response.status(500).json({message: `${error}`});
    }

    let buffer = await prediction.data();
//    console.log(buffer[0]);
    const result = buffer[0];

    if(request.body.userID){
        houseQuery.predictedPrice = result;
        houseQuery.createdDate = new Date().toISOString();
        const hpRef = rdb.ref('/houseData');
        const newHpRef = hpRef.push();
        await newHpRef.set(houseQuery);
    }

    return response.status(201).json({result});
}

exports.upload = async (request, response) => {
    console.log("Uploading");
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    const busboy = new BusBoy({ headers: request.headers });

    let modelToBeUploaded = {};
    let weightsToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log("Busboy On")
        if (fieldname === 'modelFile'){
            if( mimetype !== 'application/json') {
                return response.status(400).json({ error: 'Model file is not in JSON format' });
            }
            const filePath = path.join(os.tmpdir(), filename);
            modelToBeUploaded = { filePath, mimetype };
            file.pipe(fs.createWriteStream(filePath));
        } else if (fieldname === 'weightsFile'){
            if( mimetype !== 'application/octet-stream') {
                return response.status(400).json({ error: 'Weights file is not in .bin format' });
            }
            const filePath = path.join(os.tmpdir(), filename);
            weightsToBeUploaded = { filePath, mimetype, filename };
            file.pipe(fs.createWriteStream(filePath));
        }
    });

    busboy.on('finish', async () => {
        if(!modelToBeUploaded.filePath || !weightsToBeUploaded.filePath){
            return response.status(400).json({ error: 'Both files must be uploaded' });
        }
        const directory = './AI_Models/House_Price';
        //Remove existing files
        await fs.readdir(directory,{}, (err, files) => {
            if (err) throw err;
            files.forEach((file) => {
                fs.unlinkSync(`${directory}/${file}`);
            })
        });
        console.log(modelToBeUploaded.filePath);
        await fs.rename(modelToBeUploaded.filePath, `${directory}/model.json`, (err) => {
            if (err) throw err;
        });
        await fs.rename(weightsToBeUploaded.filePath, `${directory}/${weightsToBeUploaded.filename}`, (err) => {
            if (err) throw err;
        });
        return response.json({ message: 'Uploaded successfully' });
    });

    busboy.end(request.rawBody);
}

exports.exportCSV = (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }

    const hpRef = rdb.ref('/houseData');
    hpRef.once("value")
        .then( (data) => {
            const fiData = data.val();
            let array = [];
            Object.keys(fiData).forEach((key) => {
                array.push(fiData[key]);
            })
            const json2csv = require("json2csv").parse;
            const csv = json2csv(array);
            response.setHeader(
                "Content-disposition",
                "attachment; filename=housePriceQueries.csv"
            )
            response.set("Content-Type", "text/csv");
            return response.status(201).send(csv);
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({ error });
        });
}


