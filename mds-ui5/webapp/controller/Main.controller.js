sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel, MessageBox) {
		"use strict";

		return Controller.extend("mdsui5.controller.Main", {
			onInit: function () {                
                this.loadUserInfo();
            },
            // onAfterRendering: function () {
            //     var that=this;
            //     $.ajax({
            //         url: "../user-info"
            //     }).done(function (data, status, jqxhr) {
            //         console.log(data);
            //     });
            // }

            /**
             * Load user attribute from uaa
             */
            loadUserInfo: function () {
                var that = this;
                $.ajax({
                    url:"../user-info",
                    type: 'GET'
                })
                .done(function(data){                   
                    var oUserInfoForm = that.getView().byId("UserInfoForm");
                    var oHeaderNameText = that.getView().byId("headerName");
                    var oUserInfoModel = new JSONModel(data);
                    oHeaderNameText.setModel(oUserInfoModel);
                    oUserInfoForm.setModel(oUserInfoModel);
                })
                .fail(function(jqXHR, textStatus, errorThrown){
                     MessageBox.error("Error in loading user info - " + textStatus);
                });                
            },

            onLogout: function () {
                //MDS logout endpoint
                window.location.replace('/mds/logout');
            }
            
        });
	});
