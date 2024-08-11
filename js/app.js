const chatInput   = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox     = document.querySelector(".chatbox");
const chatbotToggler  = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn  = document.querySelector(".close-btn");


let userMessage;
const inputInitHeight = chatInput.scrollHeight;

const createChatli = (message, className) =>{
    // Create a chat  <li> element with passed message an className</li>
    const chatLi   = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent  = className === "outgoing" ?  ` <p></p>` : ` <span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").innerHTML = message;
    return chatLi;
}

const generateResponse = (incomingChatli) => {
    const API_KEY = "AIzaSyBRmxPCNBM56wbGnH3jAlvmQf9lgb7YMi8";
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    const messageElement = incomingChatli.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            role: "user", 
            parts: [{ text: userMessage }] 
          }] 
        }),
      };
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.candidates[0].content.parts[0].text;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Opps! Somthing went wrong. Please try again.";
    }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));

};

    let chatContent;
        chatContent = `<div class="loading">
                            <div class="typing-indicator">
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                            </div>
                       </div> `;
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    //Append the user's message to the chatbox
    chatBox.appendChild(createChatli(userMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(() => {
       //Display "Thinking ..." message while waiting for the response
       const incomingChatli = createChatli(chatContent, "incoming");
       chatBox.appendChild(incomingChatli);
       chatBox.scrollTo(0, chatBox.scrollHeight);
       generateResponse(incomingChatli);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
