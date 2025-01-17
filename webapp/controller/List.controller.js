sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, MessageBox, BusyIndicator, MessageToast) {
        "use strict";

        return Controller.extend("genommalab.portal.tendering.controller.List", {
            onInit: function () {
                BusyIndicator.show(0);
                var that = this;
                var oDataModel = new sap.ui.model.odata.ODataModel(
                                    "/sap/opu/odata/sap/ZTM_TENDERING_WORKLIST_SRV", {
                                        json: true
                                });
                var oModel = new JSONModel();
                this.getOwnerComponent().setModel(oModel, "dataModel");
                this.getOwnerComponent().getModel("dataModel").setProperty("/inicio", "X");
                oDataModel.read("/ResponseCodeSet", {
                    success: function (odata) {
                        if (odata.results.length > 0) {
                            that.getOwnerComponent().getModel("dataModel").setProperty("/ResponseCodeSet", odata.results);
                        }
                        BusyIndicator.hide();
                    },
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
                    }
                });
            },
            onBeforeRebindTable: function (oEvent) {
                var oBindingParams = oEvent.getParameter("bindingParams");
                var oSmartFilter = this.getView().byId("L_SmartFilterBar_01");
                var aFilter;

                // ResponseCode
                var sResponseCode = oSmartFilter.getControlByKey("ResponseCode");
                if (sResponseCode)
                    var sResponsekey = sResponseCode._getSelectedItemText();
                if (sResponsekey) {
                    aFilter = new Filter("ResponseCode", FilterOperator.EQ, sResponsekey);
                    oBindingParams.filters.push(aFilter);
                }
                /*
                // EntryDate
                var oEntryDate = oSmartFilter.getControlByKey("EntryDate");
                if (oEntryDate) {
                    var sEntryDateValue = oEntryDate.getValue();
                    //var sEntryDate1 = sEntryDateValue + " 00:00:00";
                    //var sEntryDate2 = sEntryDateValue + " 23:59:59";
                }
                if (sEntryDateValue) {
                    aFilter = new Filter({
                        path: "EntryDate", 
                        operator: FilterOperator.BT,
                        value1: sEntryDate1,
                        value2: sEntryDate2
                    });
                    oBindingParams.filters.push(aFilter);
                }
                // ReqStartDatetimeC
                var oReqStartDatetimeC = oSmartFilter.getControlByKey("ReqStartDatetimeC");
                if(oReqStartDatetimeC) {
                    var sReqStartDatetimeCValue = oReqStartDatetimeC.getValue();
                    var sReqStartDatetimeC1 = sReqStartDatetimeCValue + " 00:00:00";
                    var sReqStartDatetimeC2 = sReqStartDatetimeCValue + " 23:59:59";
                }
                if(sReqStartDatetimeCValue) {
                    aFilter = new Filter({
                        path: "ReqStartDatetimeC", 
                        operator: FilterOperator.BT,
                        value1: sReqStartDatetimeC1,
                        value2: sReqStartDatetimeC2
                    });
                    oBindingParams.filters.push(aFilter);
                }
                // RespDueDtimeC
                var oRespDueDtimeC = oSmartFilter.getControlByKey("RespDueDtimeC");
                if(oRespDueDtimeC) {
                    var sRespDueDtimeCValue = oRespDueDtimeC.getValue();
                    var sRespDueDtimeC1 = sRespDueDtimeCValue + " 00:00:00";
                    var sRespDueDtimeC2 = sRespDueDtimeCValue + " 23:59:59";
                }
                if(sRespDueDtimeCValue) {
                    aFilter = new Filter({
                        path: "RespDueDtimeC", 
                        operator: FilterOperator.BT,
                        value1: sRespDueDtimeC1,
                        value2: sRespDueDtimeC2
                    });
                    oBindingParams.filters.push(aFilter);
                }
                // DepartDate
                var oDepartDate = oSmartFilter.getControlByKey("DepartDate");
                if(oDepartDate) {
                    var sDepartDateValue = oDepartDate.getValue();
                }
                if(sDepartDateValue) {
                    aFilter = new Filter({
                        path: "DepartDate", 
                        operator: FilterOperator.EQ,
                        value1: sDepartDateValue
                    });
                    oBindingParams.filters.push(aFilter);
                }
                // ApptDate
                var oApptDate = oSmartFilter.getControlByKey("ApptDate");
                if(oApptDate) {
                    var sApptDateValue = oApptDate.getValue()
                }
                if(sApptDateValue) {
                    aFilter = new Filter({
                        path: "ApptDate", 
                        operator: FilterOperator.EQ,
                        value1: sApptDateValue
                    });
                    oBindingParams.filters.push(aFilter); 
                }
                // DepartTime
                var oDepartTime = oSmartFilter.getControlByKey("DepartTime");
                if(oDepartTime) {
                    var sDepartTime = oDepartTime.getValue();
                }
                if(sDepartTime) {
                    aFilter = new Filter({
                        path: "DepartTime", 
                        operator: FilterOperator.EQ,
                        value1: sDepartTime
                    });
                    oBindingParams.filters.push(aFilter); 
                }
                // ApptTime
                var oApptDate = oSmartFilter.getControlByKey("ApptTime");
                if(oApptDate) {
                    var sApptDate = oApptDate.getValue();
                }
                if(sApptDate) {
                    aFilter = new Filter({
                        path: "ApptTime", 
                        operator: FilterOperator.EQ,
                        value1: sApptDate
                    });
                    oBindingParams.filters.push(aFilter); 
                }
                */
            },
            onSort: function () {
                this.getView().byId("L_SmartTable_01").openPersonalisationDialog("Sort");
            },
            onDetail: function (oEvent) {
                BusyIndicator.show(0);
                var that = this;
                var sPathReqnr = oEvent.getSource().getBindingContext().getPath();
                var sReqNr = this.byId("L_SmartTable_01").getModel().getProperty(sPathReqnr).ReqNr
                var sTorId = oEvent.getSource().getText();
                this.getOwnerComponent().getModel("dataModel").setProperty("/TorId", sTorId);
                var oDataModel = new sap.ui.model.odata.ODataModel(
                    "/sap/opu/odata/sap/ZTM_TENDERING_DETAIL_SRV", {
                        json: true
                });
                var sPath = "/bolDetailSet";
                oDataModel.read(sPath,{
                    urlParameters: {
                        "$expand": "NavlocDetailSet"
                    },
                    filters: [
                        new Filter({
                            path: "BolNumber",
                            operator: FilterOperator.EQ,
                            value1: sTorId
                        }),
                        new Filter({
                            path: "ReqNr",
                            operator: FilterOperator.EQ,
                            value1: sReqNr
                        })
                    ],
                    success: function (data, response) {
                        that.getOwnerComponent().getModel("dataModel").setProperty("/Origin", data.results[0]);
                        that.getOwnerComponent().getModel("dataModel").setProperty("/Destiny", data.results[0].NavlocDetailSet.results);
                        BusyIndicator.hide();
                        that.oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                        that.oRouter.navTo("RouteDetail", {TorId:sTorId}, false);
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
            onOpenDialogBP: function () {
                if(!this.oBPDialog) {
                    this.oBPDialog = sap.ui.xmlfragment("genommalab.portal.tendering.view.fragments.BPDialog", this);
                    this.getView().addDependent(this.oBPDialog);
                }
                this.oBPDialog.open();
            },
            onCloseDialogBP: function () {
                this.onCleanBP();
                this.oBPDialog.close();
            },
            onCreateBP: function () {
                this.onCloseDialogBP();
                new sap.m.MessageToast.show("BP Creado");
                this.onOpenDialogRFC();
            },
            onCleanBP: function () {
                var oCore = sap.ui.getCore();
                oCore.byId("BPD_Input_01").setValue("");
                oCore.byId("BPD_Input_02").setValue("");
                oCore.byId("BPD_Input_03").setValue("");
                oCore.byId("BPD_Input_04").setValue("");
                oCore.byId("BPD_Input_05").setValue("");
                oCore.byId("BPD_Input_06").setValue("");
                oCore.byId("BPD_Input_07").setValue("");
                oCore.byId("BPD_Input_08").setValue("");
                oCore.byId("BPD_Input_09").setValue("");
            },
            onOpenDialogRFC: function () {
                if(!this.oRFCDialog) {
                    this.oRFCDialog = sap.ui.xmlfragment("genommalab.portal.tendering.view.fragments.RFCDialog", this);
                    this.getView().addDependent(this.oRFCDialog);
                }
                this.oRFCDialog.open();
            },
            onCloseDialogRFC: function () {
                var oCore = sap.ui.getCore();
                oCore.byId("RFCD_Input_04").setValue("");
                oCore.byId("RFCD_Input_04").setValueState("None");
                oCore.byId("RFCD_Input_05").setValue("");
                oCore.byId("RFCD_Input_05").setValueState("None");
                oCore.byId("RFCD_Input_06").setValue("");
                oCore.byId("RFCD_Input_06").setValueState("None");
                oCore.byId("RFCD_Input_07").setValue("");
                oCore.byId("RFCD_Input_07").setValueState("None");
                this.oRFCDialog.close();
            },
            onApprove: function () {
                BusyIndicator.show(0);
                var that = this;
                var sReqNr = "";
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var oSelectedIndices = this.getView().byId("L_Table_01").getSelectedIndices();
                if(oSelectedIndices.length > 0) {
                    var aBatch = [];
                    var oDataModelBatch = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZTM_TENDERING_WORKLIST_SRV/", {
                        json: true,
                        async: true,
                        useBatch: false
                    });
                    oSelectedIndices.forEach(function (currentValue){
                        sReqNr = that.getView().byId("L_Table_01").getContextByIndex(currentValue).getObject().ReqNr;
                        var oReqNr = {
                            "ReqNr": sReqNr,
                            "Action": "Accept",
                            "Status": ""
                        };
                        aBatch.push(oDataModelBatch.createBatchOperation("/ActionWorklistSet", "POST", oReqNr));
                    });
                    oDataModelBatch.addBatchChangeOperations(aBatch);
                    oDataModelBatch.submitBatch(
                        function (data, response) {
                            if (data.__batchResponses[0].__changeResponses) {

                                var sMessageError = "";
                                var iMessageError = 0;
                                var iMessageSuccess = 0;
                                var aChangeResponses = data.__batchResponses[0].__changeResponses;
                                aChangeResponses.forEach( function (currentValue, index) {
                                    if (aChangeResponses[index].data.Type == "S") {
                                        iMessageSuccess++;
                                    } else if (aChangeResponses[index].data.Type == "E") {
                                        iMessageError++;
                                        sMessageError = sMessageError + " " + aChangeResponses[index].data.Status + "<br>";
                                    }
                                });

                                BusyIndicator.hide();

                                if (sMessageError != "") {
                                    var sViajesAceptadosError = oResourceBundle.getText("listView.viajesaceptadoserror");
                                    MessageBox.show(sViajesAceptadosError + " " + iMessageError, {
                                        icon:MessageBox.Icon.ERROR,
                                        title: "Error",
                                        styleClass: "Center",
                                        details: sMessageError,
                                        onClose: function () {
                                            that.getView().getModel().refresh(true);
                                        }
                                    });
                                }

                                if (iMessageSuccess > 0) {
                                    var sViajesAceptados = oResourceBundle.getText("listView.viajesaceptados");
                                    var sViajes = oResourceBundle.getText("listView.viajes");
                                    var sResponsesLength =  sViajesAceptados + " " + iMessageSuccess;
                                    MessageBox.show(sResponsesLength, {
                                        icon:MessageBox.Icon.SUCCESS,
                                        title: sViajes,
                                        styleClass: "Center",
                                        onClose: function () {
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
                                        that.getView().getModel().refresh(true);
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
                } else {
                    BusyIndicator.hide();
                    var sMsgSeleccionarElemento = oResourceBundle.getText("listView.seleccionarelemento");
                    MessageBox.information(sMsgSeleccionarElemento);
                }
            },
            onReject: function () {
                BusyIndicator.show(0);
                var that = this;
                var sReqNr = "";
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var oSelectedIndices = this.getView().byId("L_Table_01").getSelectedIndices();
                if(oSelectedIndices.length > 0) {
                    var aBatch = [];
                    var oDataModelBatch = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZTM_TENDERING_WORKLIST_SRV/", {
                        json: true,
                        async: true,
                        useBatch: false
                    });
                    oSelectedIndices.forEach(function (currentValue){
                        sReqNr = that.getView().byId("L_Table_01").getContextByIndex(currentValue).getObject().ReqNr;
                        var oReqNr = {
                            "ReqNr": sReqNr,
                            "Action": "Reject",
                            "Status": ""
                        };
                        aBatch.push(oDataModelBatch.createBatchOperation("/ActionWorklistSet", "POST", oReqNr));
                    });
                    oDataModelBatch.addBatchChangeOperations(aBatch);
                    oDataModelBatch.submitBatch(
                        function (data, response) {
                            if (data.__batchResponses[0].__changeResponses) {

                                var sMessageError = "";
                                var iMessageError = 0;
                                var iMessageSuccess = 0;
                                var aChangeResponses = data.__batchResponses[0].__changeResponses;
                                aChangeResponses.forEach( function (currentValue, index) {
                                    if (aChangeResponses[index].data.Type == "S") {
                                        iMessageSuccess++;
                                    } else if (aChangeResponses[index].data.Type == "E") {
                                        iMessageError++;
                                        sMessageError = sMessageError + " " + aChangeResponses[index].data.Status + "<br>";
                                    }
                                });

                                BusyIndicator.hide();

                                if (sMessageError != "") {
                                    var sViajesAceptadosError = oResourceBundle.getText("listView.viajesrechazadoserror");
                                    MessageBox.show(sViajesAceptadosError + " " + iMessageError, {
                                        icon:MessageBox.Icon.ERROR,
                                        title: "Error",
                                        styleClass: "Center",
                                        details: sMessageError,
                                        onClose: function () {
                                            that.getView().getModel().refresh(true);
                                        }
                                    });
                                }

                                if (iMessageSuccess > 0) {
                                    var sViajesAceptados = oResourceBundle.getText("listView.viajesrechazados");
                                    var sViajes = oResourceBundle.getText("listView.viajes");
                                    var sResponsesLength =  sViajesAceptados + " " + iMessageSuccess;
                                    MessageBox.show(sResponsesLength, {
                                        icon:MessageBox.Icon.SUCCESS,
                                        title: sViajes,
                                        styleClass: "Center",
                                        onClose: function () {
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
                } else {
                    BusyIndicator.hide();
                    var sMsgSeleccionarElemento = oResourceBundle.getText("listView.seleccionarelemento");
                    MessageBox.information(sMsgSeleccionarElemento);
                }
            },
            onSearchRFC: function (oEvent) {
                BusyIndicator.show(0);
                var that = this;
                var sRFCInput = oEvent.getSource().getValue();
                var sPath = oEvent.getSource().getBindingContext().getPath();
                var sTorId = this.byId("L_SmartTable_01").getModel().getProperty(sPath).TorId;
                var sRFC = oEvent.getSource().getValue();
                var oDataModel = new sap.ui.model.odata.ODataModel(
                                    "/sap/opu/odata/sap/ZTM_TENDERING_WORKLIST_SRV", {
                                        json: true
                                });
                var sPath = "/DriverSet('"+ sRFC +"')";
                oDataModel.read(sPath, {
                    success: function (data, response) {
                        that.getOwnerComponent().getModel("dataModel").setProperty("/TorIdForRFC", sTorId);
                        that.getOwnerComponent().getModel("dataModel").setProperty("/RFC", data);
                        if (data.Role == "") {
                            BusyIndicator.hide();
                            that._putRole(oDataModel ,sRFC);
                            this.onOpenDialogRFC(sTorId);
                        } else {
                            BusyIndicator.hide();
                            this.onOpenDialogRFC(sTorId);
                        }
                    }.bind(this),
                    error: function (error) {
                        BusyIndicator.hide();
                        this.onOpenDialogBP();
                        sap.ui.getCore().byId("BPD_Input_01").setValue(sRFCInput);
                    }.bind(this)
                });
            },
            _putRole: function (oDataModel, sRFC) {
                BusyIndicator.show(0);
                var that = this;
                var oBody = {
                    "Role": "TM0001"
                }
                var sPath = "/DriverSet('"+ sRFC +"')";
                oDataModel.update(sPath, oBody, {
                    success: function (data, response) {
                        BusyIndicator.hide();
                        MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("bpdialog.role"));
                    }.bind(this),
                    error: function (error) {
                        BusyIndicator.hide();
                        MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("bpdialog.noRole"));
                    }.bind(this)
                });
            },
            _ValidateUpdateTracto: function () {
                var oCore = sap.ui.getCore();
                var sTorId = oCore.byId("RFCD_Text_TorId").getText();
                var sRFC = oCore.byId("RFCD_Input_01").getText();
                var sPlacasTracto = oCore.byId("RFCD_Input_04").getValue();
                var sPlacasCaja = oCore.byId("RFCD_Input_05").getValue();
                var sEconomicoTracto = oCore.byId("RFCD_Input_06").getValue();
                var sEconomicoCaja = oCore.byId("RFCD_Input_07").getValue();

                sPlacasTracto ? oCore.byId("RFCD_Input_04").setValueState("None") : oCore.byId("RFCD_Input_04").setValueState("Error");
                sPlacasCaja ? oCore.byId("RFCD_Input_05").setValueState("None") : oCore.byId("RFCD_Input_05").setValueState("Error");
                sEconomicoTracto ? oCore.byId("RFCD_Input_06").setValueState("None") : oCore.byId("RFCD_Input_06").setValueState("Error");
                sEconomicoCaja ? oCore.byId("RFCD_Input_07").setValueState("None") : oCore.byId("RFCD_Input_07").setValueState("Error");

                if (sPlacasTracto && sPlacasCaja && sEconomicoTracto && sEconomicoCaja) {
                    var oBody = {
                        "TorId": sTorId,
                        "RFC": sRFC,
                        "PlateVehicle": sPlacasTracto,
                        "PlateTrailer": sPlacasCaja,
                        "EconomicVehicle": sEconomicoTracto,
                        "EconomicTrailer": sEconomicoCaja
                    };
                    return oBody;
                }

            },
            onUpdateTracto: function () {
                var oBody = this._ValidateUpdateTracto();
                if (oBody) {
                    BusyIndicator.show(0);
                    var that = this;
                    var oDataModel = new sap.ui.model.odata.ODataModel(
                                        "/sap/opu/odata/sap/ZTM_TENDERING_WORKLIST_SRV", {
                                            json: true
                                    });
                    var sPath = "/FreightOrderSet('" + oBody.TorId + "')";
                    oDataModel.update(sPath, oBody, {
                        success: function (data, response) {
                            BusyIndicator.hide();
                            that.onCloseDialogRFC();
                            var sMsgSuccess = that.getView().getModel("i18n").getResourceBundle().getText("bpdialog.viajeactualizado");
                            var sMsgTitleSuccess = that.getView().getModel("i18n").getResourceBundle().getText("bpdialog.viaje");
                            MessageBox.show(sMsgSuccess, {
                                icon:MessageBox.Icon.SUCCESS,
                                title: sMsgTitleSuccess,
                                emphasizedAction: "Cerrar",
                                onClose: function () {
                                    that.getView().getModel().refresh(true);
                                }
                            });
                        }.bind(this),
                        error: function (error) {
                            BusyIndicator.hide();
                            that.onCloseDialogRFC();
                            var sMsgError = JSON.parse(error.response.body).error.message.value;
                            MessageBox.show(sMsgError, {
                                icon:MessageBox.Icon.ERROR,
                                title: "Error",
                                emphasizedAction: "Cerrar",
                                onClose: function () {
                                }
                            });
                        }.bind(this)
                    });
                }
            },
            onValidatePassword: function () {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var sMsg8Caracteres = oResourceBundle.getText("bpdialog.eigthcaracteres");
                var sMsgNoCoinciden = oResourceBundle.getText("bpdialog.nocoinciden");
                var sPassword = sap.ui.getCore().byId("BPD_Input_08").getValue();
                var sConfirmPassword = sap.ui.getCore().byId("BPD_Input_09").getValue();
                sPassword.length < 8 ? sap.ui.getCore().byId("BPD_Input_08").setValueState("Error").setValueStateText(sMsg8Caracteres) : sap.ui.getCore().byId("BPD_Input_08").setValueState("None");
                sConfirmPassword.length < 8 ? sap.ui.getCore().byId("BPD_Input_09").setValueState("Error").setValueStateText(sMsg8Caracteres) : sap.ui.getCore().byId("BPD_Input_09").setValueState("None");
                sPassword === sConfirmPassword ? sap.ui.getCore().byId("BPD_Input_09").setValueState("None") : sap.ui.getCore().byId("BPD_Input_09").setValueState("Error").setValueStateText(sMsgNoCoinciden);
            },
            _ValidateCreateBP: function () {
                var oCore = sap.ui.getCore();
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var sMsg8Caracteres = oResourceBundle.getText("bpdialog.eigthcaracteres");
                var sMsgNoCoinciden = oResourceBundle.getText("bpdialog.nocoinciden");
                var sRFC = oCore.byId("BPD_Input_01").getValue();
                var sNombre = oCore.byId("BPD_Input_02").getValue();
                var sApellido = oCore.byId("BPD_Input_03").getValue();
                var sTelefono = oCore.byId("BPD_Input_04").getValue();
                var sTelefonoEmergencia = oCore.byId("BPD_Input_05").getValue();
                var sTipoSangre = oCore.byId("BPD_Input_06").getValue();
                var sCorreo = oCore.byId("BPD_Input_07").getValue();
                var sContrasena = oCore.byId("BPD_Input_08").getValue();
                var sConfirmarContrasena = oCore.byId("BPD_Input_09").getValue();

                if (sContrasena.length >= 8 && sConfirmarContrasena.length >= 8) {
                    if (sContrasena === sConfirmarContrasena) {
                        if (sRFC && sNombre && sApellido && sTelefono && sTelefonoEmergencia && sTipoSangre && sCorreo) {
                            sap.ui.getCore().byId("BPD_Input_01").setValueState("None");
                            sap.ui.getCore().byId("BPD_Input_02").setValueState("None");
                            sap.ui.getCore().byId("BPD_Input_03").setValueState("None");
                            sap.ui.getCore().byId("BPD_Input_04").setValueState("None");
                            sap.ui.getCore().byId("BPD_Input_05").setValueState("None");
                            sap.ui.getCore().byId("BPD_Input_06").setValueState("None");
                            sap.ui.getCore().byId("BPD_Input_07").setValueState("None");
                            var oBody = {
                                "RFC": sRFC,
                                "FirstName": sNombre,
                                "LastName" : sApellido,
                                "FullName": "",
                                "Pais": "MX",
                                "Tel": sTelefono,
                                "EMail": sCorreo,
                                "EmergPhone": sTelefonoEmergencia,
                                "BloodType": sTipoSangre,
                                "Role": "TM0001",
                                "TaxType": "MX1",
                                "Pass": sConfirmarContrasena,
                                "Partner": ""
                            }
                            return oBody;
                        } else {
                            sRFC ? sap.ui.getCore().byId("BPD_Input_01").setValueState("None") : sap.ui.getCore().byId("BPD_Input_01").setValueState("Error");
                            sNombre ? sap.ui.getCore().byId("BPD_Input_02").setValueState("None") : sap.ui.getCore().byId("BPD_Input_02").setValueState("Error");
                            sApellido ? sap.ui.getCore().byId("BPD_Input_03").setValueState("None") : sap.ui.getCore().byId("BPD_Input_03").setValueState("Error");
                            sTelefono ? sap.ui.getCore().byId("BPD_Input_04").setValueState("None") : sap.ui.getCore().byId("BPD_Input_04").setValueState("Error");
                            sTelefonoEmergencia ? sap.ui.getCore().byId("BPD_Input_05").setValueState("None") : sap.ui.getCore().byId("BPD_Input_05").setValueState("Error");
                            sTipoSangre ? sap.ui.getCore().byId("BPD_Input_06").setValueState("None") : sap.ui.getCore().byId("BPD_Input_06").setValueState("Error");
                            sCorreo ? sap.ui.getCore().byId("BPD_Input_07").setValueState("None") : sap.ui.getCore().byId("BPD_Input_07").setValueState("Error");
                        }
                    } else {
                        sap.ui.getCore().byId("BPD_Input_09").setValueState("Error").setValueStateText(sMsgNoCoinciden);
                    }
                } else if (sContrasena.length < 8) {
                    sap.ui.getCore().byId("BPD_Input_08").setValueState("Error").setValueStateText(sMsg8Caracteres);
                } else if (sConfirmarContrasena.length < 8) {
                    sap.ui.getCore().byId("BPD_Input_09").setValueState("Error").setValueStateText(sMsg8Caracteres);
                }
            },
            onCreateBP: function () {
                BusyIndicator.show(0);
                var oBody = this._ValidateCreateBP();
                if (oBody) {
                    BusyIndicator.show(0);
                    var that = this;
                    var oDataModel = new sap.ui.model.odata.ODataModel(
                                        "/sap/opu/odata/sap/ZTM_TENDERING_WORKLIST_SRV", {
                                            json: true
                                    });
                    var sPath = "/DriverSet";
                    oDataModel.create(sPath, oBody, {
                        success: function (data, response) {
                            var sRFC = data.RFC;
                            var sMsgSuccess = "Se creo BP con RFC " + sRFC;
                            var sMsgTitle = "BP creado";
                            that.onCloseDialogBP();
                            BusyIndicator.hide();
                            MessageBox.show(sMsgSuccess, {
                                icon:MessageBox.Icon.SUCCESS,
                                title: sMsgTitle,
                                emphasizedAction: "Cerrar",
                                onClose: function () {
                                }
                            });
                        }.bind(this),
                        error: function (error) {
                            var sMsgTitleError = error.response.statusCode + " - " + error.response.statusText;
                            var sMsgError = "No se creo BP"
                            BusyIndicator.hide();
                            MessageBox.show(sMsgError, {
                                icon:MessageBox.Icon.ERROR,
                                title: sMsgTitleError,
                                emphasizedAction: "Cerrar",
                                onClose: function () {
                                    that.onCloseDialogBP();
                                }
                            });
                        }.bind(this)
                    });
                }
            }
        });
    });