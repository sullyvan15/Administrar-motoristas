sap.ui.define(["sap/ui/core/mvc/Controller"], function (e) {
  "use strict";

  var oModelJson = new sap.ui.model.json.JSONModel();
  var licencas = new Array();
  var url = "/sap/opu/odata/SAP/ZGWPC_REL_MOTORISTA_SRV/";
  var oModel = new sap.ui.model.odata.ODataModel(url, true);
  var oBusyDialog = new sap.m.BusyDialog();

  return e.extend("ztdadmmotorista.controller.View2", {
    onInit: function (oEvent) {
      var oMultiInput2 = this.byId("productInput2");
      this._oMultiInput2 = oMultiInput2;
      var e = [
        { key: "1", text: "Disponível" },
        { key: "2", text: "Não disponível" },
      ];

      var oModelJson = new sap.ui.model.json.JSONModel(e);
      this.getView().setModel(oModelJson, "statusMotorista");
      sap.ui.core.UIComponent.getRouterFor(this)
        .getRoute("View2")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    onButtonSave: function (oEvent) {
      if (
        this.getView().byId("productInput2").getValue() === "" ||
        this.getView().byId("nameInput").getValue() === ""
      ) {
        return sap.m.MessageBox.error("Preencha todos os campos obrigatórios");
      }
      var LicencaArray = new Array();

      var fullName = this.getView().byId("nameInput").getValue();
      var nameParts = fullName.split(" ");

      var firstName = nameParts[0];
      var restOfName = nameParts.slice(1).join(" ");
      var Drivercode = this.idMotorista === undefined ? "1" : this.idMotorista;

      if (restOfName === "" || restOfName === undefined) {
        return sap.m.MessageBox.error("Preencha o nome completo do motorista");
      }
     // this.getView().byId("productInput2").getValue()
      var motorista = {
        Drivercode: Drivercode,
        Perscode: Drivercode,
        FirstName: firstName,
        LastName: restOfName,
        Carrier: this.codTransportadora,
        Drvstatus: this.getView().byId("statusMotorista").getValue() === "Disponível" ? "1" : "2",
        CreDate: "",
        CreName: "",
        ChaDate: "",
        ChaName: "",
        DrvXblck: "",
        StatusTxt: "",
        LChaDate: "",
        Licenca: "",
        Nome: "",
        LChaName: "",
      };

      for ( var i = 0; i < this.byId("tableCompartimentos").getItems().length; i++) {
        var dateValidFrom = this.byId("tableCompartimentos").getItems()[i].mAggregations.cells[3].mProperties.value;
        var dateValidTo = this.byId("tableCompartimentos").getItems()[i].mAggregations.cells[4].mProperties.value;

        if (dateValidTo.includes('/') === true && dateValidFrom.includes('/') === true) {
          var parts = dateValidTo.split('/');
          dateValidTo = '20' + parts[2] + (parts[0].length < 2 ? '0' + parts[0] : parts[0]) + (parts[1].length < 2 ? '0' + parts[1] : parts[1]);
          
          parts = dateValidFrom.split('/');
          dateValidFrom = '20' + parts[2] + (parts[0].length < 2 ? '0' + parts[0] : parts[0]) + (parts[1].length < 2 ? '0' + parts[1] : parts[1]);
  
        }
 
      //  if ( this.validateDate(dateValidFrom) === false || this.validateDate(dateValidTo) === false ) {
      //    return sap.m.MessageBox.error("Data inválida");
      //  }
        var licenca = {
          DRIVERCODE: this.idMotorista,
          LICENSETYP: this.byId("tableCompartimentos").getItems()[i]
            .mAggregations.cells[0].mProperties.value,
          LICENSENO: this.byId("tableCompartimentos").getItems()[i]
            .mAggregations.cells[2].mProperties.value,
          VALID_FROM: dateValidFrom,
          VALID_TO: dateValidTo,
          LICENSE_DESC: this.byId("tableCompartimentos").getItems()[i]
            .mAggregations.cells[1].mProperties.value,
        };
       // if ( this.validateCNH(this.byId("tableCompartimentos").getItems()[i].mAggregations.cells[2].mProperties.value === false)) {
       //   return sap.m.MessageBox.error("CNH da licença" + (i + 1)  + " inválida");
//
       // }
        if (
          this.byId("tableCompartimentos").getItems()[i].mAggregations.cells[0]
            .mProperties.value === "" ||
          this.byId("tableCompartimentos").getItems()[i].mAggregations.cells[2]
            .mProperties.value === "" ||
          this.byId("tableCompartimentos").getItems()[i].mAggregations.cells[3]
            .mProperties.value === "" ||
          this.byId("tableCompartimentos").getItems()[i].mAggregations.cells[4]
            .mProperties.value === ""
        ) {
          return sap.m.MessageBox.error(
            "Preencha todos os campos obrigatórios das licenças"
          );
        } else {
          LicencaArray.push(licenca);
        }
      }

      if (this.edit === true) {
        oModel.update("/MotoristaSet(Drivercode=" + this.idMotorista + ")", motorista,
          {
            success: function (oData, oResponse) {
              sap.m.MessageToast.show("Motorista atualizado com sucesso");
            },
            error: function (oError) {
              var errorMessage = oError.response.body.split(",")[13].split(":")[1];
              sap.m.MessageBox.error(errorMessage);
            },
          }
        );
        
        for (var i = 0; i < LicencaArray.length; i++) {
          oModel.update("/LicencasSet(DRIVERCODE='" + this.idMotorista + "')", LicencaArray[i], {
            success: function (oData, oResponse) {
              sap.m.MessageToast.show("Licenças adicionadas com sucesso");
            },
            error: function (oError) {
              var errorMessage = oError.response.body.split(",")[13].split(":")[1];
              sap.m.MessageBox.error(errorMessage);
            },
          });
        }
      } else {
      var that = this;
        oModel.create("/MotoristaSet", motorista, {
          success: function (oData, oResponse) {
            that.novoMotoristaId = oResponse.data.Drivercode;
            sap.m.MessageToast.show("Motorista com a matrícula " + that.novoMotoristaId + " criado com sucesso");
            that.idMotorista = that.novoMotoristaId;
            that.onButtonCancel();
          },
          error: function (oError) {
            var errorMessage = oError.response.body.split(",")[13].split(":")[1];
            sap.m.MessageBox.error(errorMessage);
          },
        });
   
        for (var i = 0; i < LicencaArray.length; i++) {
          LicencaArray[i].DRIVERCODE = this.novoMotoristaId;
          oModel.create("/LicencasSet", LicencaArray[i], {
            success: function (oData, oResponse) {
              sap.m.MessageToast.show("Licenças adicionadas com sucesso");
              that.onButtonCancel();
            },
            error: function (oError) {
              sap.m.MessageBox.error("Erro ao adicionar licenças");
              that.onDeleteMotorista();
            },
          });
        }
      }
    },

    onSetData: function (oEvent) {
      if (oEvent.Drivercode === undefined) {
        return;
      }
      this.idMotorista = oEvent.Drivercode;
      this.onSetVisible(true);
      this.byId("page2").setTitle("Motorista: " + oEvent.Drivercode + " - " + oEvent.FirstName +" " + oEvent.LastName
      );
      this.byId("nameInput").setValue(oEvent.Nome);
      this.byId("productInput2").setValue(oEvent.Carrier);
      this.byId("textCadastradoEm").setValue(oEvent.CreDate);
      this.byId("textModificadoEm").setValue(oEvent.ChaDate);
      this.byId("statusMotorista").getSelectedKey(oEvent.Drvstatus === "" ? "1" : "2");
      this.onSetEditable(false);
      this.onBuscaLicencas();
      this.onBuscaAgendamentos();
      
    },

    onSetEditable: function (oEvent) {
      if (this.edit === true || oEvent === false) {
        this.byId("buttonEdit").setIcon("sap-icon://edit");
        this.byId("buttonEdit").setText("Editar");
        this.edit = false;
        this.byId("buttonDelete").setVisible(this.edit);
        this.byId("idProductsTable").setVisible(true);
      } else {
        this.edit = true;
        this.byId("buttonEdit").setIcon("sap-icon://employee-lookup");
        this.byId("buttonEdit").setText("Visualizar");
        this.byId("buttonDelete").setVisible(this.edit);
        this.byId("idProductsTable").setVisible(false);
        sap.m.MessageToast.show("Modo de edição ativado");

      }
      this.byId("nameInput").setEditable(this.edit);
      this.byId("statusMotorista").setEditable(this.edit);
      this.byId("productInput2").setEditable(this.edit);
      this.byId("buttonAdicionaLicenca").setVisible(this.edit);
      this.byId("buttonSave").setVisible(this.edit);
      this.byId("buttonCancel").setVisible(this.edit);
      this.byId("colunaDelete").setVisible(this.edit);
      this.onBuscaLicencas();
      this.onSetBloqueiaExistente();
    },

    onSetVisible: function (oEvent) {
      this.byId("buttonEdit").setVisible(oEvent);
      this.byId("statusMotorista").setVisible(oEvent);
      this.byId("formStatus").setVisible(oEvent);
      this.byId("formCadastro").setVisible(oEvent);
      this.byId("buttonDelete").setVisible(oEvent);

    },

    onBuscaLicencas: function (oEvent) {
      var oElement = this.getView().byId("page2");
      var arrayFilters = new Array();
      var filterMotorista = new sap.ui.model.Filter(
        "DRIVERCODE",
        sap.ui.model.FilterOperator.EQ,
        this.idMotorista
      );
      arrayFilters.push(filterMotorista);
      var that = this;
      oModel.read("/LicencasSet", {
        filters: arrayFilters,
        success: function (o) {
          var oModelJson = new sap.ui.model.json.JSONModel(o.results)
          licencas = o.results;
          that.getView().setModel(oModelJson, "LicencasSet"); 
       //  oModelJson.setData(o.results);
       //  
       //  oElement.setModel(oModelJson);
       //  oElement.bindElement("/");
        },
      });

    },

    formatStatus: function(sValue) {
      if (sValue === "1") {
          return "Aguardando Check In";
      } else {
          // Retorne outros textos para outros valores aqui
      }
  },

    onBuscaAgendamentos: function (oEvent) {

      var oElement = this.getView().byId("page2");
      var arrayFilters = new Array();
      var filterMotorista = new sap.ui.model.Filter(
        "MOTORISTA",
        sap.ui.model.FilterOperator.EQ,
        this.idMotorista
      );
      arrayFilters.push(filterMotorista);
      var that = this;
      oModel.read("/AgendamentoSet", {
        filters: arrayFilters,
        success: function (o) {
          var oModelJson = new sap.ui.model.json.JSONModel(o.results)
          that.getView().setModel(oModelJson, "AgendamentoSet"); 
          if (o.results.length > 0) {
          that.byId("idProductsTable").setVisible(true);
          }
       //  oModelJson.setData(o.results);
       //  
       //  oElement.setModel(oModelJson);
       //  oElement.bindElement("/");
        },
      });
    },

    onRefresh: function () {
      var oTable = this.byId("tableCompartimentos");
      oTable.getBinding("items").refresh();
    },
    _onRouteMatched: function (oEvent) {
    
      this.idMotorista = oEvent.getParameter("arguments").driverId;
      if (this.idMotorista === undefined) {
        return 
      };

      var odataModel = new sap.ui.model.odata.ODataModel(url);
      var n = this;
      odataModel.read("/MotoristaSet(" + this.idMotorista + ")", {
        success: function (e, oModel) {
          var o = new sap.ui.model.json.JSONModel({
            Results: e,
          });
          // n.getView().setModel(o, "MotoristaSet");
          n.onSetData(e);
        },
        error: function (e) {
          console.log("Erro ao ler os dados");
          n.onButtonCancel();
        },
      });
    },

    onValueHelpRequest2: function (oEvent) {
      var spath, field, field2, Label1, Label2, id, title;
   
      id = oEvent.getParameters().id;
      this.fieldScreen = this.byId(id);

      if (oEvent.getParameters().id.split("--")[2] === "productInput2") {
        (spath = "/Transportadoras"),
          (field = "Carrier"),
          (field2 = "Carrier_desc"),
          // filter = "PLANT",
          (Label1 = "Código da transportadora"),
          (Label2 = "Nome da transportadora"),
          (title = "Transportadoras");
      } else if (
        oEvent.getParameters().id.split("--")[2] ===
        "catCNH-application-ztdadmmotorista-display-component"
      ) {
        (spath = "/VL_SH_CNHSet"),
          (field = "TYPE"),
          (field2 = "DESC"),
          //  filter = "PLANT",
          (Label1 = "Tipo de licença"),
          (Label2 = "Descrição da licença"),
          (title = "Tipos de licença");
      }

      this._fragment =   this.loadFragment({
        name: "ztdadmmotorista.view.ValueHelpDialogFilterbar2",
      }).then(
        function (oDialog) {
          this._oVHD = oDialog;

          this.getView().addDependent(oDialog);

          oDialog.getTableAsync().then(
            function (oTable) {
              oTable.setModel(this.oProductsModel);

              if (oTable.bindRows) {
                oTable.bindAggregation("rows", {
                  path: spath,
                  events: {
                    dataReceived: function () {
                      oDialog.update();
                    },
                  },
                });

                oDialog.setTitle(title);
                oDialog.setKey(field);
                oDialog.setDescriptionKey(field2);
                oDialog.setSupportMultiselect(false);

                var oColumn = new sap.ui.table.Column({
                  label: new sap.ui.commons.Label({ text: Label1 }),
                  template: new sap.ui.commons.TextView().bindProperty(
                    "text",
                    field
                  ),
                });
                var oColumn2 = new sap.ui.table.Column({
                  label: new sap.ui.commons.Label({ text: Label2 }),
                  template: new sap.ui.commons.TextView().bindProperty(
                    "text",
                    field2
                  ),
                });

                oTable.addColumn(oColumn);
                oTable.addColumn(oColumn2);
              }
            }.bind(this)
          );

          // oDialog.setTokens(fieldScreen.getTokens());
          oDialog.open();
        }.bind(this)
      );
    },
    onValueHelpOkPress2: function (oEvent) {
      var aTokens = oEvent.getParameter("tokens");
      var oInput = this.fieldScreen;
      if (aTokens[0].getKey().includes('CNH') === false ){
      this.codTransportadora = aTokens[0].getKey();
      }
      oInput.setValue(aTokens[0].getText());
      this._oVHD.close();
      this.onSetDescricaoLicenca(this.fieldScreen, aTokens[0].getText(), aTokens[0].getKey());
    },
    onSetDescricaoLicenca: function (oEvent, oDescription, oKey) {
      var oTable = this.getView().byId("tableCompartimentos");
      var idItem = oEvent.getId().slice(-1);
      if (oEvent.getId().split("--")[2] !== "productInput2") {
      oTable.getItems()[idItem].mAggregations.cells[1].setValue(oDescription);
      oTable.getItems()[idItem].mAggregations.cells[0].setValue(oKey);
      }
    },

    onSetBloqueiaExistente: function (oEvent) {
      var oTable = this.getView().byId("tableCompartimentos");
      for (var i = 0; i < oTable.getItems().length; i++) {
      oTable.getItems()[i].mAggregations.cells[0].setEditable(false);
      oTable.getItems()[i].mAggregations.cells[2].setEditable(false);
      oTable.getItems()[i].mAggregations.cells[3].setEditable(false);
      oTable.getItems()[i].mAggregations.cells[4].setEditable(false);
      }
    },

    oncloseDialog: function (oEvent) {
      this._oVHD.close();
      //  this.byId("addLicenseDialog").destroy();
    },


    onConfirmDelete: function (oEvent) {
      sap.m.MessageBox.confirm("Deseja excluir o motorista?", {
        onClose: function (oAction) {
          if (oAction === sap.m.MessageBox.Action.OK) {
            this.onDeleteMotorista();
          }
        }.bind(this),
      });
    },

    onDeleteMotorista: function (oEvent) {
     // sap.m.MessageBox.confirm("Deseja excluir o motorista?")
      //  {

       var that = this;
 
              oModel.remove(
                "/MotoristaSet(Drivercode=" + Number(this.idMotorista) + ")",
                {
                  success: function (oData, oResponse) {
                    sap.m.MessageToast.show("Motorista excluído com sucesso");
                    that.onButtonCancel();
                  },
                  error: function (oError) {
                    sap.m.MessageToast.show("Erro ao excluir motorista");
                  },
                }
              );


      //  };
    },

    onBack: function (oEvent) {
     
      this.getRouter().navTo("worklist");
    },

    onButtonCancel: function (e) {

    this.getRouter().navTo("worklist", {}, true );
     location.reload();
     
    },
    getRouter: function () {
      return sap.ui.core.UIComponent.getRouterFor(this);
    },

    onAdicionaLicenca: function (oEvent) {
      var oTable = this.getView().byId("tableCompartimentos");

      oBusyDialog.open();
      var lineLicenca = [
        {
          DRIVERCODE: "1",
          LICENSETYP: "",
          LICENSENO: "",
          VALID_FROM: "",
          VALID_TO: "",
        },
      ];

      licencas.push(lineLicenca);
      var oModelJson = new sap.ui.model.json.JSONModel(licencas);
      this.getView().setModel(oModelJson, "LicencasSet");
      oTable.getBinding("items").refresh();
      oBusyDialog.close();
    },

    onElimninaLicenca: function (oEvent) {
      
      var oTable = this.getView().byId("tableCompartimentos");
     if ( oTable.getBinding("items").getLength() === 1) {
     }


      var selectedItem = oEvent.getParameters().id.slice(-1);
      this.getView().byId("tableCompartimentos").removeItem(Number(selectedItem))

      licencas.splice(selectedItem);
    },

   
  });
});
