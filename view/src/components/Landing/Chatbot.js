import React, {useContext, useEffect, useState} from 'react';

import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const Chatbot = (props) => {
    require('../../styles/chatbot.css');
    const [chatTranscript, setChatTranscript] = useState('Hi, how can I help you?');
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [answerLoading, setAnswerLoading] = useState(false);

    const onQuestionChange = (e) => {
        setCurrentQuestion(e.target.value);
    }

    const toggleExpand = () => {
        setExpanded(!expanded);
    }

    const submitQuestion = () => {
        setAnswerLoading(true);
        let q = currentQuestion;
        let currentChat = chatTranscript + '\n\n' + q;
        setChatTranscript(currentChat);

        axios
            .post(apiUrl + 'chatbot', {question: q})
            .then((data) => {
                console.log(data.data.res);
                setChatTranscript(chatTranscript + '\n\n' + q + '\n\n' + data.data.res);
                let ta = document.getElementById('chatbotTextarea');
                ta.scrollTop = ta.scrollHeight;
            })
            .catch((error) => {
                setChatTranscript(chatTranscript + '\n\nError Loading Chatbot Response');
            })
            .finally(() => {
                setAnswerLoading(false);
                setCurrentQuestion('');
            });
    }

    return(
            <div className='chatbotFrame'>
                <div className='chatbotHeader'
                     onClick={toggleExpand}
                     >Chat to us!</div>
                <div className='chatbotBody'
                    style={{display: expanded ? 'flex' : 'none'}}>
                    <textarea
                        id='chatbotTextarea'
                        className='chatbotChat'
                        value={chatTranscript}/>
                    <div className='inputHolder'>
                        <input
                            name="question"
                            value={currentQuestion}
                            onChange={onQuestionChange}
                            disabled={answerLoading}
                        />
                        <button
                            onClick={submitQuestion}
                        >Go</button>
                    </div>
                </div>
            </div>
    )

}

export default Chatbot;