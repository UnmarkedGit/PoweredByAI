import React, { useState, useMemo } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

function App() {
    const [country, setCountry] = useState('');
    const [chatApi, setChatApi] = useState('')
    const [promptText, setPromptText] = useState('');
    const systemMessage = { // The content will be an additional prompt you can use, that you wont need to type in every time. For example: "talk like a pirate" or "talk like a baby"
        "role": "system", "content": "be brief"
    };
    const [messages, setMessages] = useState([
        {
            message: "Ask me anything!",
            sentTime: "just now",
            sender: "ChatGPT"
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);




    const handleChatApiChange = (event) => {
        setChatApi(event.target.value);
    };
    const handlePromptTextChange = (event) => {
        setPromptText(event.target.value);
    };


    async function processMessageToChatGPT(chatMessages) {

        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message }
        });
        
        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,  
                ...apiMessages 
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + chatApi,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            }).then((data) => {
                return data.json();
            }).then((data) => {
                console.log(data);
                setMessages([...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }]);
                setIsTyping(false);
            });
    }


    const helloSubmit = async (event) => {
            event.preventDefault();
            const newMessage = {
                message: 'Just say Hello',
                direction: 'outgoing',
                sender: "user"
            };

            const newMessages = [...messages, newMessage];

            setMessages(newMessages);
            
            setIsTyping(true);
            await processMessageToChatGPT(newMessages);
    };
    const dishSubmit = async (event) => {
            event.preventDefault();
            const newMessage = {
                message: 'Give me a random dish from ' + country,
                direction: 'outgoing',
                sender: "user"
            };
           
            if (country.length === 0) {
                newMessage.message = "Give me a random dish";
            } else {
                newMessage.message = 'Give me a random dish from ' + country;
            }

            const newMessages = [...messages, newMessage];

            setMessages(newMessages);
            
            setIsTyping(true);
            await processMessageToChatGPT(newMessages);
    };
    const promptSubmit = async (event) => {
        event.preventDefault();
            event.preventDefault();
            const newMessage = {
                message: promptText,
                direction: 'outgoing',
                sender: "user"
            };

            const newMessages = [...messages, newMessage];

            setMessages(newMessages);
            
            setIsTyping(true);
            await processMessageToChatGPT(newMessages);
    };
    
    return (
        <div>
            <h1 id="tabelLabel">Powered by AI</h1>
            <div id="lefttop">
                <p>OpenAI gives you $5 worth of API credits when you first create an OpenAI account. This free credit expires three months after you create your OpenAI account.</p>
                <p>If you already have an account you can make a new one.</p>
                <p>See <a href="https://platform.openai.com/api-keys">https://platform.openai.com/api-keys</a> to test with your own api key.</p>

                <label>
                    Put api key here:
                    <textarea value={chatApi} onChange={handleChatApiChange} rows={1} cols={50} />
                </label>
            </div>
            <br></br>
            <div id="Chat">
                <p>See Cooper Codes video at <a href="https://www.youtube.com/watch?v=Lag9Pj_33hM&list=WL&index=5">https://www.youtube.com/watch?v=Lag9Pj_33hM&list=WL&index=5</a>, he has a throurgh explanation on how to do api calls and a better way to format a chat session then my original plan. Complete credit to that gentleman for those parts!</p>
            <ChatContainer>
                <MessageList
                    scrollBehavior="smooth"
                    typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
                >
                    {messages.map((message, i) => {
                        console.log(message);
                        return <Message key={i} model={message} />;
                    })}
                </MessageList>

            </ChatContainer>
            </div >
            <br></br>
            <div id="leftbox">
                <form onSubmit={helloSubmit}>
                    <button type="submit">Just Say Hello</button>
                </form>
            </div>
            <div id="middlebox">
                <form onSubmit={dishSubmit}>
                    <button type="submit">Give me a random dish from...</button>
                    <CountryDropdown value={country} onChange={(val) => setCountry(val)} />
                </form>
            </div>
            <div id="rightbox">
                <form onSubmit={promptSubmit}>
                    <label>
                        Enter your own prompt:
                        <textarea value={promptText} onChange={handlePromptTextChange} rows={4} cols={40} />
                    </label>
                    <button type="submit">send</button>
                </form>
            </div>
            <br></br>
            <br></br>
            <div id="costbox">
            <h2>Costs:</h2>
                <p>The free personal testing version that the api uses is similar to gpt-3.5-turbo</p>
                <p>To get one brief message from chat is far under one cent.</p>
                <p>For how much Openai is charging you, the API usage metrics are at: <a href="https://platform.openai.com/usage">https://platform.openai.com/usage</a>.</p>
                <p>For a better expanation on cost metrics look at: <a href="https://platform.openai.com/account/limits">https://platform.openai.com/account/limits</a>.</p>
                <p>I wanted to do a cost per session thing here. There is already the usage page, so it would ultimately be redundant.</p>

            </div>
        </div>
    );
}

export default App;