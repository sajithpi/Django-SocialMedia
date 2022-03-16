
$(document)
.on('click','.message_btn',function (e) {
    e.preventDefault()
    console.log("Clicked")
    const msg_id = $(this).attr('id')
    console.log("msg_id:",msg_id)
    let message_btn = document.getElementById(`message_btn${msg_id}`)
    message_btn.classList.replace('bg-blue-600','bg-red-300')
    let chat_head = document.getElementById('chat_head')
    chat_head.classList.add('bg-blue-500')
    let trash_message = document.getElementById('trash_message')
    trash_message.classList.replace('hidden','visible')
    trash_message.addEventListener("click",function (e) {
        e.preventDefault()        
        console.log("clicked trash")
        let url = $('#trash_message').data('message-delete-url')
        console.log("url:",url)
        var $this = $(this)
        $.ajax({
            type:'POST',
            url:url,
            data:{
                'msg_id':msg_id,
            },
            success:function(response){
                if(response.message == 'success'){

                    console.log("successfully deleted message")
                    console.log("message:",response.content)
                    $(`.message_tile${msg_id}`).fadeOut(); 
                }
                else{
                    console.log(response.error())
                }
            },
        })
    })

})