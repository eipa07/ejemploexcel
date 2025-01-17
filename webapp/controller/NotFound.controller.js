sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("genommalab.portal.tendering.controller.NotFound", {
            onInit: function () {
            },
            onHome: function () {
                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._oRouter.navTo("RouteList", {}, false);
                location.reload();
            }
        });
    });
