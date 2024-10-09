import './utils.js';

generateFilterList();
$("#search_pokemon").val("$").trigger("input")

let resultFilter = [];
let pokeRoute = [];

window.filter = (minTime) => {
    return pokemons.filter(e => e.remainingTime() > minTime * 60)
}

window.handleCheckbox = (elem) => {
    if (elem.checked) {
        let secondsLeft = elem.dataset.remainingTime
        setCookie(`CC_${elem.value}`, `${elem.value}`, secondsLeft)
        navigator.clipboard.writeText(elem.value)
    } else {
        deleteCookie(`CC_${elem.value}`);
        navigator.clipboard.writeText("")
    }
}

window.handleFilter = () => {
    resultFilter = filter($("#minutesFilter").val()).sort((a, b) => a.remainingTime() - b.remainingTime());
    filterBoosted();

    let resultHTML = "";

    resultFilter.forEach(e => {
        resultHTML += `<div class='filter_checkbox2'><input type='checkbox' onclick='handleCheckbox(this);' id='${e.center.lat}, ${e.center.lng}' value='${e.center.lat}, ${e.center.lng}' data-remaining-time="${e.remainingTime()}"> <label for='${e.center.lat}, ${e.center.lng}'>${e.center.lat}, ${e.center.lng} - DSP:${Math.round(e.remainingTime()/60)}min </label></div><br/>`;
    });

    $("#filter_result").html("").append(resultHTML);

    getCheckboxes();

    return false;
}

getCheckboxes();

window.onSubmitCopyNext = (event) => {
    event.preventDefault();

    handleFilter();
    let quantity = +$("#quantityNext").val();
    navigator.clipboard.writeText(`_____________________`)

    let checkboxes = $(".filter_checkbox2 > input:not(:checked)");

    for (let i = 0; i < checkboxes.length && i < quantity; i++) {

        let elem = checkboxes[i];

        elem.checked = true;
        handleCheckbox(elem);
    }
    navigator.clipboard.writeText(`---------------------`);
}

window.sortCCByNode = async (origLat, origLong, array) => {
    array.sort(function (a, b) {
        return distance(origLat, origLong, a[0], a[1]) - distance(origLat, origLong, b[0], b[1]) || a[2] - b[2];
    });
}

window.groupCoordinates = (array)  =>{

    let grouped = array.reduce(function(rv, x) {
        (rv[x[0].toFixedNoRounding(2) +x[1].toFixedNoRounding(2)] = rv[x[0].toFixedNoRounding(2)+x[1].toFixedNoRounding(2)] || []).push(x);
        return rv;
    }, {})
    
    return Object.values(grouped);
}

window.getOptimizeRouteTime = (ccArray, speed, isTeleported) =>{
    let pokeRoute = [];

    let acc = 0;
    while(ccArray.length > 0){
        let element = ccArray[0];

        //------------

        let realDistance = distance(pokeRoute.at(-1)?.[0], pokeRoute.at(-1)?.[1], element[0], element[1]) || 0;
        acc += realDistance;
        let remaningTimeByKmWalked = element[2] - acc * 60 / speed * 60 + 60;

        if(remaningTimeByKmWalked <= 0){
        	acc -= realDistance;
        	ccArray.shift();
            continue;
        }

        //--------------

        pokeRoute.push([
            element[0],
            element[1],
            element[2],
            element[3],
            realDistance,
            acc,
            remaningTimeByKmWalked 
        ]);
        
        ccArray.shift();
        
        sortCCByNode(element[0], element[1], ccArray);
    }

    return pokeRoute.filter(e=> e[6] > 0 );
};

window.filterBoosted = () => {
    if($("#weatherBoost")[0].checked){
        resultFilter = resultFilter.filter(e=> e.weather);
    }
}

window.onSubmitBestRoute = async (event) => {
    event?.preventDefault()
    handleFilter();

    let lat = $("#originCoordinates").val()?.split(",")[0] || '40.7540146581032';
    let lng = $("#originCoordinates").val()?.split(",")[1] || '-73.98443256207203';
    let speed = $("#kmPerHour").val() || 60;
    let isTeleported = speed < 0;

    let resultMap = resultFilter.map((e) => [
        e.center.lat, 
        e.center.lng, 
        e.remainingTime(), 
        distance(lat, lng, e.center.lat, e.center.lng)
    ]);

    //sort by time
    resultMap = resultMap.sort((a,b) => a[3] - b[3] || a[2] - b[2]);

    let origin0 = JSON.parse(JSON.stringify(resultMap));
    let origin1 = JSON.parse(JSON.stringify(resultMap));
    let origin2 = JSON.parse(JSON.stringify(resultMap));
    
    console.log("origin0",origin0);
    //-----------------------------------------------
    origin1.sort((a,b) => a[3] - b[3] || a[2] - b[2])
    pokeRoute = getOptimizeRouteTime(origin1, speed, isTeleported)

    //-------------------------------------------------
    
    let groupedArray = groupCoordinates(origin2);

    let maxIndex = groupedArray.map(a=>a.length).indexOf(Math.max(...groupedArray.map(a=>a.length)));

    let chosenGroup = groupedArray[maxIndex];

    let finalShortestRoute = getOptimizeRouteTime(chosenGroup, speed, isTeleported);
 
    let pokeRoute2 = finalShortestRoute;
     

    //-------------------------------------------------
     
    console.log("pokeRoute1",pokeRoute);

    console.log("pokeRoute2",pokeRoute2);
    
    let totalDistance1 = pokeRoute.reduce((prevValue, currValue, index, array) =>  prevValue + distance(array[index-1]?.[0], array[index-1]?.[1], currValue[0], currValue[1]) || 0, 0)
    let totalDistance2 = pokeRoute2.reduce((prevValue, currValue, index, array) =>  prevValue + distance(array[index-1]?.[0], array[index-1]?.[1], currValue[0], currValue[1]) || 0, 0)

    console.log("totalDistance1", totalDistance1);
    console.log("totalDistance2",totalDistance2);

    if(pokeRoute2.length > pokeRoute.length){
        pokeRoute = pokeRoute2
    }
    else if(pokeRoute2.length == pokeRoute.length && totalDistance2 < totalDistance1){
        pokeRoute = pokeRoute2;
    }

    let resultHTML = "";

    pokeRoute.forEach(e => {
        resultHTML += `<div class='filter_checkbox2'><input type='checkbox' onclick='handleCheckbox(this);' id='${e[0]}, ${e[1]}' value='${e[0]}, ${e[1]}' data-remaining-time="${e[2]}"> <label for='${e[0]}, ${e[1]}'>${e[0]}, ${e[1]} - DSP:${Math.round(e[2]/60)}min </label></div><br/>`;
    });

    $("#filter_result").html("").append(resultHTML);

    getCheckboxes();
}

window.infoWindowString = (pokemon) => {  
    var disguiseString = "";
    if (pokemon.disguise != 0) {
        disguiseString = " (" + getDisguisePokemonName(pokemon) + ")";
    }

    var genderString = getGenderString(pokemon);

    var formString = getFormString(pokemon);

    var ivString = "";

    var movesetString = "";

    var cpString = "";
    var weatherString = "";

    weatherString = "<a href='faq.html#weather'><b>Weather boost</b>: ";
    switch (pokemon.weather) {
        case 0:
        weatherString += "None<br /></a>";
        break;
        case 1:
        weatherString += "Clear<br /></a>";
        break;
        case 2:
        weatherString += "Rainy<br /></a>";
        break;
        case 3:
        weatherString += "Partly Cloudy<br /></a>";
        break;
        case 4:
        weatherString += "Cloudy<br /></a>";
        break;
        case 5:
        weatherString += "Windy<br /></a>";
        break;
        case 6:
        weatherString += "Snow<br /></a>";
        break;
        case 7:
        weatherString += "Fog<br /></a>";
        break;
        default:
        weatherString = "";
        break;
    }

    if (pokemon.attack != -1 && pokemon.defence != -1 && pokemon.stamina != -1 && pokemon.move1 != -1 && pokemon.move2 != -1 && pokemon.cp != -1) {
        ivString = "<b>L30+ IV:</b> "+ pokemon.attack + " | " + pokemon.defence + " | " + pokemon.stamina + " (" + Math.floor((pokemon.attack + pokemon.defence + pokemon.stamina)/45 * 100) + "%)<br />";
        movesetString = "<b>L30+ Moveset:</b><br />" + getMoveName(pokemon.move1) + " | " + getMoveName(pokemon.move2) + "<br />";
        cpString = "<b>L30+ CP:</b> " + pokemon.cp + " (Level: " + pokemon.level + ")<br /><br />";
    }

    let coordinates = pokemon.center.lat + ', ' + pokemon.center.lng;

    let exists = !!getCookie(`CC_${coordinates}`);

    let copyMarker = `<button id="copyMarker" data-exists="${exists}" data-remaining-time="${pokemon.remainingTime()}" data-coordinates="${coordinates}" style="margin:0 auto;display:block;color:${exists ? 'violet' : ''}" type="button" class="btn-primary"><i class="material-icons">content_copy</i></button>`;

    return '<b>' + getPokemonName(pokemon) + disguiseString + genderString + formString + "</b><br /><br />" + weatherString + ivString + movesetString + cpString + timeToString(pokemon.remainingTime()) + '<br /><br /><a target="_blank" href="https://maps.google.com/maps?q=' + pokemon.center.lat + ',' + pokemon.center.lng + '">Maps</a><br />'+ copyMarker;
}

$('#filter').css('display', 'block');
ga('send', 'event', 'Filter', 'click');
$("#close").css("left", 330)
$("#reset_btn").css("left", 330)
$("#deselect_all_btn").css("left", 330)
$("#select_all_btn").css("left", 330)

$("body").toggleClass("opaque-mode");

$(`<input id='weatherBoost' data-key=${keyType.boosted} type='checkbox'><label style='display:inline-block;margin-left:10px' for='weatherBoost'>Filter Boosted</label>`).insertAfter("#search_pokemon")

$("#filter_list_top").append("<form autocomplete='off' onsubmit='return handleFilter();' id='filterContainer' class='filter-form'></form>");

$("#filterContainer").append("<button type='submit' id='ccFilter' class='btn-primary'>Filter CC</button>");
$("#filterContainer").append(`<input id='minutesFilter' data-key=${keyType.minutesCC} type='number' style='height: 2rem; padding-left: 8px;' placeholder='Minutes'>`);
$("#filterContainer").append("<button id='copyCC' type='button' class='btn-primary'><i class='material-icons'>content_copy</i></button>");
$("#filterContainer").append("<button id='copyTextResult' type='button' class='btn-primary'><i class='material-icons'>copy_all</i></button>");

$("#filter_list_top").append("<form autocomplete='off' onsubmit='return onSubmitCopyNext(event);' id='formNext' class='filter-form'></form>");
$("#formNext").append("<button id='copyNext' type='submit' class='btn-primary'>CB Next : </button>");
$("#formNext").append(`<input id='quantityNext' data-key=${keyType.filterQuantityNext} type='number' style='height: 2rem; padding-left: 8px;width: 100px;' placeholder='Quantity' value='6'>`);

$("#filter_list_top").append("<form autocomplete='off' onsubmit='return onSubmitBestRoute(event);' id='formRoute' class='filter-form'></form>");
$("#formRoute").append("<button type='submit' class='btn-primary'>Best Route</button>");
$("#formRoute").append(`<input id='originCoordinates' data-key=${keyType.originCoordinates} type='text' style='height: 2rem; padding-left: 8px;' placeholder='Origin: e.g 40.742586,-74.000489'>`);
$("#formRoute").append(`<input id='kmPerHour' data-key=${keyType.kmPerHour} type='text' style='height: 2rem; padding-left: 8px;' placeholder='e.g. 9.3km/h'>`);


$("#formRoute").append("<button id='generateGPX' type='button' class='btn-primary'><i class='material-icons'>description</i></button>");

$("#filter_list_top").append("<div id='filter_result'></div>");

let loading =  `
<svg id="loading" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: transparent; display: block; shape-rendering: auto;" width="32px" height="32px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
    <circle cx="50" cy="50" fill="none" stroke="#689cc5" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"/>
    </circle>
</svg>`


$("#copyCC").click(function () {
    handleFilter();
    let resultCC = "";
    resultFilter.forEach(e => {
        resultCC += `${e.center.lat}, ${e.center.lng}\n`;
    });

    navigator.clipboard.writeText(resultCC);
});

$("#copyTextResult").click(function () {
    handleFilter();
    let resultText = "";
    resultFilter.forEach(e => {
        resultText += `${e.center.lat}, ${e.center.lng} - DSP:${Math.round(e.remainingTime()/60)}min\n`;
    });

    navigator.clipboard.writeText(resultText)
});

getMinutes();
getQuantityNext();
getCoordinates();
getKmPerHour();
getBoosted();

$('#generateGPX').click(function () {
    onSubmitBestRoute();
    buildGPX(pokeRoute);
});

window.enableLocalStorage = (element) => {
    $(element).change(function () {
        let value = "";
        switch(element.type){
            case 'text':
            case 'number':
                value = this.value; break;
            case 'checkbox':
                value = this.checked; break;
        }
        localStorage.setItem(element.dataset.key, value);
    });
}

window.setupInputs = () =>{
    let inputs = document.querySelectorAll("[data-key]")

    inputs.forEach(element => {
        enableLocalStorage(element)
    });
}

setupInputs();

window.reloadBoostedPokemon = async () => {
    
    let response = await fetch(`${window.location.origin}/${window.fetchAllURL}`);
    
    if(!response.ok)
        console.warn("something went wrong! On fetch");
    
    const data = await response.json();
    
    let boostedPokemonIds = data.pokemons.filter(e=> e.weather).map(e=> e.pokemon_id);
    boostedPokemonIds = Array.from(new Set(boostedPokemonIds));

    
    $(".filter_checkbox").hide()
    boostedPokemonIds.forEach(id => {
        
        let pokemonFilterElement = $('#checkbox_' + id).parent();
        pokemonFilterElement.show();
    });
}

$('#search_pokemon').on('input',debounce(function(e) {
    let searchString = e.target.value;
    if(searchString?.toLowerCase() !== 'boosted')
        return;

    reloadBoostedPokemon();
}, 250));

$('#filter').width(400)
$('#filter_result').get(0).scrollIntoView();
$("#ccFilter").click();

//STYLE
var css = '.btn-primary {  align-items: center;  background-color: #FFFFFF;  border: 1px solid rgba(0, 0, 0, 0.1);  border-radius: .25rem;  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;  box-sizing: border-box;  color: rgba(0, 0, 0, 0.85);  cursor: pointer;  display: inline-flex;  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif; justify-content: center; margin: 0;  min-height: 2.5rem;  padding: 0 1rem;  position: relative;  text-decoration: none;  transition: all 250ms;  user-select: none;  -webkit-user-select: none;  touch-action: manipulation;  vertical-align: baseline;  width: auto;}.btn-primary:hover,.btn-primary:focus {  border-color: rgba(0, 0, 0, 0.15);  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;  color: rgba(0, 0, 0, 0.65);}.btn-primary:hover {  transform: translateY(-1px);}.btn-primary:active {  background-color: #F0F0F1;  border-color: rgba(0, 0, 0, 0.15);  box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;  color: rgba(0, 0, 0, 0.65);  transform: translateY(0);}.opaque-mode{  filter: brightness(70%); } .filter-form { display: grid; grid-template-columns: 80px 155px 40px 40px; grid-gap: 8px; margin-bottom: 12px; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

head.appendChild(style);

style.type = 'text/css';
if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

//SCRIPTS
document.head.innerHTML += `<link href="https://fonts.googleapis.com/icon?family=Material+Icons"rel="stylesheet">`;

//Remove unnecessary elements
//$("#map").remove();
$("body").css("backgroundColor","#0d0d0d")