import './utils.js';

let resultFilter = [];
window.isMobile = navigator.userAgentData.mobile;

window.filter = (minTime, ...names) => {
    return pokestops.filter(ps => (grunts.filter(e => names.some(f => e.name == f)).flatMap(e => e.characters).indexOf(ps.invasion_character) != -1) && ps.remainingInvasionTime() > minTime * 60)
};

window.handleCheckbox = async (elem) => {
    if (elem.checked) {
        let secondsLeft = elem.dataset.remainingTime
        setCookie(`CC_${elem.value}`, `${elem.value}`, secondsLeft)
        await navigator.clipboard.writeText(elem.value)
        if (!isMobile) {
            await delay(300);
        }
    } else {
        deleteCookie(`CC_${elem.value}`);
        navigator.clipboard.writeText("")
    }
}

window.delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

window.handleFilter = () => {
    let textFilter = $(".filter_checkbox input:checked").toArray().flatMap(e => $(e).val());
    resultFilter = filter($("#minutesFilter").val(), ...textFilter).sort((a, b) => a.remainingInvasionTime() - b.remainingInvasionTime());

    let resultHTML = "";

    resultFilter.forEach((e, i) => {
        resultHTML += `<div class='filter_checkbox2'><input type='checkbox' data-position="${i}" onclick='handleCheckbox(this);' id='${e.lat}, ${e.lng}' value='${e.lat}, ${e.lng}' data-remaining-time="${e.remainingInvasionTime()}"> <label for='${e.lat}, ${e.lng}'>${e.lat}, ${e.lng} - DSP:${Math.round(e.remainingInvasionTime()/60)}min </label></div>`;
    });

    $("#filter_result").html("").append(resultHTML);

    getCheckboxes();
    
    hideShowCheckedCCs(document.getElementById("chkCCs"));
    
    return false;
}

getCheckboxes();

window.onSubmitCopyNext = async (event) => {
    event.preventDefault();

    handleFilter();
    let quantity = +$("#quantityNext").val();
    navigator.clipboard.writeText(`_____________________`)

    let checkboxes = $(".filter_checkbox2 > input:not(:checked)");

    for (let i = 0; i < checkboxes.length && i < quantity; i++) {

        let elem = checkboxes[i];

        elem.checked = true;
        await handleCheckbox(elem);
    }
    navigator.clipboard.writeText(`---------------------`);
}

window.infoWindowString = (pokestop) => {
  
    let gruntType = pokestop.invasionType();
    let gender = pokestop.gender();
  
    let genderString = "";
  
    if (gender == 1) {
      genderString = "Male ";
    }
    else if (gender == 2) {
      genderString = "Female ";
    }
  
    if (gruntType.toLowerCase() == 'npc') {
      gruntType = "NPC";
    }
    
    if (gruntType == 'arlo' || gruntType == 'cliff' || gruntType == 'sierra') {
      gruntType += " <strong>(Require a Rocket Radar to see)</strong>";
    }
    else if (gruntType == 'giovanni') {
      gruntType += " <strong>(Require a Super Rocket Radar to see)</strong>";
    }
      
    let endTime = "<br/><b>Ending in:</b> " + timeToString(pokestop.remainingInvasionTime());

    let coordinates = pokestop.lat + ', ' + pokestop.lng;

    let exists = !!getCookie(`CC_${coordinates}`);

    let copyMarker = `<button id="copyMarker" data-exists="${exists}" data-coordinates="${coordinates}" data-remaining-time="${pokestop.remainingInvasionTime()}" type="button" class="btn-primary" style="margin:0 auto;display:block;color:${exists ? 'violet' : ''}"><i class="material-icons">content_copy</i></button>`;

    return "<strong>Team Rocket has invaded!</strong><br/><br/>\<strong>Grunt Type: </strong>" + genderString + capitalizedFirstChar(gruntType) + "<br/>\<strong>Pókestop Name:</strong> " + pokestop.pokestop_name + endTime + "<br/><br/>\<a target='_blank' href='https://maps.google.com/maps?q=" + pokestop.lat + "," + pokestop.lng + "'>Maps</a><br />" + copyMarker;
}

window.addChkGruntTypes = () =>{

    $("#filter_list_top").prepend(`<input id='chkGruntTypes' data-key=${keyType.chkGruntTypes} type='checkbox' class='chk-btn' onchange='hideShowUncheckedGruntTypes(this);'><label style='display:inline-block;margin-bottom:10px' for='chkGruntTypes'>Hide Unchecked</label><br>`);    
}

window.addChkCCs = () =>{

    $(`<input id='chkCCs' data-key=${keyType.chkCCs} type='checkbox' onchange='onChangeCCsCheckbox(this);' class='chk-btn'><label style='display:inline-block;margin-bottom:10px' for='chkCCs'>Hide Checked</label><br>`).insertAfter("#formNext");
}

window.hideShowCheckedCCs = (element) =>{
    if(element?.checked){
        $(".filter_checkbox2 > input:checked + label").hide()
        $("#chkCCs + label").text("Show Checked")
    }
    else{
        $(".filter_checkbox2 > input:checked + label").show()
        $("#chkCCs + label").text("Hide Checked")
    }
}

window.onChangeCCsCheckbox = (element) =>{
    hideShowCheckedCCs(element);

    localStorage.setItem(keyType.chkCCs, element?.checked);
}

window.hideShowUncheckedGruntTypes = (element) =>{
    if(element.checked){
        $(".filter_checkbox > input:not(:checked) + label").hide()
        $("#chkGruntTypes + label").text("Show Unchecked")
    } else{
        $(".filter_checkbox > input:not(:checked) + label").show()
        $("#chkGruntTypes + label").text("Hide Unchecked")
    }
    
    localStorage.setItem(keyType.chkGruntTypes, element.checked);
}

$("body").toggleClass("opaque-mode");
$("#filter_list_top").append("<form autocomplete='off' onsubmit='return handleFilter();' id='filterContainer' class='filter-form'></form>");

$("#filterContainer").append("<button type='submit' id='ccFilter' class='btn-primary'>Filter CC</button>");
$("#filterContainer").append("<input id='minutesFilter' type='number' style='height: 2rem; padding-left: 8px;' placeholder='Minutes'>");
$("#filterContainer").append("<button id='copyCC' type='button' class='btn-primary'><i class='material-icons'>content_copy</i></button>");
$("#filterContainer").append("<button id='copyTextResult' type='button' class='btn-primary'><i class='material-icons'>copy_all</i></button>");

$("#filter_list_top").append("<form autocomplete='off' onsubmit='return onSubmitCopyNext(event);' id='formNext' class='filter-form'></form>");
$("#formNext").append("<button id='copyNext' type='submit' class='btn-primary'>CB Next : </button>");
$("#formNext").append("<input id='quantityNext' type='number' style='height: 2rem; padding-left: 8px;' placeholder='Quantity' value='6'>");

$("#filter_list_top").append("<div id='filter_result'></div>");

$("#copyCC").click(function () {
    handleFilter();
    let resultCC = "";
    resultFilter.forEach(e => {
        resultCC += `${e.lat}, ${e.lng}\n`;
    });

    navigator.clipboard.writeText(resultCC)
});

$("#copyTextResult").click(function () {
    handleFilter();
    let resultText = "";
    resultFilter.forEach(e => {
        resultText += `${e.lat}, ${e.lng} - DSP:${Math.round(e.remainingInvasionTime()/60)}min\n`;
    });

    navigator.clipboard.writeText(resultText)
});

$('#minutesFilter').change(function () {
    let minutesValue = this.value;
    localStorage.setItem(keyType.minutesCC, minutesValue);
});

getMinutes();

$('#quantityNext').change(function () {
    let quantityNext = this.value;
    localStorage.setItem("filterQuantityNext", quantityNext);
});

getQuantityNext();

$('#originCoordinates').change(function () {
    let coordinates = this.value;
    localStorage.setItem(keyType.originCoordinates, coordinates);
});

getCoordinates();

openFilter();

window.init = () =>{
    addChkGruntTypes();
    addChkCCs();
    getChkGruntTypes();
    getChkCCs();
    

    $('#filter').width(400)
    $('#filter_result').get(0).scrollIntoView();
    $("#ccFilter").click();
}

init();

//STYLE
var css = '.btn-primary {  align-items: center;  background-color: #FFFFFF;  border: 1px solid rgba(0, 0, 0, 0.1);  border-radius: .25rem;  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;  box-sizing: border-box;  color: rgba(0, 0, 0, 0.85);  cursor: pointer;  display: inline-flex;  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif; justify-content: center; margin: 0;  min-height: 2.5rem;  padding: 0 1rem;  position: relative;  text-decoration: none;  transition: all 250ms;  user-select: none;  -webkit-user-select: none;  touch-action: manipulation;  vertical-align: baseline;  width: auto;}.btn-primary:hover,.btn-primary:focus {  border-color: rgba(0, 0, 0, 0.15);  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;  color: rgba(0, 0, 0, 0.65);}.btn-primary:hover {  transform: translateY(-1px);}.btn-primary:active {  background-color: #F0F0F1;  border-color: rgba(0, 0, 0, 0.15);  box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;  color: rgba(0, 0, 0, 0.65);  transform: translateY(0);}.opaque-mode{  filter: brightness(70%); } .filter-form {     display: grid; grid-template-columns: 100px 100px 50px 50px; grid-gap: 8px; margin-bottom: 12px; } input.chk-btn { display: none; } input.chk-btn + label { cursor:pointer; background: #e7e7e7; color: black; border: none; padding: 7px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; } input.chk-btn + label:active, input.chk-btn:checked + label { background: #d77086; color: white; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;} .filter_checkbox2 { margin-bottom:10px }.filter_checkbox{ padding:0}',
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
