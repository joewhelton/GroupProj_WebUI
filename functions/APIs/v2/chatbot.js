const tf = require('@tensorflow/tfjs');

const words = ["'s", ',', 'a', 'all', 'anyone', 'are', 'available', 'awesome', 'be', 'bye', 'can', 'chatting', 'check', 'contact', 'could', 'day', 'do', 'for', 'give', 'good', 'goodbye', 'hello', 'help', 'helpful', 'helping', 'hey', 'hi', 'hola', 'how', 'i', 'is', 'later', 'list', 'loan', 'long', 'me', 'mortgage', 'next', 'nice', 'no', 'number', 'of', 'offered', 'phone', 'provide', 'see', 'short', 'sign', 'someone', 'speak', 'suitable', 'support', 'term', 'thank', 'thanks', 'that', 'there', 'till', 'time', 'to', 'up', 'want', 'what', 'where', 'which', 'who', 'you'];
const classes = ['Loan_type', 'goodbye', 'greeting', 'loan', 'options', 'thanks', 'type', 'who'];

exports.chatbot = async (request, response) => {

    const chatQuestion = request.body.question;

    let ints = await predictClass(chatQuestion);
    let res = getResponse(ints);

    //const result = buffer[0];
    return response.status(201).json({res});
}

const predictClass = async (chatQuestion) => {
    const errorThreshold = 0.25;
    let p = bow(chatQuestion, words);
    const model = await tf.loadLayersModel('file://./AI_Models/chatbot/model.json')
        .catch((error) => {
            console.log(`Error - Model Loading - ${error}`);
            return response.status(503).json({message: `${error}`});
        });

    let prediction;

    try {
        prediction = model.predict(tf.tensor([p], [1,words.length]));
    } catch (error){
        console.log(`Error - Prediction failure - ${error}`);
        return response.status(500).json({message: `${error}`});
    }

    let buffer = await prediction.data();
    let results = [];
    buffer.forEach((res, index) => {
        if(res > errorThreshold){
            results.push([index, res])
        }
    });

    results.sort((a, b) => b[1] - a[1]);
    let resultSet = results.map(el => ({'intent': el[0], 'probability': el[1]}));

    return resultSet;
}

const cleanUpSentence = (sentence) => {
    const natural = require('natural');

    natural.PorterStemmer.attach();
    let nData = sentence.tokenizeAndStem();

    return nData;
}

const bow = (sentence, words) => {
    let sentenceWords = cleanUpSentence(sentence);
    let bag = Array(words.length).fill(0);
    sentenceWords.forEach((sw) => {
        words.forEach((w, index) => {
            if(sw.toLowerCase() === w.toLowerCase()){
                bag[index] = 1;
            }
        })
    })

    return bag;
}

const getResponse = (ints) => {
    let result;
    let tag = classes[ints[0]['intent']];
    const fs = require('fs');
    let rawData = fs.readFileSync('./AI_Models/chatbot/intents.json');
    let intents_json = JSON.parse(rawData);
    let list_of_intents = intents_json['intents'];
    list_of_intents.forEach((i) => {
        if(i['tag'] === tag){
            result = randomChoice(i['responses'])
        }
    })

    return result;
}

const randomChoice = (array) => {
    let index = Math.floor(Math.random() * array.length);
    return array[index];
}