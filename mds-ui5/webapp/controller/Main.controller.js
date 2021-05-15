sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/xml/XMLModel",
  "sap/m/MessageBox"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
  function (Controller, JSONModel, XMLModel, MessageBox) {
    "use strict";

    return Controller.extend("mdsui5.controller.Main", {
      onInit: function () {
        this.loadUserInfo();
        this.getDummyProductsFromHanaDB();
        //this.getAccessTokenMDS();
        //this.msdAccestoken = "";
        // this.onGetJWTAccessToken(); // No need to parse access token
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
          type: 'GET'
        })
          .done(function (data) {
            var oUserInfoForm = that.getView().byId("UserInfoForm");
            var oHeaderNameText = that.getView().byId("headerName");
            var oUserInfoModel = new JSONModel(data);
            oHeaderNameText.setModel(oUserInfoModel);
            oUserInfoForm.setModel(oUserInfoModel);
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            MessageBox.error("Error in loading user info - " + textStatus);
          });
      },

      onLogout: function () {
        //MDS logout endpoint
        window.location.replace('/mds/logout');
      },

      createDummyProduct: function () {
        var data = {
          ID: Math.random().toString().split('.').pop(),
          NAME: Math.random().toString(36).substring(7)
        };
        $.ajax({
          type: 'POST',
          url: '../product',
          data: data,
          dataType: 'json',
          contentType: 'json',
        }).done(function (data) {
          console.log(data);
        }).fail(function (error) {
          console.log(error);
        });
      },

      getDummyProductsFromHanaDB: function () {
        var that = this;
        $.ajax({
          url: "../productData",
          type: 'GET'
        }).done(function (data) {
          var oProductModel = new JSONModel({
            items: data
          });
          that.getView().setModel(oProductModel, "Products");
        }).fail(function (error) {
          console.log(error);
        });
      },

      onGetBusinessPartnerInfo: function (serviceAccesstoken) {
        var that = this;
        $.ajax({
          type: "GET",
          url: "/mdmbp-svc/BusinessPartner",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-Type", "application/xml");
            xhr.setRequestHeader("Accept", "application/json");
          }
        }).done(function (data) {
          var oBusinessPartnerInfo = new JSONModel(data.d);
          that.getView().setModel(oBusinessPartnerInfo, "BusinessParners");
        }).fail(function (error) {
          console.log(error);
          MessageBox.error("Error in get Business Partner Info from MDS Service");
        });
      }
    });
  });
