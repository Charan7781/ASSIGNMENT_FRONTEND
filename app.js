var page = 1;
var searchString = "";
window.addEventListener("load", function(){
    document.querySelector(".app-container .search-box .control-submit").addEventListener("click",handleClick)
});

function handleClick() {
    searchString = document.querySelector("#query").value;
    searchString && makeApiCall(searchString);
}

async function makeApiCall(queryWord) {
    var apiKey = "9df4a8b9";
    var results;
    await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${queryWord}&page=${page}`)
    .then(response => response.json())
    .then(data => results = data);
    populateResults(results);
}

function populateResults(results) {
    var enteriesForDom = [];
    results.Search.forEach(res => {
        var resStruct = constructStructure();
        enteriesForDom.push(applyValue(resStruct, res));
    });
    document.querySelector("#results").append(...enteriesForDom);
    if(page*10 < parseInt(results.totalResults) && !document.querySelector("#dynamic-btns")) {
        var dynamicBtns = document.createElement("div");
        dynamicBtns.id = "dynamic-btns"
        var resetBtn = Object.assign(document.createElement("button"),{
            className: 'reset',
            innerText: 'Reset',
            onclick: reset
        })
        var nextBtn = Object.assign(document.createElement("button"),{
            className: 'next',
            innerText: 'More Results',
            onclick: updatePageCounter
        })
        dynamicBtns.append(resetBtn, nextBtn);
        document.querySelector(".result-container").appendChild(dynamicBtns);
    }
}

function constructStructure() {
    var parent = document.createElement('article');
    parent.className = "card";
    var titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    var posterDiv = document.createElement('div');
    var imgInPosterDiv = document.createElement('img');
    imgInPosterDiv.className = 'poster';
    posterDiv.appendChild(imgInPosterDiv);
    var typeDiv = document.createElement('div');
    typeDiv.className = 'type';
    parent.append(titleDiv, posterDiv, typeDiv);
    return parent;
}

function applyValue(parent, valueObj) {
    parent.querySelector(".title").innerText = `${valueObj.Title} (${valueObj.Year})`;
    Object.assign(parent.querySelector(".poster"), {
        src: valueObj.Poster,
        alt: valueObj.Title
    });
    parent.querySelector(".type").innerText = valueObj.Type;
    return parent;
}

function updatePageCounter() {
    page = page + 1;
    makeApiCall(searchString);
}

function reset() {
    page = 1;
    searchString = "";
    document.querySelector("#query").value = searchString;
    document.querySelector("#results").innerText = "";
    document.querySelector(".result-container").lastElementChild.remove();
}