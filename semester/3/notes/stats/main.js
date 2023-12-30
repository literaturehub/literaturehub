var data = [];

$(document).ready(function() {
    loadData()
})

function loadData() {
    var script_url = "https://script.google.com/macros/s/AKfycbxZZ4TtWgEYUwfUDzp2oSHs6gcarK0wpOP9bbNU-5LbIr7gALr6rgAJSFDvoWR2tVX-/exec";
    $(".canvas").css("display",
        "flex");
    var url = script_url + "?action=read";
    $.getJSON(url,
        function (json) {
            $(".canvas").css("display", "none");
            for (var i = 0; i < json.records.length; i++) {
                data.push(json.records[i])
            }
            showData();
        })
}

function showData() {
    const itemStats = {};
    const itemInfo = {
        1: {
            name: 'Purloined Letter',
            marks: { 2: 0, 5: 0, 10: 0 }
        },
        2: {
            name: 'The Crack-Up',
            marks: { 2: 0, 5: 0, 10: 0 }
        },
        3: {
            name: 'Dry September',
            marks: { 2: 0, 5: 0, 10: 0 }
        },
        4: {
            name: 'The Prologue',
            marks: { 2: 0, 5: 0, 10: 0 }
        },
        5: {
            name: 'Passage To India (lines. 1-68)',
            marks: { 2: 0, 5: 0, 10: 0 }
        },
        6: {
            name: 'Crow Testament',
            marks: { 2: 0, 5: 0, 10: 0 }
        },
        7: {
            name: 'Murder of Roger Ackroyd',
            marks: { 2: 0, 5: 0, 10: 0 }
        },
        8: {
            name: 'Tintin in Tibet',
            marks: { 2: 0, 5: 0, 10: 0 }
        },
        9: {
            name: 'Paradise Lost (Book I)',
            marks: { 2: 0, 5: 0, 10: 0 }
        },
        10: {
            name: 'The Rape of The Lock (Cantos I and III)',
            marks: { 2: 0, 5: 0, 10: 0 }
        },
    };

    const stats = data.reduce((acc, item) => {
        if (item.question !== "") {
            acc.totalQuestions++;
            if (item.answer !== "") {
                acc.answered++;
            }
            acc[`fromCC${item.cc_id}`]++;
            acc[`total${item.mark}Marks`]++;

            const itemId = item.item_id;
            if (itemInfo[itemId]) {
                acc[`fromItemID${itemId}`]++;
                itemInfo[itemId].marks[item.mark]++;
            }
        }
        return acc;
    },
        {
            totalQuestions: 0,
            answered: 0,
            fromCC5: 0,
            fromCC6: 0,
            fromCC7: 0,
            total10Marks: 0,
            total5Marks: 0,
            total2Marks: 0,
            ...Object.fromEntries(Object.keys(itemInfo).map(id => [`fromItemID${id}`, 0]))
        });

    const resultHtml = `
        <p>Total Questions : ${stats.totalQuestions}</p>
        <p>Answered Questions : ${stats.answered}</p>
        <p>From CC5 : ${stats.fromCC5}</p>
        <p>From CC6 : ${stats.fromCC6}</p>
        <p>From CC7 : ${stats.fromCC7}</p>
        <p>Total 10 Marks : ${stats.total10Marks}</p>
        <p>Total 5 Marks : ${stats.total5Marks}</p>
        <p>Total 2 Marks : ${stats.total2Marks}</p>
        <h2>Book Wise</h2>
        ${Object.keys(itemInfo).map(id => `
            <p>
                From <span class="book-name">${itemInfo[id].name}</span> : 
                <span class="mark-style">${itemInfo[id].marks[2]}</span> questions with 2 marks,
                <span class="mark-style">${itemInfo[id].marks[5]}</span> questions with 5 marks,
                <span class="mark-style">${itemInfo[id].marks[10]}</span> questions with 10 marks
            </p><br>`).join('')}
    `;

    $("#result").append(resultHtml);
}