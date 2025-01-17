sap.ui.define([
    "sap/ui/core/mvc/Controller",
	  "sap/ui/model/Filter",
	  "sap/ui/model/FilterOperator",
	  "sap/ui/export/Spreadsheet",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Spreadsheet, BusyIndicator, MessageBox) {
        "use strict";

        return Controller.extend("genommalab.portal.tendering.controller.Detail", {
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
            onOpenDialog: function () {
                if(!this._oDetailProductDialog) {
                    this._oDetailProductDialog = sap.ui.xmlfragment("genommalab.portal.tendering.view.fragments.DetailProduct", this);
                    this.getView().addDependent(this._oDetailProductDialog);
                }
                this._oDetailProductDialog.open();
            },
            onCloseDialog: function () {
                this._oDetailProductDialog.close();
            },
            onPressItem: function (oEvent) {
                BusyIndicator.show(0);
                var that = this;
                var sTorId = this.getOwnerComponent().getModel("dataModel").getProperty("/TorId");
                var sBolNumber = oEvent.getSource().getBindingContext("dataModel").getObject().BolNumber;
                var sLocationId = oEvent.getSource().getBindingContext("dataModel").getObject().LocationId;
                this.getOwnerComponent().getModel("dataModel").setProperty("/LocationId", sLocationId);

                var oDataModel = new sap.ui.model.odata.ODataModel(
                    "/sap/opu/odata/sap/ZTM_TENDERING_DETAIL_SRV", {
                        json: true
                });

                var sPath = "/ProducDetailSet";
                oDataModel.read(sPath,{
                    filters: [
                        new Filter({
                            path: "BolNumber",
                            operator: FilterOperator.EQ,
                            value1: sBolNumber
                        }),
                        new Filter({
                            path: "LocationId",
                            operator: FilterOperator.EQ,
                            value1: sLocationId
                        })
                    ],
                    success: function (data, response) {
                        var oData = data;
                        that.getOwnerComponent().getModel("dataModel").setProperty("/ProductDetail", data.results);
                        BusyIndicator.hide();
                        that.oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                        that.oRouter.navTo("RouteProductDetail", {TorId:sTorId, LocationId:sLocationId}, true);
                    }.bind(this),
                    error: function (error) {
                        BusyIndicator.hide();
                        var sMsgError = error.message;
                        var sMsgTitle = error.response.statusCode + " - " + error.response.statusText;
                        MessageBox.show(sMsgError, {
                                icon:MessageBox.Icon.ERROR,
                                title: sMsgTitle,
                                emphasizedAction: "Cerrar",
                                onClose: function () {
                                    that._oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                    that._oRouter.navTo("RouteNotFound", {}, false);
                                }
                            }
                        );
                    }.bind(this)
                });
            },
            onAccept: function () {
              BusyIndicator.show(0);
              var that = this;
              var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
              var sReqNr = this.getOwnerComponent().getModel("dataModel").getData().Origin.ReqNr;
              var aBatch = [];
              var oDataModelBatch = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZTM_TENDERING_WORKLIST_SRV/", {
                  json: true,
                  async: true,
                  useBatch: false
              });
              var oReqNr = {
                  "ReqNr": sReqNr,
                  "Action": "Accept",
                  "Status": ""
              };
              aBatch.push(oDataModelBatch.createBatchOperation("/ActionWorklistSet", "POST", oReqNr));
              oDataModelBatch.addBatchChangeOperations(aBatch);
              oDataModelBatch.submitBatch(
                  function (data, response) {
                      if (data.__batchResponses[0].__changeResponses) {

                        if(data.__batchResponses[0].__changeResponses[0].data.Type == "S") {
                            var sViajesAceptados = oResourceBundle.getText("detailView.viajeaceptado");
                            var sViajes = oResourceBundle.getText("detailView.viajes");
                            var sResponsesLength =  sViajesAceptados;
                            BusyIndicator.hide();
                            MessageBox.show(sResponsesLength, {
                                icon:MessageBox.Icon.SUCCESS,
                                title: sViajes,
                                styleClass: "Center",
                                onClose: function () {
                                    that._oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                    that._oRouter.navTo("RouteList", {}, false);
                                }
                            });

                        } else if (data.__batchResponses[0].__changeResponses[0].data.Type == "E") {
                            var sViajesAceptados = oResourceBundle.getText("detailView.viajeaceptadoconerror");
                            var sViajes = oResourceBundle.getText("detailView.viajes");
                            var sDetail = data.__batchResponses[0].__changeResponses[0].data.Status;
                            var sResponsesLength =  sViajesAceptados;
                            BusyIndicator.hide();
                            MessageBox.show(sResponsesLength, {
                                icon:MessageBox.Icon.ERROR,
                                title: sViajes,
                                styleClass: "Center",
                                details: sDetail,
                                onClose: function () {
                                    that._oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                    that._oRouter.navTo("RouteList", {}, false);
                                    that.getView().getModel().refresh(true);
                                }
                            });
                        }

                      } else {
                          var oBatchResponseError = data.__batchResponses[0];
                          var sBatchMsgError = oBatchResponseError.message;
                          var sBatchTitleError = oBatchResponseError.response.statusCode + " - " + oBatchResponseError.response.statusText;
                          BusyIndicator.hide();
                          MessageBox.show(sBatchMsgError, {
                              icon:MessageBox.Icon.ERROR,
                              title: sBatchTitleError,
                              onClose: function () {
                              }
                          });
                      }
                  },
                  function (error) {
                      var sMsgError = error.message;
                      var sMsgTitleError = error.response.statusCode + " - " + error.response.statusText;
                      BusyIndicator.hide();
                      MessageBox.show(sMsgError, {
                          icon:MessageBox.Icon.ERROR,
                          title: sMsgTitleError,
                          onClose: function () {
                          }
                      });
                  }
              );
            },
            onReject: function () {
              BusyIndicator.show(0);
              var that = this;
              var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
              var sReqNr = this.getOwnerComponent().getModel("dataModel").getData().Origin.ReqNr;
              var aBatch = [];
              var oDataModelBatch = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZTM_TENDERING_WORKLIST_SRV/", {
                  json: true,
                  async: true,
                  useBatch: false
              });
              var oReqNr = {
                  "ReqNr": sReqNr,
                  "Action": "Reject",
                  "Status": ""
              };
              aBatch.push(oDataModelBatch.createBatchOperation("/ActionWorklistSet", "POST", oReqNr));
              oDataModelBatch.addBatchChangeOperations(aBatch);
              oDataModelBatch.submitBatch(
                  function (data, response) {
                      if (data.__batchResponses[0].__changeResponses) {

                        if(data.__batchResponses[0].__changeResponses[0].data.Type == "S") {
                            var sViajesAceptados = oResourceBundle.getText("detailView.viajerechazado");
                            var sViajes = oResourceBundle.getText("detailView.viajes");
                            var sResponsesLength =  sViajesAceptados;
                            BusyIndicator.hide();
                            MessageBox.show(sResponsesLength, {
                                icon:MessageBox.Icon.WARNING,
                                title: sViajes,
                                styleClass: "Center",
                                onClose: function () {
                                    that._oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                    that._oRouter.navTo("RouteList", {}, false);
                                }
                            });

                        } else if (data.__batchResponses[0].__changeResponses[0].data.Type == "E") {
                            var sViajesAceptados = oResourceBundle.getText("detailView.viajerechazadoconerror");
                            var sViajes = oResourceBundle.getText("detailView.viajes");
                            var sDetail = data.__batchResponses[0].__changeResponses[0].data.Status;
                            var sResponsesLength =  sViajesAceptados;
                            BusyIndicator.hide();
                            MessageBox.show(sResponsesLength, {
                                icon:MessageBox.Icon.ERROR,
                                title: sViajes,
                                styleClass: "Center",
                                details: sDetail,
                                onClose: function () {
                                    that._oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                    that._oRouter.navTo("RouteList", {}, false);
                                    that.getView().getModel().refresh(true);
                                }
                            });
                        }

                      } else {
                          var oBatchResponseError = data.__batchResponses[0];
                          var sBatchMsgError = oBatchResponseError.message;
                          var sBatchTitleError = oBatchResponseError.response.statusCode + " - " + oBatchResponseError.response.statusText;
                          BusyIndicator.hide();
                          MessageBox.show(sBatchMsgError, {
                              icon:MessageBox.Icon.ERROR,
                              title: sBatchTitleError,
                              onClose: function () {
                              }
                          });
                      }
                  },
                  function (error) {
                      var sMsgError = error.message;
                      var sMsgTitleError = error.response.statusCode + " - " + error.response.statusText;
                      BusyIndicator.hide();
                      MessageBox.show(sMsgError, {
                          icon:MessageBox.Icon.ERROR,
                          title: sMsgTitleError,
                          onClose: function () {
                          }
                      });
                  }
              );
            },
            onExportOrigin: function() {
                BusyIndicator.show(0);
                var sTorId = this.getOwnerComponent().getModel("dataModel").getProperty("/TorId");
                var sTitle = "Detalle del Origen" + " " + sTorId + " " + ".xlsx"
                var oOrigin = [];
                oOrigin.push(this.getOwnerComponent().getModel("dataModel").getProperty("/Origin"));
                new Spreadsheet({
                    workbook: {
                      columns: this.createColumnsOrigin()
                    },
                    dataSource: oOrigin,
                    fileName: sTitle,
                }).build();
                BusyIndicator.hide();
            },
            createColumnsOrigin: function() {
                return [
                  {
                    label: "Nombre origen de carga",
                    property: "OriginName"
                  },
                  {
                    label: "Dirección",
                    property: "Address"
                  },
                  {
                    label: "Cajas",
                    property: "Boxes"
                  },
                  {
                    label: "Peso",
                    property: "Weight"
                  },
                  {
                    label: "Fecha y hora de salida",
                    property: "DepartureDateO"
                  }
                ];
            },
            onExportDestiny: function() {
                BusyIndicator.show(0);
                var sTorId = this.getOwnerComponent().getModel("dataModel").getProperty("/TorId");
                var sTitle = "Detalle del Destino" + " " + sTorId + " " + ".xlsx"
                var oDestiny = this.getOwnerComponent().getModel("dataModel").getProperty("/Destiny");
                new Spreadsheet({
                    workbook: {
                      columns: this.createColumnsDestiny()
                    },
                    dataSource: oDestiny,
                    fileName: sTitle,
                }).build();
                BusyIndicator.hide();
            },
            createColumnsDestiny: function() {
                return [
                  {
                    label: "Nombre destino de carga",
                    property: "DestinationName"
                  },
                  {
                    label: "Dirección",
                    property: "Address"
                  },
                  {
                    label: "Cajas",
                    property: "Boxes"
                  },
                  {
                    label: "Peso",
                    property: "Weight"
                  },
                  {
                    label: "Fecha y hora de llegada",
                    property: "ArrivalDate"
                  }
                ];
            }
        });
    });