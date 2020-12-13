const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

exports.chatbot = async (request, response) => {
    const chatQuestion = request.body.question;

    const model = await tf.loadLayersModel('file://./AI_Models/chatbot/model.json')
        .catch((error) => {
            console.log(`Error - Model Loading - ${error}`);
            return response.status(503).json({message: `${error}`});
        });

    let prediction;
    //model.

    try {
        prediction = model.predict(tf.tensor([
            chatQuestion
        ],
            [1,1]
        )
        )
    } catch (error){
        console.log(`Error - Prediction failure - ${error}`);
        return response.status(500).json({message: `${error}`});
    }

    let buffer = await prediction.data();
    //    console.log(buffer[0]);
    const result = buffer[0];
    return response.status(201).json({result});
}