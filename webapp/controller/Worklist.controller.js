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

    var url = "/sap/opu/odata/SAP/ZGWFI_REL_REMESSA_SRV/";

    return BaseController.extend("ztdadmmotorista.controller.Worklist", {

        formatter: formatter,
       
        onInit : function () {
            sap.ui.core.UIComponent.getRouterFor(this).getRoute("worklist").attachPatternMatched(this._onRouteMatched, this);;
             sap.ui.core.UIComponent.getRouterFor(this).getRoute("View2").attachPatternMatched(this._onRouteMatched, this);

            this.onVariantsInitialized();
       

        },

        onRouteMatched: function (oEvent) {
        },

   

        onRowActionItemPress: function (oEvent) {
            var oLine = oEvent.getSource().getBindingContext().getObject();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("View2", { driverId: oLine.Drivercode });
            this.getView().getModel().refresh(true);
            //location.reload();
        },

    onValueHelpRequest2: function(oEvent) {
        var spath, field, field2, Label1, Label2, id, title;
      
        id  = oEvent.getParameters().id;
        this.fieldScreen = this.byId(id);
      
       if (oEvent.getParameters().id.split("--")[2] === "fieldBarCliente") { 
            spath  = "/MotoristaSet", 
            field  = "Drivercode",
            field2 = "Nome",
           // filter = "PLANT", 
            Label1 = "Matrícula do motorista",
            Label2 = "Nome do motorista",
            title = "Motoristas"
      
       } else if (oEvent.getParameters().id.split("--")[2] === "fieldBarCentro") { 
            spath  = "/Transportadoras", 
          field  = "Carrier",
          field2 = "Carrier_desc",
        //  filter = "PLANT", 
          Label1 = "Código da transportadora",
          Label2 = "Nome da transportadora",
          title = "Transportadoras"
        
        }
      
        this.loadFragment({
              name: "ztdadmmotorista.view.ValueHelpDialogFilterbar2"
          }).then(function(oDialog) {
              this._oVHD = oDialog;
      
              this.getView().addDependent(oDialog);
      
      oDialog.getTableAsync().then(function (oTable) {
      
          oTable.setModel(this.oProductsModel);
      
          if (oTable.bindRows) {
              oTable.bindAggregation("rows", {
                  path: spath,
                  events: {
                      dataReceived: function() {
                          oDialog.update();
                      }
                  }
              });
      
            oDialog.setTitle(title);
            oDialog.setKey(field);
            oDialog.setDescriptionKey(field2);
          
               
          var oColumn = new sap.ui.table.Column({
              label: new sap.ui.commons.Label({text: Label1}),
              template: new sap.ui.commons.TextView().bindProperty("text", field),
          });
          var oColumn2 = new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: Label2}),
            template: new sap.ui.commons.TextView().bindProperty("text", field2),
        });
      
          oTable.addColumn(oColumn);
          oTable.addColumn(oColumn2);
      }
      }.bind(this));
              oDialog.open();
          }.bind(this));
          
      }
      ,
      onValueHelpOkPress2: function(oEvent) {
        var aTokens = oEvent.getParameter("tokens");
        var oInput = this.fieldScreen;
        oInput.setTokens(aTokens)
        this._oVHD.close();
      },
    
    oncloseDialog: function(oEvent) {
        this._oVHD.close();
    },

        onNovoMotorista: function () {   
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("View2", {}, true); 
            location.reload(); 
          },

        onVariantsInitialized: function(oEvent) {
        

			this.oSmartVariantManagement = this.getView().byId("svm");
			this.oExpandedLabel = this.getView().byId("expandedLabel");
			this.oSnappedLabel = this.getView().byId("snappedLabel");
			this.oFilterBar = this.getView().byId("filterbar");
			this.oTable = this.getView().byId("idTable");

			var oPersInfo = new PersonalizableInfo({
				type: "filterBar",
				keyName: "persistencyKey",
				dataSource: "",
				control: this.oFilterBar
			});
			this.oSmartVariantManagement.addPersonalizableControl(oPersInfo);
			this.oSmartVariantManagement.initialise(function () {}, this.oFilterBar);
            

        },

        onSearch: function (oEvent) {

            var arrayFilters = [];

            for (let i = 0; i < this.byId("fieldBarCliente").getTokens().length; i++) {
                var filterCliente = new sap.ui.model.Filter("Drivercode",  sap.ui.model.FilterOperator.EQ, this.byId("fieldBarCliente").getTokens()[i].mProperties.key);
                arrayFilters.push(filterCliente);
            }

            for (let i = 0; i < this.byId("fieldBarCentro").getTokens().length; i++) {
                var transportadora = this.byId("fieldBarCentro").getTokens()[i].mProperties.key !== "" ? this.byId("fieldBarCentro").getTokens()[i].mProperties.key : this.byId("fieldBarCentro").getTokens()[i].mProperties.text;
                var filterCentro  = new sap.ui.model.Filter("Carrier",  sap.ui.model.FilterOperator.EQ, transportadora);
                arrayFilters.push(filterCentro);
            }
            
            this.getView().byId("idTable").bindRows({
                filters: arrayFilters,
                path : '/MotoristaSet',
            });

        },

    });
});
