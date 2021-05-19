sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/xml/XMLModel",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
  function (Controller, JSONModel, XMLModel, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("mdsui5.controller.Main", {
      onInit: function () {
        this.loadUserInfo();
        this.getDummyProductsFromHanaDB();
        this.bindSecureHttpCalls();
        this.onGetBusinessPartnerInfo();
      },

      bindSecureHttpCalls: function () {
        $.ajax({
          type: "GET",
          url: "/",
          headers: { "X-Csrf-Token": "Fetch" },
          success: function (res, status, xhr) {
            var sHeaderCsrfToken = "X-Csrf-Token";
            var sCsrfToken = xhr.getResponseHeader(sHeaderCsrfToken);
            $(document).ajaxSend(function (event, jqxhr, settings) {
              if (settings.type === "POST" || settings.type === "PUT" || settings.type === "DELETE") {
                jqxhr.setRequestHeader(sHeaderCsrfToken, sCsrfToken);
              }
            });
          }
        });
      },

      /**
       * Load user attribute from uaa
       */
      loadUserInfo: function () {
        var that = this;
        $.ajax({
          url: "../user-info",
          type: "GET",
          success: function (data) {
            var oUserInfoForm = that.getView().byId("UserInfoForm");
            var oHeaderNameText = that.getView().byId("headerName");
            var oUserInfoModel = new JSONModel(data);
            oHeaderNameText.setModel(oUserInfoModel);
            oUserInfoForm.setModel(oUserInfoModel);
          },
          error: function (error) {
            console.log(error);
            MessageBox.error("Error in loading user info");
          }
        });
      },

      onLogout: function () {
        //MDS logout endpoint
        window.location.replace("/mds/logout");
      },

      createDummyProduct: function () {
        var that = this;
        var data = {
          ID: Math.random().toString().substr(3, 3),
          NAME: Math.random().toString(36).substring(7)
        };
        var oTable = that.getView().byId("IdTableProducts");
        $.ajax({
          type: "PUT",
          url: "../product",
          data: JSON.stringify(data),
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          success: function (res) {
            that.getDummyProductsFromHanaDB();
            MessageToast.show("Create success, refreshing table data");
            oTable.setBusy(true);
          },
          error: function (err) {
            console.log(err);
            MessageToast.show("Create failed!");
          }
        });
      },

      getDummyProductsFromHanaDB: function () {
        var that = this;
        var oTable = this.getView().byId("IdTableProducts");
        $.ajax({
          url: "../productData",
          type: "GET",
          success: function (data) {
            var oProductModel = new JSONModel({
              items: data
            });
            that.getView().setModel(oProductModel, "Products");
            if (oTable.getBusy() === true) {
              MessageToast.show("Update success!");
              oTable.setBusy(false);
            }
          },
          error: function (err) {
            console.log(err);
            MessageToast.show("Error when get prodcuct data from Hana DB");
          }
        });
      },

      onGetBusinessPartnerInfo: function () {
        var that = this;
        $.ajax({
          type: "GET",
          url: "/mdmbp-svc/BusinessPartner",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-Type", "application/xml");
            xhr.setRequestHeader("Accept", "application/json");
          },
          success: function (data) {
            var oBusinessPartnerInfo = new JSONModel(data.d);
            that.getView().setModel(oBusinessPartnerInfo, "BusinessParners");
          },
          error: function (err) {
            console.log(err);
            MessageBox.error("Error in get Business Partner Info from MDS Service");
          }
        });
      },
      createOrganization: function () {
        var that = this;
        var oOrgData = this.createDummyOrganizationData();
        $.ajax({
          type: "PUT",
          url: "../BusinessPartner",
          data: JSON.stringify(oOrgData),
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          accept: "application/json",
          success: function (data) {
            console.log(data);
          },
          error: function (err) {
            console.log(err);
            MessageBox.error("Error in get Business Partner Info from MDS Service");
          }
        });
      },
      createDummyOrganizationData: function() {
        return {
          "Category": "2",
          "CreatedByUser": "ly.dinhvan@vn.bosch.com",
          "SearchTerm2": "b2b",
          "SearchTerm1": "glob",
          "AuthorizationGroup": "", // To do: Checked which Auth Group supported - GLOB is not working on current account
          "IsBlocked": false,
          "IsMarkedForDeletion": false,
          "IsBusinessPurposeCompleted": false,
          "Language": "EN",
          "CorrespondenceLanguage": "EN",
          "FullName": "Ly Dinh",
          "to_Organization": [
            {
              "ScriptCode": " ",
              "OrganizationName1": "Company 3 GmbH",
              "OrganizationName2": ""
            }
          ],
          "to_AddressInformation": [
            {
              "to_Address": {
                "to_Fax": [
                  {
                    "Number": "11113",
                    "NumberExtension": "123456",
                    "DestinationLocationCountry": "DE",
                    "IsDefaultFaxNumber": true
                  }
                ],
                "to_MobilePhone": [
                  {
                    "Number": "11",
                    "IsDefaultPhoneNumber": false,
                    "DestinationLocationCountry": "DE",
                    "NumberType": "2"
                  }
                ],
                "to_LandlinePhone": [
                  {
                    "Number": "111",
                    "IsDefaultPhoneNumber": true,
                    "DestinationLocationCountry": "DE",
                    "NumberType": "1"
                  }
                ],
                "to_PostalAddress": [
                  {
                    "Building": "Building 1",
                    "StreetName": "street1",
                    "Floor": "05",
                    "HouseNumber": "121",
                    "AdditionalStreetSuffixName": "test",
                    "PostalCode": "56011",
                    "PoBoxPostalCode": "23113",
                    "CityName": "Frankfurt",
                    "PoBoxIsWithoutNumber": false,
                    "PoBoxLobbyName": "test",
                    "PoBox": "3312",
                    "PoBoxDeviatingCountry": "DE",
                    "Country": "DE",
                    "RoomNumber": "12",
                    "District": "Ban",
                    "CorrespondenceLanguage": "en",
                    "ScriptCode": " "
                  }
                ],
                "AddressType": "",
                "to_Email": [
                  {
                    "IsDefaultEmailAddress": true,
                    "EmailAddress": "max3@muster.de"
                  }
                ]
              },
              "to_AddressUsage": [
                {
                  "AddressUsage": "XXDEFAULT"
                }
              ]
            }
          ],
          "to_TaxNumber": [
            {
              "TaxNumberCategory": "DE0",
              "TaxNumber": "DE811128135"
            }
          ],
          "to_Identification": [
            {
              "Country": "DE",
              "IdentificationType": "ZBGLID",
              "IdentificationNumber": Math.random().toString(36).substring(7)
            }
          ]
        }
      }
    });
  });
