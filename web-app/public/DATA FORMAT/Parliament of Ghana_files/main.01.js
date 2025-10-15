(function ($) {
    "use strict";

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 40) {
            $('.navbar').addClass('sticky-top');
        } else {
            $('.navbar').removeClass('sticky-top');
        }
    });

    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });



    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Product carousel
    $(".product-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 45,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        items: 1,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
    });

})(jQuery);

function askBagbin(text) {
    bot = "http://localhost:1957/answer/?"

    $('#explainDialog').modal({ backdrop: 'static', keyboard: false });
    $('#explainDialog').modal('show');
    return
    (async () => {
        const rawResponse = await fetch(bot + new URLSearchParams({
            question: text, html: "yes"
        }), {
            crossDomain: true,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': 'jku7654655bgcfe3233lolo9hg$.',

            },

        }).catch(() => { $("#ans").html("<h3 style='color:red'>Service unavailable at the moment. Please try again later.</h3>"); });
        try {
            const result = (await rawResponse.json());
            $("#ans").html(result["answer"]);
        } catch { }


    })()

}

function askBagbinIndex(index) {

    qtns = ["Explain the history of parliament during 1850.", "Explain what happened in 1925.", "Explain the history of parliament during 1946.", "Explain the history of parliament during 1951.", "In detail explain what happened to parliament and ghana in 1957.", "In detail explain what happened to parliament and ghana in 1960", "In detail explain what happened to parliament and ghana between 1969 to 1972 and 1972 to 1979", "In detail explain what happened to parliament and ghana in 1993 and afterwards"];


    bot = "http://localhost:1957/answer/?"

    $('#explainDialog').modal({ backdrop: 'static', keyboard: false });
    $('#explainDialog').modal('show');
    $("#prog").css("display", "block")
    $("#innerMsg").html("");

    (async () => {
        const rawResponse = await fetch(bot + new URLSearchParams({
            question: qtns[index], html: "yes"
        }), {
            crossDomain: true,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': 'jku7654655bgcfe3233lolo9hg$.',

            },

        }).catch(() => { $("#innerMsg").html("<h3 style='color:red'>Service unavailable at the moment. Please try again later.</h3>"); });
        try {
            const result = (await rawResponse.json());
            $("#innerMsg").html(result["answer"] /*+ "<br><br><a href='http://192.168.8.111/bagbin/'>Ask Bagbin more questions</a>"*/);
        } catch { }

        $("#prog").css("display", "none");

    })()
}

function loadSocialHandle(mp, media) {
    //alert(mp + " - " + media)
}

function showPDF(file, title) {
    $('#dlgDoc').attr("src", "");
    $('#pdfDialog').modal({ backdrop: 'static', keyboard: false });
    $('#dlgTitle').html(title);
    $('#pdfDialog').modal('show');
    $('#dlgDoc').attr("src", "https://www.parliament.gh/epanel/docs/" + file)
}



$("#docs_page").change(() => {
    window.location.href = window.location.href.split("&P=")[0] + "&P=" + $("#docs_page option:selected").val();
});
$("#docs_page2").change(() => {
    window.location.href = window.location.href.split("&P=")[0] + "&P=" + $("#docs_page2 option:selected").val();
});

const stripHTMLTags = str => str.replace(/<[^>]*>/g, '');


function reader() {
    try {

        var message = new SpeechSynthesisUtterance();
        var speechSynthesis = window.speechSynthesis;
        if (speechSynthesis.speaking) {

            speechSynthesis.cancel();
            return;
        }
        message.text = stripHTMLTags($("#read_some").html().replace("&nbsp;", ""));
        speechSynthesis.speak(message);

    } catch { }
}

function viewAlbum(id, pics, title) {
    $('#albumDialog').modal({ backdrop: 'static', keyboard: true });
    $('#albumTitle').html(title);
    var pic_items = [];
    for (i = 0; i < pics.length; i++) {
        pic_items.push({ src: pics[i] + '.jpg', srct: pics[i] + '.jpg', title: '' })
    };


    jQuery("#nanogallery2").nanogallery2({
        galleryMaxRows: 1,
        galleryDisplayMode: 'rows',
        thumbnailDisplayOrder: 'random',
        thumbnailHeight: 'auto',
        thumbnailWidth: 150,
        touchAnimation: true,
        itemsBaseURL: 'cspics/gal/',
        items:
            pic_items

    });

    $('#albumDialog').modal('show');
}

function watchVideo(id, title) {
    $('#fbPlay').attr("src", '');
    $('#fbDialog').modal({ backdrop: 'static', keyboard: false });
    $('#fbTitle').html(title);
    $('#fbDialog').modal('show');
    $('#fbPlay').attr("src", "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2FParliament.of.Ghana%2Fvideos%2F" + id + "%2F&show_text=false&width=560&t=0");
}

function search_find() {
   
    var item = $("#mainSearch").val().trim();
    if (item == ''){
        iziToast.error({
            timeout: 6000,
            position: 'topRight',
            title: 'Error',
            message: 'Type the text to search',
        });
    }else{
   window.location = 'search?for=' + item;
    }
}

function summarizeAsync(text,inst=""){
    $('#kodiDialog').modal({
        backdrop: 'static',
        keyboard: false
    });
    if(inst==""){
        inst="Summarize this content as much as possible while maintaining the original meaning.  Try to break your answer into at most 2 paragraphs.";
        $('#responseBody').html("<div class='d-flex justify-content-center mb-4 lead text-muted'>Please wait while AskParly summarises the conent for you</div><div class='d-flex justify-content-center'> <i   class='fa fa-spinner fa-spin fa-3x fa-fw'>&nbsp;</i></div>");
        $("#prompt").val("");
    }else{
       // inst+=". Do not limit your answer to provided text. You can include external sources where necessary. You can format the output using html where necessary.";
        $('#responseBody').html("<div class='d-flex justify-content-center mb-4 lead text-muted'>Please wait while AskParly tries to respond to your prompt</div><div class='d-flex justify-content-center'> <i   class='fa fa-spinner fa-spin fa-3x fa-fw'>&nbsp;</i></div>");
    }
    $("#interactiveSection").children().prop('disabled',true);
    $('#kodiDialog').modal('show');
    $("#contentOnHold").val(text);
    var bot = "https://services.parliament.gh:1960/summary/?";
		
		(async () => {
			const rawResponse = await fetch(bot + new URLSearchParams({
				content: text, action: inst
			}), {
				crossDomain: true,
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': 'jku7654655bgcfe3233lolo9hg$.',

				},

			}).catch(() => { $("#responseBody").html("<h3 style='color:red'>AskParly is unavailable at the moment. Please try again later.</h3>");$("#interactiveSection").children().prop('disabled',false); });
			
            try {
				const result = (await rawResponse.json());
				$("#responseBody").html(result["msg"]);
                $("#interactiveSection").children().prop('disabled',false);
			} catch { }

		})();
	
}

function answer(){
    var prompt=$("#prompt").val().trim();
    var text =$("#contentOnHold").val();
    if(prompt==""){
        iziToast.error({
            title: 'Error',
            message: 'Type your question about the content of this document',
            position: 'center'
        });
        return;
    }else{
        summarizeAsync(text,prompt);
    }
}

function loadContributions(id, page) {
   
    (async () => {
        const rawResponse = await fetch("contributions", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: "list", mp: id, "page": page })
        }).finally(() => {

        });

        const result = await rawResponse.json();
        //console.log(result);
        // console.log(rawResponse.text())
        
        $.get('holders/speech.hld').done ((data) => {
            var html="";
            var count=0;
            result.forEach(speech => {
                html+=data.replaceAll("{{1}}","acc_"+speech["id"]).replaceAll("{{2}}","acc_2_"+speech["id"]).replaceAll("{{3}}",speech["speech"].replaceAll("\n","<br>")).replaceAll("{{4}}",speech["title"]).replace("{{5}}",speech["published"]).replace("{{6}}",speech["source"]).replace("{{7}}",speech["id"]);
                if(count==0){
                    html=html.replace("{{11}}"," open ");
                    count++;
                }else{
                    html=html.replace("{{11}}"," collapse ");
                }
            });
            $("#contributions_holder").html(html);
        }).fail((x)=>{});
       


    })();
}
