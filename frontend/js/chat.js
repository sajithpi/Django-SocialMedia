
$(document)
.on('click','.message_btn',function (e) {
    e.preventDefault()
    console.log("Clicked")
    const msg_id = $(this).attr('id')
    console.log("msg_id:",msg_id)
    let message_btn = document.getElementById(`message_btn${msg_id}`)
    message_btn.classList.replace('from-indigo-700','from-green-700')
    message_btn.classList.replace('via-indigo-600','vi-green-600')
    message_btn.classList.replace('to-indigo-800','to-green-800')
    let trash_message = document.getElementById('trash_message')
    trash_message.classList.replace('hidden','visible')
    trash_message.addEventListener("click",function (e) {
        e.preventDefault()
        console.log("clicked")
    })
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
                    $(`#message_btn${msg_id}`).fadeOut(); 
                    try {
                        $(`#media_message${msg_id}`).fadeOut();
                      }
                      catch(err) {
                        console.log("No media exist with this message")
                      }
                }
                else{
                    console.log(response.error())
                }
            },
        })
    })

})

.on("click","#notification_clear",function(e){
    e.preventDefault()
    console.log("Clicked")
    var notification_clear_value = "clear all"
    $.ajax({
        type:'POST',
        url:$("#notification_clear").data('notification-clear-url'),
        data:{
            'notification_value':notification_clear_value,
        },
        success:function(response){
            if(response.message==='success'){
                console.log("success")
                $(".notification_list").fadeOut()
            }
            else{
                console.log(response.err)
            }
        }
    })
})