sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/export/Spreadsheet",
    "sap/ui/core/BusyIndicator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Spreadsheet, BusyIndicator) {
        "use strict";

        return Controller.extend("genommalab.portal.tendering.controller.ProductDetail", {
            onInit: function () {
            },
            onAfterRendering: function () {
              if (this.getOwnerComponent().getModel("dataModel")) {

              } else {
                  this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                  this._oRouter.navTo("RouteNotFound", {}, false);
              }
            },
            onHome: function () {
                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._oRouter.navTo("RouteList", {}, false);
            },
            onDetail: function () {
                var sTorId = this.getOwnerComponent().getModel("dataModel").getProperty("/TorId");
                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._oRouter.navTo("RouteDetail", {TorId:sTorId}, false);
            },
            onExportProductDetail: function() {
                BusyIndicator.show(0);
                var sLocationId = this.getOwnerComponent().getModel("dataModel").getProperty("/LocationId");
                var sTitle = "Detalle del Producto" + " " + sLocationId + " " + ".xlsx"
                var oProducts = this.getOwnerComponent().getModel("dataModel").getProperty("/ProductDetail");
                new Spreadsheet({
                    workbook: {
                      columns: this.createColumnsProduct()
                    },
                    dataSource: oProducts,
                    fileName: sTitle,
                }).build();
                BusyIndicator.hide();
            },
            createColumnsProduct: function() {
                return [
                  {
                    label: "Nombre origen de carga",
                    property: "OriginName"
                  },
                  {
                    label: "Nombre destino de carga",
                    property: "DestinationName"
                  },
                  {
                    label: "Descripción de SKU",
                    property: "ItemDescr"
                  },
                  {
                    label: "Número de SKU",
                    property: "ProductId"
                  },
                  {
                    label: "Cajas",
                    property: "Boxes"
                  },
                  {
                    label: "Peso",
                    property: "Weight"
                  }
                ];
            }
        });
    });