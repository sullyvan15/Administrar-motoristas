sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/BusyDialog",
    "sap/ui/model/Filter",
   // "sap/m/MessageBox",
    "sap/ui/model/type/String",
  ],
  function (e, t, o, a,  TypeString) {
    "use strict";
    var s = null;
    var i = {};
    return e.extend("project5.controller.View2", {
      onInit: function (oEvent) {
        var oMultiInput2 = this.byId("productInput2");
        this._oMultiInput2 = oMultiInput2;
        var e = [
          { key: "1", text: "Disponível" },
          { key: "2", text: "Não disponível" },
        ];
        var t = new sap.ui.model.json.JSONModel(e);
        this.getView().setModel(t, "statusMotorista");
        if (this.getOwnerComponent().getModel("detailData") !== undefined) {
            this.onSetData(this.getOwnerComponent().getModel("detailData").getProperty("/"));
        }


      },

      onSetData: function(oEvent) {
        this.idMotorista = oEvent.IdMotorista;
        this.onSetVisible();
        this.byId("page2").setTitle("Informações do motorista");
        this.byId("nameInput").setValue(oEvent.Nome);
        this.byId("textCadastradoEm").setText(oEvent.CreDate);
        this.byId("textModificadoEm").setText(oEvent.ChaDate);
      },

      onSetVisible: function(oEvent) {
        this.byId("formCadastro").setVisible(true);
        this.byId("formModificado").setVisible(true);
        this.byId("formStatus").setVisible(true);
        this.byId("formVeiculo").setVisible(true);
        this.byId("idProductsTable").setVisible(true);
        this.byId("buttonDelete").setVisible(true);
      },

      onBuscaLicencas: function(oEvent) {
        var arrayFilters  = new Array;
         var url = "/sap/opu/odata/SAP/ZGWFI_REL_REMESSA_SRV/";
         var odataModel = new sap.ui.model.odata.ODataModel(url);

         var filterMotorista = new sap.ui.model.Filter("Drivercode",  sap.ui.model.FilterOperator.EQ, this.idMotorista);
         arrayFilters.push(filterMotorista);
        
         odataModel.read("/Licencas", {
             filters: arrayFilters,
             success: function(e, t) {
                 var o = new sap.ui.model.json.JSONModel({
                     Results: e.results
                 });
                 if (e.results.length == 0) {
                     sap.m.MessageBox.information("Nenhum registro encontrado");
                     var o = new sap.ui.model.json.JSONModel({
                         Results: ""
                     });
                     n.getView().byId("tableCompartimentos").setModel(o)
                     n.onRefresh();
                 } else {

                 }
             },
             error: function(e) {
                 console.log("Erro ao ler os dados")
             }
         })

      },

      onRefresh : function () {
        var oTable = this.byId("tableCompartimentos");
        oTable.getBinding("items").refresh();
    },  
_onRouteMatched : function (oEvent) {


//  oView.bindElement({
//      path : "/MotoristaSet(" + idMotorista + ")",
//      events : {
//          change: this._onBindingChange.bind(this),
//          dataRequested: function (oEvent) {
//              oView.setBusy(true);
//          },
//          dataReceived: function (oEvent) {
//              oView.setBusy(false);
//          }
//      }
//  });
},

onValueHelpRequest2: function(oEvent) {
        
   // this._oBasicSearchField = new SearchField();
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

     //   oDialog.setTokens(this._oMultiInput2.getTokens());
        oDialog.open();
    }.bind(this));
    
}
,
oncloseDialog: function(oEvent) {
    this._oVHD.close();
},


      onButtonCancel: function (e) {

        // Limpar todos os modelos
   

        var oRouter = this.getOwnerComponent().getRouter();

    
        oRouter.navTo("Worklist");

      },
      getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      onAddLinha: function () {
            this.loadFragment({
                name: "project5.view.NovoMotorista"
            }).then(function(oDialog) {
                this._oVHD = oDialog;
                this.getView().addDependent(oDialog);
                this._oVHD.open();
        }.bind(this));
       
            

      }
    });
  }
);

