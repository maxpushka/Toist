"use strict";
const TOKEN = "";
const payload = '&sync_token=*&resource_types=["all"]';

function updateChatList() {
	const fetchURL = `https://api.todoist.com/sync/v8/sync?${TOKEN}${payload}`;

	/* Create processing element */
	let page = document.getElementById(pageId);
	let processingEl = document.createElement("div");
	processingEl.setAttribute("class", "ui-processing ui-processing-full-size");
	processingEl.setAttribute("id", "processing");
  page.append(processingEl);
  
  /* Get chatlist data from server */
  fetch(fetchURL)
    .then( response => {return response.json();} )
    .then( json => {
      console.log(`Received ${json.length} objects of type '${typeof(json)}'`);
      // const recieved = cache.concat(json.slice(0,5));
      // page.dispatchEvent( new CustomEvent("update-list", {detail: {"JSON_DATA": recieved, "type":"chat-vlist"}}) );
    })
    .catch( (error) => {
      console.log("Error: " + String(error));
      tau.openPopup("#failed-update");
    })
    .finally( () => processingEl.remove() );
    
}
