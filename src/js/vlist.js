/* VIRTUAL LIST LOGIC */
(function (pageId, listId, templateId, itemClass) {
	"use strict"
	let pageElement = document.getElementById(pageId),
		listElement = document.getElementById(listId),
		virtualListWidget,
		listHelper;

	// Do preparatory works and adds event listeners
	pageElement.addEventListener("draw-vlist", function (event) {
		/* Get HTML element reference */
		let template = document.getElementById(templateId).innerHTML,
			JSON_DATA = event.detail.JSON_DATA,
			options = {
				dataLength: JSON_DATA.length,
				bufferSize: 50
			};
		if (pageElement.classList.contains("page-snaplistview")) {
			options.snap = {animate: "scale"};
		}

		virtualListWidget = tau.widget.Listview(listElement, options);

		/* Update list items */
		virtualListWidget.setListItemUpdater(function (li, newIndex) {
			let data = JSON_DATA[newIndex];

			li.innerHTML = template.replace(/\$\{([\w.]+)\}/ig,
				(pattern, field) => parser(pattern, field, data) );

			if (itemClass.length) {
				itemClass.forEach(function (value) {
					li.classList.add(value);
				});
			}
		});

		virtualListWidget.draw();
		console.log("created");
	});

	// Destroys and removes event listeners
	pageElement.addEventListener("destroy-vlist", function () {
		virtualListWidget.destroy(); // remove all children in the virtual list
		if (listHelper) listHelper.destroy();
		console.log("destroyed");
	});

	pageElement.addEventListener("update-vlist", function (event) {
		pageElement.dispatchEvent( new CustomEvent("destroy-vlist") );
		pageElement.dispatchEvent( new CustomEvent("draw-vlist", {detail: {"JSON_DATA":event.detail.JSON_DATA}}) );
		console.log("updated");
	});
})(pageId, listId, templateId, itemClass);

const SVG = {
	recurring: `<svg width="24" height="24" viewBox="0 0 12 12" class="recurring_icon"><path fill="currentColor" d="M2.784 4.589l.07.057 1.5 1.5a.5.5 0 01-.638.765l-.07-.057L3 6.207V7a2 2 0 001.85 1.995L5 9h2.5a.5.5 0 01.09.992L7.5 10H5a3 3 0 01-2.995-2.824L2 7v-.793l-.646.647a.5.5 0 01-.638.057l-.07-.057a.5.5 0 01-.057-.638l.057-.07 1.5-1.5a.5.5 0 01.638-.057zM7 2a3 3 0 013 3v.792l.646-.646a.5.5 0 01.765.638l-.057.07-1.5 1.5a.5.5 0 01-.638.057l-.07-.057-1.5-1.5a.5.5 0 01.638-.765l.07.057.646.646V5a2 2 0 00-1.85-1.995L7 3H4.5a.5.5 0 010-1z"></path></svg>`,
}

function parser(pattern, field, data) {
	// console.log("newIndex:", data, field);
	let obj = data;
	field.split('.').forEach( (i) => {obj = obj[i];} );

	if (field === "due.is_recurring" && obj == true) {return SVG.recurring;}
	else {return obj;}
}
