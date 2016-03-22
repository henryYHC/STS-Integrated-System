'use strict';

angular.module('system').service('ModalLauncher', ['$uibModal',
  function($uibModal){

    this.launchDefaultMessageModal = function(title, message){
      $uibModal.open({
        animation: true, size: 'md',
        controller: 'DefaultModalController',
        windowClass: 'fade modal-info technician-center-modal',
        templateUrl: 'modules/system/client/views/default-message-modal.client.view.html',
        resolve: { data: function(){ return { title: title, message: message }; } }
      });
    };

    // Return a promise
    this.launchDefaultInputModal = function(title, message, placeholder){
      return $uibModal.open({
        animation: true, size: 'md',
        controller: 'DefaultModalController',
        windowClass: 'fade modal-warning technician-center-modal',
        templateUrl: 'modules/system/client/views/default-input-modal.client.view.html',
        resolve: { data: function(){ return { title: title, message: message, placeholder: placeholder }; } }
      });
    };
  }
]);
