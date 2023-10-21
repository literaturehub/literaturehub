var BASE_URL = "https://api.themoviedb.org/3/search/movie";
var BASE_URL_MOVIE = "https://api.themoviedb.org/3/movie/"
var API_KEY = "0216c7f0ac7eccd88428ff92bbccd0a1";
var IMAGE_PATH = "https://image.tmdb.org/t/p/original";
var REQUESTS_DB = [];

var SCRIPT_BASE_URL = "https://script.google.com/macros/s/AKfycbwnTtnh_aR6iHXxMqXkkO_SxSpKGtGt4E-7rO2itQkQnJxEFM_Vmr44RoG10JaAs5cE-g/exec";
var isParsed = false;

$("#all-requests-page").hide();
$("#request-page").show();

$("#viewMore").hide();
$(".nav_menu").click(function() {
    $(".nav_items").css("width", "250px")
    $(".canvas").css("display", "block")
})

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px")
    $(".canvas").css("display", "none")
})
var page = 1;

function fetchData() {
    var uploadStatus = "";
    var status = "";
    var sQuery = $(".form input").val().trim();
    var sUrl = BASE_URL + "?api_key=" + API_KEY + "&query=" + sQuery + "&include_adult=true&page=" + page;

    fetch(sUrl)
    .then(response => response.json())
    .then(data => {
        if (data.success !== false) {
            for (var i = 0; i < data.results.length; i++) {
                var idMatched = false; // Initialize a flag to track ID matches for each data item

                for (var j = 0; j < REQUESTS_DB.length; j++) {
                    if (data.results[i].id == REQUESTS_DB[j].movie_id) {
                        var isUploaded = REQUESTS_DB[j].is_uploaded;
                        var statusText = getStatus(REQUESTS_DB[j].is_uploaded);

                        $(".result_items").append("<div class='movie_item'><img class='poster' src='" + IMAGE_PATH + data.results[i].poster_path + "'/>" + "<h2 class='title'>" + data.results[i].title + "</h2><p class='status " + statusText.toLowerCase() + "'>" + statusText + "</p><p class='divider'></p></div>");

                        idMatched = true;
                        break;
                    }
                }

                if (!idMatched) {
                    $(".result_items").append("<div class='movie_item'><img class='poster' src='" + IMAGE_PATH + data.results[i].poster_path + "'/>" + "<h2 class='title'>" + data.results[i].title + "</h2><button class='request' onclick='request(" + data.results[i].id + ")'>Request</button><p class='divider'></p></div>");
                }
            }



            if (data.results.length == 0) {
                alert("No results found");
            }
            if (page < data.total_pages) {
                $("#viewMore").show();
                page++;
            } else {
                $("#viewMore").hide();
            }
        }
    })
    .catch(error => console.error("Error: ", error));

}


$(".form button").click(function () {
    page = 1;
    $(".result_items").html("");
    fetchData();
});


$("#viewMore").click(function () {
    fetchData();
});

$(document).on('click', '.request', function() {
    $(".loader-container").css("top", "100px")
})


function ctrlq(e) {
    $(".loader-container").css("top",
        "-100px")
    if (e.result === "success") {
        loadRequests();
        customAlertDialog('Request Info', 'Successfully requested for the movie. The movie will be uploaded soon!', [{
            name: 'OK',
            action: () => {}
        }]);

    } else if (e.result === "failed") {
        customAlertDialog('Request Info', 'There is already a pending request for the movie...', [{
            name: 'OK',
            action: () => {}
        }]);
    }
}

function request(id) {
    var url = SCRIPT_BASE_URL + "?callback=ctrlq&serial_no=1&request_id="+user+"&movie_id="+id+"&is_uploaded=0&action=insert";



    var request = jQuery.ajax({
        crossDomain: true,
        url: url,
        method: "GET",
        dataType: "jsonp"
    });
}


$(document).ready(function() {
    loadUser();
    loadRequests();
})

var user;
function loadUser() {
    user = Cookies.get("username");
    if (user == undefined) {
        $(".member_form").css("display", "flex");
        $(".member_form_canvas").css("display", "flex")
    } else {
        $(".user_id").append("Username : "+user)
    }
}

function logUser() {
    var username = $("#username").val().trim()
    if (username != "") {
        if (username.length > 4) {
            Cookies.set("username", username, {
                expires: 365
            })
            $(".user_id").append("Username : "+username)
            $(".member_form , .member_form_canvas").css("display", "none")
        }
    }
}

function loadRequests() {
    REQUESTS_DB.length = 0;
    $(".loader-container").css("top", "100px");
    $(".form button").attr("disabled", "true")
    $.getJSON(SCRIPT_BASE_URL+"?action=read", function (json) {
        for (var i = 0; i < json.records.length; i++) {
            REQUESTS_DB.push(json.records[i])
        }
        showRequests();
    })
    $(".loader-container").css("top",
        "-100px");
    $(".form button").removeAttr("disabled");
}

$(".request_movie").click(function() {
    $("#all-requests-page").hide();
    $("#request-page").show();
    $(".canvas").click();
})

$(".all_requests").click(function() {
    $("#all-requests-page").show();
    $("#request-page").hide();
    $(".canvas").click();
    $('#results tr:not(:first)').remove();
    showRequests();
})

async function showRequests() {
    let serialNumber = 1;
    REQUESTS_DB.reverse();
    for (let i = 0; i < REQUESTS_DB.length; i++) {
        try {
            const title = await parseTitle(REQUESTS_DB[i].movie_id);
            const isUploaded = REQUESTS_DB[i].is_uploaded;
            let status;

            if (isUploaded === 0) {
                status = "Pending";
            } else if (isUploaded === 1) {
                status = "Uploaded";
            } else if (isUploaded === 2) {
                status = "Canceled";
            } else if (isUploaded === 3) {
                status = "Unavailable";
            } else {
                status = "Unknown";
            }

            const row = $("<tr><td>" + serialNumber+ "</td><td>" + REQUESTS_DB[i].request_id + "</td><td>" + title + "</td><td>" + REQUESTS_DB[i].request_date + "</td><td class='p-0 " + status.toLowerCase() + "'><span class='p-1 m-1 rounded-1'>" + status + "</span></td></tr>");
            $("#results").append(row);
            serialNumber ++;
        } catch (error) {
            console.error("Error: ", error);
        }
    }
}


function parseTitle(movieId) {
    return fetch(BASE_URL_MOVIE+ movieId + "?api_key=" + API_KEY)
    .then(response => response.json())
    .then(data => {
        if (data.success !== false) {
            return data.title;
        } else {
            throw new Error("Movie title not found");
        }
    });
}

function customAlertDialog(title, message, buttons) {
    const dialog_canvas = document.createElement('div');
    const dialog = document.createElement('div');
    dialog_canvas.className = 'custom-dialog-canvas'
    dialog.className = 'custom-dialog';
    const dialogTitle = document.createElement('h2');
    dialogTitle.textContent = title;

    const dialogMessage = document.createElement('p');
    dialogMessage.textContent = message;
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    buttons.forEach(button => {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = button.name;
        buttonElement.addEventListener('click', () => {
            button.action();
            dialog_canvas.remove();
        });
        buttonContainer.appendChild(buttonElement);
    });

    dialog_canvas.appendChild(dialog)
    dialog.appendChild(dialogTitle);
    dialog.appendChild(dialogMessage);
    dialog.appendChild(buttonContainer);
    document.body.appendChild(dialog_canvas);
}

function getStatus(isUploaded) {
    if (isUploaded === 0) {
        status = "Pending";
    } else if (isUploaded === 1) {
        status = "Uploaded";
    } else if (isUploaded === 2) {
        status = "Canceled";
    } else if (isUploaded === 3) {
        status = "Unavailable";
    } else {
        status = "Unknown";
    }
    return status;
}