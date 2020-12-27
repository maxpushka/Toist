/* VIRTUAL LIST LOGIC */
(function (pageId, listId, templateId, itemClass) {
	"use strict"
	let pageElement = document.getElementById(pageId),
		listElement = document.getElementById(listId),
		virtualListWidget,
		listHelper;

	// Do preparatory works and adds event listeners
	pageElement.addEventListener("draw-list", function (event) {
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

		/* Add "New message" button to top of the list */
		console.log(`payload: ${event.detail.type} ${listId}`);
		if (event.detail.type == listId) {
			for (let key of ["new-msg", "saved-msgs"]) {
				let li = document.createElement("li");
				li.setAttribute("class", "ui-li-grid");

				let str = document.getElementById(key).innerHTML;
				let parser = new DOMParser();
				let newEl = parser.parseFromString(str, "text/html").body.childNodes;

				for (let i = 0; i < newEl.length; i++) {li.append(newEl[i]);}
				listElement.append(li);
				console.log(`appended length: ${newEl.length} ${newEl}`);
			}
		}

		virtualListWidget = tau.widget.Listview(listElement, options);

		/* Update list items */
		virtualListWidget.setListItemUpdater(function (li, newIndex) {
			let data = JSON_DATA[newIndex];

			li.innerHTML = template.replace(/\$\{([\w]+)\}/ig,
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
	pageElement.addEventListener("destroy-list", function () {
		virtualListWidget.destroy(); // remove all children in the virtual list
		if (listHelper) listHelper.destroy();
		console.log("destroyed");
	});

	pageElement.addEventListener("update-list", function (event) {
		pageElement.dispatchEvent( new CustomEvent("destroy-list") );
		pageElement.dispatchEvent( new CustomEvent("draw-list", {detail: {"JSON_DATA":event.detail.JSON_DATA, "type":"chat-vlist"}}) );
		console.log("updated");
	});
})(pageId, listId, templateId, itemClass);

let li_node = {}

function parser(pattern, field, data) {}
