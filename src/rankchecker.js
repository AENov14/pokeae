window.getBestRankedList = () => {
	var arr = Array.from(document.querySelectorAll("tbody .table-primary ~ tr"), (e,index) => ({ pos : index+1, atk : +e.children[1].innerText.match(/^[^\d]*(\d+)/)[0], iv: e.children[1].innerText, lvl: e.children[3].innerText} ))

	return arr.reduce((prev,curr,index,array) => { if(curr.atk > prev[prev.length-1].atk) prev.push(curr);  return prev} , [arr[0]])
}

window.showBestRankedList = () => {
	var bestRanked = getBestRankedList().reduce((prev,curr,index,array) => 
		prev += `<tr> <td>${curr.pos}</td> <td>${curr.iv}</td><td>${curr.lvl}</td> </tr>` + (index === array.length ? '</table>' : '')
	, "<table style='width: 180px;'><tr><td>POS</td><td>IV</td><td>LVL</td></tr>");

	var div = document.getElementById("bestAtkContainer");
	div.innerHTML = bestRanked;
}

document.querySelector("#tableChrome .btn-group .btn-secondary:last-child")?.click()

document.getElementById('topList').scrollIntoView();

if(!document.getElementById("bestAtkContainer")){
	$("#tableChrome").append(`<button id='btnBestRank' onclick='showBestRankedList(this);'>Best Ranked</button><div id='bestAtkContainer'></div>`);
}

var div = document.getElementById("searchResults");
var observer = new window.MutationObserver((e) =>{
	var list = div.children;
	for (element of list) {
    	element.addEventListener('click', showBestRankedList, false);
	}
});

observer.observe(div,{
  subtree: true, 
  childList: true,
});

let leagueButtons = document.querySelectorAll(".greatLeague button, .ultraLeague button, .masterLeague button, .littleCup button");
leagueButtons.forEach(e => e.addEventListener('click', showBestRankedList, false));

setTimeout( () => showBestRankedList(), 500 )