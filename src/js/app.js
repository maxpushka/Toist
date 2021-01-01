"use strict";

const BASE_URL = 'https://api.todoist.com/sync/v8/sync';
const TOKEN = '2ab5e4aaeafd1caa19c5cc2464f7ae12341a05f1';
const FULL_SYNC = 'sync_token=*&resource_types=[%22all%22]';

function update(type) {
  const fetchURL = `${BASE_URL}?token=${TOKEN}&${type}`;

	/* Create processing element */
	let page = document.getElementsByTagName("body")[0];
	let processingEl = document.createElement("div");
	processingEl.setAttribute("class", "ui-processing ui-processing-full-size");
  processingEl.setAttribute("id", "processing");
  page.append(processingEl);

  /* Get chatlist data from server */
  fetch(fetchURL)
    .then( response => {
      for (let [key, value] of response.headers) {
        console.log(`${key} = ${value}`);
      }
      return response.json();
    } )
    .then( json => {
      console.log("received json: ", json);
      for (let key in json) {
        localStorage.setItem( key, JSON.stringify(json[key]) );
      }

      const todolist_items = JSON.parse(localStorage.getItem("items")); // string from local storage -> json
      const inbox = todolist_items.filter(i => i.project_id == "2251947170"); // Inbox
      console.log("inbox: ", inbox);
      page.dispatchEvent( new CustomEvent("draw-vlist-main", {detail: {"pageId": "main", "JSON_DATA": inbox}}) );
    })
    .catch( error => {
      console.log("Error: " + String(error));
      tau.openPopup("#failed-update");
    })
    /* Remove processing element */
    .finally( () => {processingEl.remove();} );

}

function color(num) {
 const colors = [
  "#b8256f", "#db4035", "#ff9933", "#fad000", "#afb83b",
  "#7ecc49", "#299438", "#6accbc", "#158fad", "#14aaf5",
  "#96c3eb", "#4073ff", "#884dff", "#af38eb", "#eb96eb",
  "#e05194", "#ff8d85", "#808080", "#b8b8b8", "#ccac93"
 ];

 return colors[num-30];
}

update(FULL_SYNC);