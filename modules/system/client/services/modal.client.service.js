'use strict';

angular.module('system').service('ModalLauncher', ['$uibModal',
  function($uibModal){

    this.launchDefaultMessageModal = function(title, message){
      return $uibModal.open({
        animation: true, size: 'md', backdrop: 'static',
        controller: 'DefaultModalController',
        windowClass: 'fade modal-info panel-center-modal',
        templateUrl: 'modules/system/client/views/default-message-modal.client.view.html',
        resolve: { data: function(){ return { title: title, message: message }; } }
      });
    };

    this.launchDefaultWarningModal = function(title, message){
      return $uibModal.open({
        animation: true, size: 'md', backdrop: 'static',
        controller: 'DefaultModalController',
        windowClass: 'fade modal-danger panel-center-modal',
        templateUrl: 'modules/system/client/views/default-message-modal.client.view.html',
        resolve: { data: function(){ return { title: title, message: message }; } }
      });
    };

    this.launchWalkinLiabilityModal = function(){
      return $uibModal.open({
        animation: true, size: 'lg', backdrop: 'static',
        controller: 'DefaultModalController',
        windowClass: 'fade modal-warning',
        templateUrl: 'modules/customer/client/views/walkin/walkin-liability-modal.client.view.html',
        resolve: { data: function(){ return { }; } }
      });
    };
    
    this.launchWalkinViewModal = function(walkin){
      $uibModal.open({
        animation: true, size: 'lg', backdrop: 'static',
        controller: 'DefaultModalController',
        windowClass: 'fade modal-primary panel-center-modal',
        templateUrl: 'modules/technician/client/views/walkin/walkin-view-modal.client.view.html',
        resolve: { data: function(){ return { walkin: walkin }; } }
      });
    };
    
    this.launchCheckinLiabilityModal = function(displayName){
      return $uibModal.open({
        animation: true, size: 'lg', backdrop: 'static',
        controller: 'DefaultModalController',
        windowClass: 'fade modal-warning panel-center-modal',
        templateUrl: 'modules/technician/client/views/checkin/checkin-liability-modal.client.view.html',
        resolve: { data: function(){ return { displayName: displayName }; } }
      });
    };

    this.launchCheckinViewModal = function(checkin){
      $uibModal.open({
        animation: true, size: 'lg', backdrop: 'static',
        controller: 'DefaultModalController',
        windowClass: 'fade modal-primary panel-center-modal',
        templateUrl: 'modules/technician/client/views/checkin/checkin-view-modal.client.view.html',
        resolve: { data: function(){ return { checkin : checkin }; } }
      });
    };

    // Return a promise
    this.launchDefaultInputModal = function(title, message, placeholder){
      return $uibModal.open({
        animation: true, size: 'md', backdrop: 'static',
        controller: 'DefaultModalController',
        windowClass: 'fade modal-warning panel-center-modal',
        templateUrl: 'modules/system/client/views/default-input-modal.client.view.html',
        resolve: { data: function(){ return { title: title, message: message, placeholder: placeholder }; } }
      });
    };
  }
]);
