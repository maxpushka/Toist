// Setting up objects for all extant vlists
const pagesList = document.getElementsByClassName("ui-page");
let mainPageObj = new function() {
	this.page = pagesList["main"];
	this.pageId = this.page.id;
	this.listElement = document.getElementById(this.page.dataset.listId);
	this.template = document.getElementById(this.page.dataset.templateId).innerHTML;
	this.itemClass = JSON.parse(this.page.dataset.itemClass);
	this.virtualListWidget = null;
	this.listHelper = null;
	this.JSON_DATA = function () {
		const query = document.getElementsByClassName("ui-page-active")[0].dataset.displayedPage;
		const items = JSON.parse(localStorage.getItem("items"));

		const inboxProjectId = JSON.parse(localStorage.getItem("user"))["inbox_project"];
		return items.filter(i => i.project_id == inboxProjectId);
	};
	this.JSON_FLEX = function () {};
};
let projectsPageObj = new function() {
	this.page = pagesList["projects-page"];
	this.pageId = this.page.id;
	this.listElement = document.getElementById(this.page.dataset.listId);
	this.template = document.getElementById(this.page.dataset.templateId).innerHTML;
	this.itemClass = JSON.parse(this.page.dataset.itemClass);
	this.virtualListWidget = null;
	this.listHelper = null;
	this.JSON_DATA = function () {return JSON.parse(localStorage.getItem("projects"));}
};
const vlistCollection = [mainPageObj, projectsPageObj];

/* VIRTUAL LIST LOGIC */
(function (vlistCollection) {
	"use strict";

	vlistCollection.forEach( (pageObj) => {

		console.log(pageObj.pageId, pageObj.page.dataset.listId, pageObj.page.dataset.templateId, pageObj.page.dataset.itemClass);

		// Do preparatory works and adds event listeners
		pageObj.page.addEventListener(`pagebeforeshow`, function () {
			/* Get HTML element reference */
			const JSON_DATA = pageObj.JSON_DATA(),
				options = {
					dataLength: JSON_DATA.length,
					bufferSize: 100
				};
			if (pageObj.page.classList.contains("page-snaplistview")) {
				options.snap = {animate: "scale"};
			}

			pageObj.virtualListWidget = tau.widget.Listview(pageObj.listElement, options);

			/* Update list items */
			pageObj.virtualListWidget.setListItemUpdater(function (li, newIndex) {
				let data = JSON_DATA[newIndex];

				li.innerHTML = pageObj.template.replace(/\$\{([\w.]+)\}/ig,
					(pattern, field) => parser(pattern, field, data) );

				if (pageObj.itemClass.length) {
					pageObj.itemClass.forEach(function (value) {
						li.classList.add(value);
					});
				}
			});

			console.log("created");
			console.log("virtualListWidget in draw:", pageObj.virtualListWidget);
			pageObj.virtualListWidget.draw();
		});

		// Destroys and removes event listeners
		console.log("virtualListWidget before destroy:", pageObj.virtualListWidget);
		pageObj.page.addEventListener(`pagehide`, function (pageObj) {
			console.log("virtualListWidget in destroy:", pageObj.virtualListWidget);
			pageObj.virtualListWidget.destroy; // remove all children in the virtual list
			if (pageObj.listHelper) pageObj.listHelper.destroy();
			console.log("destroyed");
		});

		pageObj.page.addEventListener("update-vlist", function () {
			pageObj.page.dispatchEvent( new Event("pagehide") );
			pageObj.page.dispatchEvent( new Event("pagebeforeshow") );
		});

	});

	const SVG = {
		recurring: `<svg width="24" height="24" viewBox="0 0 12 12" class="recurring_icon"><path fill="currentColor" d="M2.784 4.589l.07.057 1.5 1.5a.5.5 0 01-.638.765l-.07-.057L3 6.207V7a2 2 0 001.85 1.995L5 9h2.5a.5.5 0 01.09.992L7.5 10H5a3 3 0 01-2.995-2.824L2 7v-.793l-.646.647a.5.5 0 01-.638.057l-.07-.057a.5.5 0 01-.057-.638l.057-.07 1.5-1.5a.5.5 0 01.638-.057zM7 2a3 3 0 013 3v.792l.646-.646a.5.5 0 01.765.638l-.057.07-1.5 1.5a.5.5 0 01-.638.057l-.07-.057-1.5-1.5a.5.5 0 01.638-.765l.07.057.646.646V5a2 2 0 00-1.85-1.995L7 3H4.5a.5.5 0 010-1z"></path></svg>`,
	}

	function parser(pattern, field, data) {
		// console.log("newIndex data:", data, "field: ", field);
		let obj = data;
		field.split('.').forEach( (i) => {obj = obj[i];} );
	
		if (field === "due.is_recurring") {
			if (obj == true) return SVG.recurring;
			else return '';
		}
		else return obj;
	}

	console.log("vlist event listeners created");
}(vlistCollection));

