/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"genommalab.portal.tendering/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
