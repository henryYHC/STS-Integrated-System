'use strict';

angular.module('system').service('ModalLauncher', ['$uibModal', '$document',
  function($uibModal, $document){

    this.launchDefaultMessageModal = function(title, message){
      return $uibModal.open({
        animation: true, size: 'md', backdrop: 'static',
        controller: 'DefaultModalController',
        windowClass: 'fade modal-info panel-center-modal',
        templateUrl: 'modules/system/client/views/default-message-modal.client.view.html',
        resolve: { data: function(){ return { title: title, message: message }; } }
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
