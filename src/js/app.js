"use strict";

const SYNC_URL = 'https://api.todoist.com/sync/v8/sync';
const TOKEN = '2ab5e4aaeafd1caa19c5cc2464f7ae12341a05f1';
const FULL_SYNC = 'sync_token=*&resource_types=[%22all%22]';

function color(num) {
  // returns color of a project
  const colors = [
   "#b8256f", "#db4035", "#ff9933", "#fad000", "#afb83b",
   "#7ecc49", "#299438", "#6accbc", "#158fad", "#14aaf5",
   "#96c3eb", "#4073ff", "#884dff", "#af38eb", "#eb96eb",
   "#e05194", "#ff8d85", "#808080", "#b8b8b8", "#ccac93"
  ];
 
  return colors[num-30];
}

function update(type) {
  const fetchURL = `${SYNC_URL}?token=${TOKEN}&${type}`;

	/* Create processing element */
	let processingEl = document.createElement("div");
	processingEl.setAttribute("class", "ui-processing ui-processing-full-size");
  processingEl.setAttribute("id", "processing");
  document.getElementsByTagName("body")[0].append(processingEl);

  /* Get chatlist data from server */
  fetch(fetchURL)
    .then( response => {
      console.log("response.status: ", response.status);
      if (response.status == 200) {
         console.log(200);
        return response.json();}
      throw `${response.status} error`;
    })
    .then( json => {
      console.log("received json: ", json);
      for (let key in json) {
        localStorage.setItem( key, JSON.stringify(json[key]) );
      }
    })
    .catch( error => {
      console.log("Error: " + String(error));
      tau.openPopup("#failed-update");
    })
    /* Remove processing element */
    .finally( () => {processingEl.remove();} );

}

update(FULL_SYNC);