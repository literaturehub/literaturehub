$(document).ready(function () {
    // Scroll animation for content
    $(".explore-button").on("click", function () {
        $("html, body").animate(
            {
                scrollTop: $(".content").offset().top,
            },
            1000
        );
    });

    // Candle flicker effect
    $(".candle").each(function () {
        setInterval(() => {
            $(this).css("box-shadow", `0px 0px ${Math.random() * 15}px #f5e050`);
        }, 300);
    });
});

$(document).on('load', function () {
    const music = $('#background-music')[0];
    music.play().catch((error) => console.log('Autoplay blocked: ', error));
});