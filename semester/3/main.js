$(".nav_menu").click(function() {
    $(".nav_items").css("width", "250px")
    $(".canvas").css("display", "block")
})

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px")
    $(".canvas").css("display", "none")
})

$(".notes").click(function(){
    window.open("https://yogesh-hacker.github.io/yogesh-hacker/Private%20Tuition%20Questions%20&%20Answers/")
})