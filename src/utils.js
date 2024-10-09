window.fetchAllURL = 'query2.php?mons=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549,550,551,552,553,554,555,556,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,575,576,577,578,579,580,581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,596,597,598,599,600,601,602,603,604,605,606,607,608,609,610,611,612,613,614,615,616,617,618,619,620,621,622,623,624,625,626,627,628,629,630,631,632,633,634,635,636,637,638,639,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,710,711,712,713,714,715,716,717,718,719,720,721,819,820,831,832,863,870,888,889&time=1639660946511&since=0';

window.keyType = {
	minutesCC: "minutesCC",
	filterQuantityNext: "filterQuantityNext",
	originCoordinates: "originCoordinates",
    kmPerHour: "kmPerHour",
    boosted: "weatherBoosted",
    chkGruntTypes: "chkGruntTypes",
    chkCCs: "chkCCs"
}

window.setCookie = (name, value, seconds) => {
    var expires = "";
    if (seconds) {
        var date = new Date();
        date.setTime(date.getTime() + (seconds * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

window.getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (let c of ca) {
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

window.deleteCookie = (name) => {
    document.cookie = name + '=; Max-Age=0'
}

window.distance = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
};

window.deg2rad = (deg) =>{
    return deg * (Math.PI/180)
}

window.getCheckboxes = () => {
    let values = document.cookie.split(/; */).filter((e) => e.startsWith("CC_")).map(key => key.split("=")[1])
    values.forEach(e => $(`[id='${e}']`).prop("checked", true))
}

window.getMinutes = () => {
    let item = +localStorage.getItem(keyType.minutesCC);
    let minutes = isNaN(item) ? 2 : item;
    $('#minutesFilter').val(minutes);
}

window.getQuantityNext = () => {
    let item = +localStorage.getItem(keyType.filterQuantityNext);
    let quantityNext = isNaN(item) ? 6 : item;
    $('#quantityNext').val(quantityNext);
}

window.getCoordinates = () => {
    let coordinates = localStorage.getItem(keyType.originCoordinates);
    $('#originCoordinates').val(coordinates);
}

window.getKmPerHour = () => {
    let kmPerHour = localStorage.getItem(keyType.kmPerHour);
    $('#kmPerHour').val(kmPerHour);
}

window.getBoosted = () => {
    $('#weatherBoost').prop('checked', localStorage.getItem(keyType.boosted) == 'true');
}

window.getChkGruntTypes = () => {
    let checked = localStorage.getItem(keyType.chkGruntTypes) == 'true';
    if(checked)
        $('#chkGruntTypes').click();
}

window.getChkCCs = () => {
    $('#chkCCs').prop('checked', localStorage.getItem(keyType.chkCCs) == 'true');
}

window.downloadGPX = (filename, text) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

window.buildGPX = (ccArray, name) => {
    let content = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><gpx version="1.1" creator="Hakai">`
    ccArray.forEach((e, i) => {
        content += `<wpt lat="${e[0]}" lon=" ${e[1]}"><name>${i+1}</name></wpt>`
    });
    content += "</gpx>"


    downloadGPX(name || "GPX Route.GPX", content);
}

Array.prototype.indexOfForArrays = function(search)
{
  var searchJson = JSON.stringify(search); // "[3,566,23,79]"
  var arrJson = this.map(JSON.stringify); // ["[2,6,89,45]", "[3,566,23,79]", "[434,677,9,23]"]

  return arrJson.indexOf(searchJson);
};

Number.prototype.toFixedNoRounding = function(n) {
    const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g")
    const a = this.toString().match(reg)[0];
    const dot = a.indexOf(".");
    if (dot === -1) { // integer, insert decimal dot and pad up zeros
        return a + "." + "0".repeat(n);
    }
    const b = n - (a.length - dot) + 1;
    return b > 0 ? (a + "0".repeat(b)) : a;
 }

 window.debounce = (func, wait) => {
    let timeout;
  
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
  
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

$("#close").css("left", 330)
$(".please").remove();
$("body").css("backgroundColor","#acacac")
$("#map").removeAttr('style');
$("#filter").css({'bottom': '', 'top': '48px'});
$('#overlay').hide();
$(document).on('click','#copyMarker',function (e) {

    let exists = JSON.parse(this.dataset.exists);
    let coordinates = this.dataset.coordinates;

    if(!exists) {
        let remainingTime = this.dataset.remainingTime;
        setCookie(`CC_${coordinates}`, `${coordinates}`, remainingTime)
        navigator.clipboard.writeText(coordinates)
        $(`[id='${coordinates}']`).prop("checked", true)
    }else {
        deleteCookie(`CC_${coordinates}`);
        navigator.clipboard.writeText("")
        $(`[id='${coordinates}']`).prop("checked", false)
    }
    
});