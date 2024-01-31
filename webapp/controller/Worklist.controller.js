sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/comp/smartvariants/PersonalizableInfo',
    "sap/m/DynamicDateOption",
	'sap/m/DynamicDateValueHelpUIType',
	'sap/m/StepInput',
	'sap/m/Label',
	'sap/ui/core/LocaleData',
	"sap/ui/core/Core",
	"sap/ui/commons/MessageBox",
    'sap/ui/model/type/String',
    'sap/m/SearchField',
    'sap/m/Column'
    
], function (BaseController,
	JSONModel,
	formatter,
	Filter,
	FilterOperator,
	PersonalizableInfo,
	DynamicDateOption,
	DynamicDateValueHelpUIType,
	StepInput,
	Label,
	LocaleData,
	Core,
	MessageBox,
    TypeString,
    SearchField,
    UIColumn
    
    
    
    ) {
    "use strict";

    return BaseController.extend("project5.controller.Worklist", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");

            this.onVariantsInitialized();

            this.onSearchHelp();

        },

        onSearchHelp: function () {

            this.onSearchHelps();
            this.onSearchHelps2();
            this.onSearchHelps3();
            this.onSearchHelps4();
            this.onVariantsInitialized();
 
 
            var oMultiInput, oMultiInputWithSuggestions;
             // Value Help Dialog standard use case with filter bar without filter suggestions
             oMultiInput = this.byId("productInput");
            var oMultiInput2 = this.byId("productInput2");
            var oMultiInput3 = this.byId("productInput4");
            var oMultiInput4 = this.byId("productInput5");
             oMultiInput.addValidator(this._onMultiInputValidate);
             oMultiInput2.addValidator(this._onMultiInputValidate);
    //         oMultiInput3.addValidator(this._onMultiInputValidate);
    //         oMultiInput4.addValidator(this._onMultiInputValidate);
             
             //oMultiInput.setTokens(this._getDefaultTokens());
             this._oMultiInput = oMultiInput;
             this._oMultiInput2 = oMultiInput2;
     //        this._oMultiInput3 = oMultiInput3;
     //        this._oMultiInput4 = oMultiInput4;

        },

        onSearchHelps: function () {      
        var url = "/sap/opu/odata/SAP/ZGWFI_REL_REMESSA_SRV/";
        var odataModel = new sap.ui.model.odata.ODataModel(url);
        var n = this;
        odataModel.read("/Clientes?", {
            success: function(e, t) {
                var o = new sap.ui.model.json.JSONModel({
                    Results: e
                });
                n.getView().setModel(o, "SearchHelp");
            },
            error: function(e) {
                console.log("Erro ao ler os dados")
            }
        })

    },


    onSearchHelps2: function () {
        
        var url = "/sap/opu/odata/SAP/ZGWFI_REL_REMESSA_SRV/";
        var odataModel = new sap.ui.model.odata.ODataModel(url);
        var n = this;
        odataModel.read("/Centros?", {
            success: function(e, t) {
                var o = new sap.ui.model.json.JSONModel({
                    Results: e.results
                });
                n.getView().setModel(o, "SearchHelp");
            },
            error: function(e) {
                console.log("Erro ao ler os dados")
            }
        })

    },

    onSearchHelps3: function () {
        
        var url = "/sap/opu/odata/SAP/ZGWFI_REL_REMESSA_SRV/";
        var odataModel = new sap.ui.model.odata.ODataModel(url);
        var n = this;
        odataModel.read("/Notas?", {
            success: function(e, t) {
                var o = new sap.ui.model.json.JSONModel({
                    Results: e.results
                });
                n.getView().setModel(o, "SearchHelp");
            },
            error: function(e) {
                console.log("Erro ao ler os dados")
            }
        })

    },

    onSearchHelps4: function () {
        
        var url = "/sap/opu/odata/SAP/ZGWFI_REL_REMESSA_SRV/";
        var odataModel = new sap.ui.model.odata.ODataModel(url);
        var n = this;
        odataModel.read("/Materiais?", {
            success: function(e, t) {
                var o = new sap.ui.model.json.JSONModel({
                    Results: e.results
                });
                n.getView().setModel(o, "SearchHelp");
            },
            error: function(e) {
                console.log("Erro ao ler os dados")
            }
        })

    },



    onValueHelpRequest: function(oEvent) {
			
        this._oBasicSearchField = new SearchField();
        this.loadFragment({
            name: "project5.view.ValueHelpDialogFilterbar"
        }).then(function(oDialog) {
            var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
            this._oVHD = oDialog;

            this.getView().addDependent(oDialog);

            // Set key fields for filtering in the Define Conditions Tab
            oDialog.setRangeKeyFields([{
                label: "cliente",
                key: "BR_NFPARTNER",
                type: "string",
                typeInstance: new TypeString({}, {
                    maxLength: 7
                })
            }]);

            // Set Basic Search for FilterBar
    oFilterBar.setFilterBarExpanded(false);
    oFilterBar.setBasicSearch(this._oBasicSearchField);

    // Trigger filter bar search when the basic search is fired
    this._oBasicSearchField.attachSearch(function() {
        oFilterBar.search();
    });

    oDialog.getTableAsync().then(function (oTable) {

        oTable.setModel(this.oProductsModel);

        // For Desktop and tabled the default table is sap.ui.table.Table
        if (oTable.bindRows) {
            // Bind rows to the ODataModel and add columns
            oTable.bindAggregation("rows", {
                path: "/MotoristaSet",
                events: {
                    dataReceived: function() {
                        oDialog.update();
                    }
                }
            });

            var oColumn = new sap.ui.table.Column({
                label: new sap.ui.commons.Label({text: "Matrícula"}),
                template: new sap.ui.commons.TextView().bindProperty("text", "Drivercode"),
                sortProperty: "Drivercode",
                filterProperty: "Drivercode",
            });
        
            // Adicione a coluna à tabela
            oTable.addColumn(oColumn);

            var oColumn2 = new sap.ui.table.Column({
                label: new sap.ui.commons.Label({text: "Nome do motorista"}),
                template: new sap.ui.commons.TextView().bindProperty("text", "Nome"),
                sortProperty: "Nome",
                filterProperty: "Nome",
            });
        
            // Adicione a coluna à tabela
            oTable.addColumn(oColumn2);
    }
    }.bind(this));

            oDialog.setTokens(this._oMultiInput.getTokens());
            oDialog.open();
        }.bind(this));
        
    }
    ,

    onValueHelpRequest2: function(oEvent) {
        
        this._oBasicSearchField = new SearchField();
        this.loadFragment({
            name: "project5.view.ValueHelpDialogFilterbar2"
        }).then(function(oDialog) {
            var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
            this._oVHD = oDialog;

            this.getView().addDependent(oDialog);

            // Set key fields for filtering in the Define Conditions Tab
            oDialog.setRangeKeyFields([{
                label: "Centro",
                key: "CFOP",
                type: "string",
                typeInstance: new TypeString({}, {
                    maxLength: 7
                })
            }]);

            // Set Basic Search for FilterBar
    oFilterBar.setFilterBarExpanded(false);
    oFilterBar.setBasicSearch(this._oBasicSearchField);

    // Trigger filter bar search when the basic search is fired
    this._oBasicSearchField.attachSearch(function() {
        oFilterBar.search();
    });

    oDialog.getTableAsync().then(function (oTable) {

        oTable.setModel(this.oProductsModel);

        // For Desktop and tabled the default table is sap.ui.table.Table
        if (oTable.bindRows) {
            // Bind rows to the ODataModel and add columns
            oTable.bindAggregation("rows", {
                path: "/Transportadoras",
                events: {
                    dataReceived: function() {
                        oDialog.update();
                    }
                }
            });
            
        var oColumn = new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "ID"}),
            template: new sap.ui.commons.TextView().bindProperty("text", "Carrier"),
            sortProperty: "PLANT",
            filterProperty: "PLANT",
        });
    
        // Adicione a coluna à tabela
        oTable.addColumn(oColumn);


        var oColumn2 = new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "Transportadora"}),
            template: new sap.ui.commons.TextView().bindProperty("text", "Carrier_desc"),
            sortProperty: "PLANT_DESC",
            filterProperty: "PLANT_DESC",
        });
    
        // Adicione a coluna à tabela
        oTable.addColumn(oColumn2);
    }
    }.bind(this));

            oDialog.setTokens(this._oMultiInput2.getTokens());
            oDialog.open();
        }.bind(this));
        
    }
    ,
    oncloseDialog: function(oEvent) {
        this._oVHD.close();
    },

    onValueHelpCancelPress: function(oEvent) {
        this._oVHD.close();
        this._oVHD.destroy();
    },


        onNovoMotorista: function () {
            
            this.getOwnerComponent()
              .getRouter()
              .getTargets()
              .display("TargetView2", {Motorista: "1", EditMode: true});
          },

        onVariantsInitialized: function(oEvent) {
            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");
            this.oSmartVariantManagement = this.getView().byId("svm");
			this.oExpandedLabel = this.getView().byId("expandedLabel");
			this.oSnappedLabel = this.getView().byId("snappedLabel");
			this.oFilterBar = this.getView().byId("filterbar");
			this.oTable = this.getView().byId("table");

	//	this.oFilterBar.registerFetchData(this.fetchData);
	//	this.oFilterBar.registerApplyData(this.applyData);
	//	this.oFilterBar.registerGetFiltersWithValues(this.getFiltersWithValues);

	//	var oPersInfo = new PersonalizableInfo({
	//		type: "filterBar",
	//		keyName: "persistencyKey",
	//		dataSource: "",
	//		control: this.oFilterBar
	//	});
	//	this.oSmartVariantManagement.addPersonalizableControl(oPersInfo);
	//	this.oSmartVariantManagement.initialise(function () {}, this.oFilterBar);

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished : function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onPress : function (oEvent) {
            // The source is the list item that got pressed
    //        this._showObject(oEvent.getSource());
    //       this.getOwnerComponent()
    //       .getRouter()
    //       .getTargets()
    //       .display("TargetView2", { Motorista: "1", EditMode: false });
            var Moorrrr = 1;
            var oComponent = this.getOwnerComponent();
			oComponent.setModel(new JSONModel(Moorrrr), "detailData");
            var sServiceUrl = "/sap/opu/odata/SAP/ZGWPC_REL_MOTORISTA_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
            var idMotorista = oEvent.getSource().getBindingContext().getProperty("Drivercode");
			oModel.read("/MotoristaSet("+ idMotorista +")", {
				success: function (oData, oResponse) {
					var oComponent = this.getOwnerComponent();
					oComponent.setModel(new JSONModel(oData), "detailData");
					this.getRouter().navTo("View2");

				}.bind(this)
			});
        
        },

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack : function() {
            // eslint-disable-next-line fiori-custom/sap-no-history-manipulation, fiori-custom/sap-browser-api-warning
            oRouter.navTo("Worklist");
        },


        onSearch : function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("Drivercode", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }

        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh : function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject : function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/MotoristaSet".length)
            });
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function(aTableSearchState) {
            var oTable = this.byId("table"),
                oViewModel = this.getModel("worklistView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        }

    });
});
