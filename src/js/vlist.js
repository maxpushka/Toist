/* VIRTUAL LIST LOGIC */
// список элементов -- достает pageId, listId через dataset
(function () {
	"use strict"

	const pagesList = document.getElementsByClassName("ui-page");
	Array.from(pagesList).forEach( (page) => {

		console.log(page.id, page.dataset.listId, page.dataset.templateId, page.dataset.itemClass);

		let pageId = page.id,
			listElement = document.getElementById(page.dataset.listId),
			templateId = page.dataset.templateId,
			itemClass = JSON.parse(page.dataset.itemClass),
			virtualListWidget,
			listHelper;

		// Do preparatory works and adds event listeners
		page.addEventListener(`draw-vlist-${pageId}`, function (event) {
			/* Get HTML element reference */
			let template = document.getElementById(templateId).innerHTML,
				JSON_DATA = event.detail.JSON_DATA,
				options = {
					dataLength: JSON_DATA.length,
					bufferSize: 100
				};
			if (page.classList.contains("page-snaplistview")) {
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

			console.log("created");
			virtualListWidget.draw();
		});

		// Destroys and removes event listeners
		page.addEventListener(`destroy-vlist-${pageId}`, function () {
			virtualListWidget.destroy(); // remove all children in the virtual list
			if (listHelper) listHelper.destroy();
			console.log("destroyed");
		});

		page.addEventListener(`update-vlist-${pageId}`, function (event) {
			console.log("updating page: ", pageId);
			page.dispatchEvent( new CustomEvent(`destroy-vlist-${pageId}`) );
			page.dispatchEvent( new CustomEvent(`draw-vlist-${pageId}`, {detail: {"JSON_DATA":event.detail.JSON_DATA}}) );
			console.log("updated");
		});

	});

	console.log("vlist event listeners created");
})();

const SVG = {
	recurring: `<svg width="24" height="24" viewBox="0 0 12 12" class="recurring_icon"><path fill="currentColor" d="M2.784 4.589l.07.057 1.5 1.5a.5.5 0 01-.638.765l-.07-.057L3 6.207V7a2 2 0 001.85 1.995L5 9h2.5a.5.5 0 01.09.992L7.5 10H5a3 3 0 01-2.995-2.824L2 7v-.793l-.646.647a.5.5 0 01-.638.057l-.07-.057a.5.5 0 01-.057-.638l.057-.07 1.5-1.5a.5.5 0 01.638-.057zM7 2a3 3 0 013 3v.792l.646-.646a.5.5 0 01.765.638l-.057.07-1.5 1.5a.5.5 0 01-.638.057l-.07-.057-1.5-1.5a.5.5 0 01.638-.765l.07.057.646.646V5a2 2 0 00-1.85-1.995L7 3H4.5a.5.5 0 010-1z"></path></svg>`,
}

function parser(pattern, field, data) {
	// console.log("newIndex data:", data, "field: ", field);
	let obj = data;
	field.split('.').forEach( (i) => {obj = obj[i];} );

	if (field === "due.is_recurring" && obj == true) {return SVG.recurring;}
	else {return obj;}
}
