const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

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

    //const model = await tf.loadLayersModel('../../model/model.json')
    //const model = await tf.loadLayersModel('https://firebasestorage.googleapis.com/v0/b/finaiapp.appspot.com/o/models%2Fmodel.json?alt=media')
    //const model = await tf.loadGraphModel('https://firebasestorage.googleapis.com/v0/b/finaiapp.appspot.com/o/models%2Fmodel.json?alt=media')
    const model = await tf.loadLayersModel('file://./model/model.json')
    .catch((error) => {
        console.log(`Error - Model Loading - ${error}`);
        return response.status(503).json({message: `${error}`});
    });

    const prediction = model.predict(tf.tensor([
        parseInt(houseQuery.sale_yr, 10),
        parseInt(houseQuery.sale_month,10),
        parseInt(houseQuery.sale_day,10),
        parseInt(houseQuery.bedrooms,10),
        parseFloat(houseQuery.bathrooms),
        parseInt(houseQuery.sqft_living,10),
        parseInt(houseQuery.sqft_lot,10),
        parseInt(houseQuery.floors,10),
        parseInt(houseQuery.waterfront,10),
        parseInt(houseQuery.view,10),
        parseInt(houseQuery.condition,10),
        parseInt(houseQuery.grade,10),
        parseInt(houseQuery.sqft_above,10),
        parseInt(houseQuery.sqft_basement,10),
        parseInt(houseQuery.yr_built,10),
        parseInt(houseQuery.yr_renovated,10),
        parseInt(houseQuery.zipcode,10),
        parseFloat(houseQuery.lat),
        parseFloat(houseQuery.long),
        parseInt(houseQuery.sqft_living15,10),
        parseInt(houseQuery.sqft_lot15,10)
    ], [1,21]));

    let buffer = await prediction.data();
//    console.log(buffer[0]);
    const result = buffer[0];
    return response.status(201).json({result});
}



