$.ajaxSetup({
    beforeSend: function beforeSend(xhr, settings){
        function getCookie(name){
            let cookieValue = null;

            if(document.cookie && document.cookie != ''){
                const cookies = document.cookie.split(';');

                for(let i = 0; i < cookies.length; i+=1){
                    const cookie = jQuery.trim(cookies[i]);

                    // does this cookie string begin with the name we want
                    if(cookie.substring(0, name.length + 1) === (`${name}=`)){
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }

            return cookieValue;
        }

        if(!(/^http:.*/.test(settings.url) || /^http:.*/.test(settings.url))) {
            // only send the token to relative urls, ie locally
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'))
        }
    },
})

$(document).on("click", ".js-toggle-modal", function(e){
    e.preventDefault()
    // console.log("Hello I was clicked ")
    $('.js-modal').toggleClass("hidden");
})
.on("click", ".js-submit", function(e){
    e.preventDefault()
    // console.log("sumbit");
    const text = $(".js-post-text").val().trim()
    const $btn = $(this)

    if(!text){
        return false;
    }

    // $('.js-modal').addClass("hidden");
    // $(".js-post-text").val('');

    $btn.prop("disabled", true).text("Posting!")
    $.ajax({
        type: "POST",
        url: $(".js-post-text").data("post-url"),
        data: {
            text: text
        },
        success: (dataHtml) => {
            $(".js-modal").addClass("hidden")
            $("#post-container").prepend(dataHtml)
            $btn.prop("disabled", false).text("New Post");
            $(".js-post-text").val('');
        },
        error: (error) => {
            console.warn(error);
            $btn.prop("disabled", false).text("Error")
        }
    })
})
.on("click", ".js-follow", function(e){
    e.preventDefault();

    const action = $(this).attr('data-action')

    $.ajax({
        type: "POST",
        url: $(this).data('url'),
        data: {
            action: action,
            username: $(this).data('username')
        },
        success: (data) => {
            $(".js-follow-text").text(data.wording)
            if(action == "follow"){
                // change the wording to unfollow
                $(this).attr("data-action", "unfollow")
            } else {
                // or else opp
                $(this).attr("data-action", "follow")
            }
        },
        error: (error) => {
            console.warn(error);
        }
    })
})