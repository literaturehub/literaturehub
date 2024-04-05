$(".nav_menu").click(function() {
    $(".nav_items").css("width", "290px")
    $(".canvas").css("display", "block")
})

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px")
    $(".canvas").css("display", "none")
})

$(".cc-8").click(function() {
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/4/notes/papers/8/";
})

$(".cc-9").click(function() {
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/4/notes/papers/9/";
})

$(".cc-10").click(function() {
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/4/notes/papers/10/";
})

$(".sec-2").click(function() {
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/4/notes/papers/sec-2/";
})

$("#notes-theme").change(function() {
    Cookies.set("_theme_mode_", $(this).val(), {
        expires: 365
    })
})

$("#question-font-family").change(function() {
    Cookies.set("_question_font_family", $(this).val(), {
        expires: 365
    })
})

$("#answer-font-family").change(function() {
    Cookies.set("_answer_font_family", $(this).val(), {
        expires: 365
    })
})


var themeMode = Cookies.get("_theme_mode_");
var questionFontFamily = Cookies.get('_question_font_family');
var answerFontFamily = Cookies.get("_answer_font_family");

$("#notes-theme").val(themeMode);
$("#question-font-family").val(questionFontFamily);
$("#answer-font-family").val(answerFontFamily);

$(".notes-page-settings-canvas").click(function(){
    $(".notes-page-settings-container").hide();
})

$("#notes-page-setting").click(function(){
    $(".notes-page-settings-container").show();
})