import React, {useEffect, useRef, useState} from 'react';
import {format} from 'date-fns';
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

function ChatMessage(type, msg){
    this.type = type;
    this.msg = msg;
    this.dateTime = new Date();
}

const Chatbot = (props) => {
    require('../../styles/chatbot.css');
    const [chatLog, setChatLog] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [answerLoading, setAnswerLoading] = useState(false);

    const textInput = useRef(null);

    const onQuestionChange = (e) => {
        setCurrentQuestion(e.target.value);
    }

    const toggleExpand = () => {
        setExpanded(!expanded);
        textInput.current.focus();
    }

    useEffect(() => {
        if(chatLog[chatLog.length-1] && chatLog[chatLog.length-1].type === 'Q'){
            let q = chatLog[chatLog.length-1].msg;
            axios
                .post(apiUrl + 'chatbot', {question: q})
                .then((data) => {
                    console.log(data.data.res);
                    setChatLog([
                        ...chatLog,
                        new ChatMessage('A', data.data.res)
                    ]);
                    let ta = document.getElementById('chatbotTextarea');
                    ta.scrollTop = ta.scrollHeight;
                })
                .catch((error) => {
                    console.log(error);
                    setChatLog([
                        ...chatLog,
                        new ChatMessage('A', 'Error Loading Chatbot Response')
                    ]);
                })
                .finally(() => {
                    setAnswerLoading(false);
                    setCurrentQuestion('');
                    textInput.current.focus();
                });
        }
    }, [chatLog]);

    const handleOnKeyDown = (e) => {
        if (e.key === 'Enter') {
            submitQuestion();
        }
    }

    const submitQuestion = () => {
        if(currentQuestion !== '') {
            setAnswerLoading(true);
            setChatLog([
                ...chatLog,
                new ChatMessage('Q', currentQuestion)
            ]);
        }
    }

    return(
            <div className='chatbotFrame'>
                <div className='chatbotHeader'
                     onClick={toggleExpand}
                >
                    Chat to us!
                    <div>
                        {expanded ? '-' : '+'}
                    </div>
                </div>
                <div className='chatbotBody'
                    style={{display: expanded ? 'flex' : 'none'}}>
                    <div className='chatLog' id='chatbotTextarea'>
                        {chatLog.map((ch, i) => {
                            return (
                                <div key={'c' + ch.type + i} className='chatTextHolder'>
                                    <div key={ch.type + i}
                                        className={ch.type === 'Q' ? 'chatText question' : 'chatText answer'}
                                        title={format(ch.dateTime, 'HH:mm:ss dd-MM-yyyy')}
                                    >
                                        {ch.msg}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className='inputHolder'>
                        <input
                            name="question"
                            value={currentQuestion}
                            onChange={onQuestionChange}
                            disabled={answerLoading}
                            onKeyDown={handleOnKeyDown}
                            ref={textInput}
                        />
                        <button
                            onClick={submitQuestion}
                            disabled={currentQuestion === ''}
                        >Go</button>
                    </div>
                </div>
            </div>
    )

}

export default Chatbot;