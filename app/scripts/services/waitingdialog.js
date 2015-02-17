'use strict';

/**
 * @ngdoc service
 * @name sharedcostApp.waitingDialog
 * @description
 * # waitingDialog
 * Provider in the sharedcostApp.
 */
angular.module('sharedcostApp')
  .provider('waitingDialog', function () {

    // Private variables
    var $template = angular.element(
    '<div class="modal-dialog modal-m">' +
    '<div class="modal-content">' +
      '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
      '<div class="modal-body">' +
        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
      '</div>' +
    '</div></div>');

    // Method for instantiating
    this.$get = function ($modal) {
      return {
        show: function (message, options) {
          // Assigning defaults
          if (typeof options === 'undefined') {
            options = {};
          }
          var settings = $.extend({
            progressType: 'primary'
          }, options);
          if (typeof message === 'undefined') {
            message = 'Loading';
          }
          // Configuring dialog
          $template.find('.progress-bar').attr('class', 'progress-bar');
          if (settings.progressType) {
            $template.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
          }
          $template.find('h3').text(message);
          // Opening dialog
          return $modal.open({
            template : $template.html(),
            backdrop: 'static',
            keyboard: false
          }); // end modal.open
        },
        /**
         * Closes dialog
         */
        hide: function () {
          $dialog.modal('hide');
        }
    }
  }
});
