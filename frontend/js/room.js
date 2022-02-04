const roomName = JSON.parse(document.getElementById('room-name').textContent);
const chatLog = document.querySelector('#chat-log')

if (!chatLog.hasChildNodes()){
    const emptyText = document.createElement('h3')
    emptyText.id = 'emptyText'
    emptyText.innerText = 'No Messages'
    emptyText.className = 'emptyText'
    chatLog.appendChild(emptyText)
    console.log("No messages")
}

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const messageElement = document.createElement('div')
    const user_id = data['user_id']
    const logged_in_id = JSON.parse(document.getElementById('user_id').textContent)
    const user_avatar = JSON.parse(document.getElementById('user_avatar').textContent)
    
 

    // messageElement.innerText = data.message
    console.log("logged_in_user_id:",logged_in_id)
    
    // console.log("user avatar:",user_avatar)
    if(user_id == logged_in_id){

        messageElement.classList.add('message','sender')
        messageElement.innerHTML = `
        <div class="flex items-end justify-end">
            <div class="flex flex-col space-y-2 text-xs max-w-xs mx-7 order-1 items-end">
                    <div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">${data.message}</span></div>
            </div>
                        
        </div>  
        ` + messageElement.innerHTML
        
    }else{
        messageElement.classList.add('message','receiver')
        messageElement.innerHTML = `
        <div class="flex items-end">
            <div class="flex space-y-2 text-xs max-w-xs order-2 items-start items-center">
                <div><img src="${user_avatar}" alt="received_user profile avatar" class="rounded-full avatar w-7 h-7 object-cover"></div>
                <div class="m-auto"><span class="px-2 py-2 rounded-lg inline-block bg-gray-300 text-gray-600 ">${data.message}</span></div>
            </div>
        </div>` + messageElement.innerHTML

    }
   
    chatLog.appendChild(messageElement)
    const el = document.getElementById('chat-log')
    el.scrollTop = el.scrollHeight
    if(document.querySelector('#emptyText')){
        document.querySelector('#emptyText').remove()
    }
    console.log("Data:",data)
   

};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#chat-message-submit').click();
    }
};

document.querySelector('#chat-message-submit').onclick = function(e) {
    const messageInputDom = document.querySelector('#chat-message-input');
    const message = messageInputDom.value;
    const room_id = JSON.parse(document.getElementById('room_id').textContent)
    console.log("room_id:",room_id)

   
    chatSocket.send(JSON.stringify({
        'message': message,
        'room_id':room_id,
        
        // 'room_id':room_id,
        
    }));
    messageInputDom.value = '';
};