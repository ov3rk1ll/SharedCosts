'use strict';

/**
 * @ngdoc function
 * @name sharedcostApp.controller:NavigationCtrl
 * @description
 * # NavigationCtrl
 * Controller of the sharedcostApp
 */
angular.module('sharedcostApp')
  .controller('NavigationCtrl', function ($scope, $rootScope, List, AuthService) {
  	$scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
        if(isLoggedIn){
        	List.query(function(data){
		        $scope.projects = data;
		    });
        }
     });

  	$rootScope.$watch('$state', function ( state ) {
    	
    });

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      $scope.setSidebarState(false);
    });

    $scope.$on('projectWasChanged', function (event, data) {
      console.log(data); // 'Data to send'
      List.query(function(data){
            $scope.projects = data;
        });
    });

    $scope.login = function(){ AuthService.oauth(); };

    $scope.logout = function(){ AuthService.oauth(); };
    

    // Enter your ids or classes
    var toggler = '.navbar-toggle';
    var pagewrapper = '#page-content';
    var navigationwrapper = '.navbar-header';
    var menuwidth = '100%'; // the menu inside the slide menu itself
    var slidewidth = '0px'; //'80%';
    var menuneg = '-100%';
    var slideneg = '-80%';

    $scope.setupSidebar = function () {
          //stick in the fixed 100% height behind the navbar but don't wrap it
          $('#slide-nav.navbar .container').append($('<div id="navbar-height-col"></div>'));
          $('#slide-nav.navbar .container').append($('<div id="navbar-height-col-outside"></div>'));

          $("#slide-nav").on("click", toggler, function (e) {
              var selected = $(this).hasClass('slide-active');
              $scope.setSidebarState(!selected);

          });

          $("#navbar-height-col-outside").on("click", function (e) {
            $(toggler).click();
          });

          var selected = '#slidemenu, #page-content, body, .navbar, .navbar-header';

          $(window).on("resize", function () {
              if ($(window).width() > 767 && $('.navbar-toggle').is(':hidden')) {
                  $(selected).removeClass('slide-active');
              }
          });
      };

      $scope.setSidebarState = function(open){
        $('#slidemenu').stop().animate({
            left: !open ? menuneg : '0px'
        });

        $('#navbar-height-col').stop().animate({
            left: !open ? slideneg : '0px'
        });

        $('#navbar-height-col-outside').stop().animate({
            left: !open ? '-100%' : '0px'
        });

        $(pagewrapper).stop().animate({
            left: !open ? '0px' : slidewidth
        });

        $(navigationwrapper).stop().animate({
            left: !open ? '0px' : slidewidth
        });
        $('.navbar-toggle').toggleClass('slide-active', open);
        $('#slidemenu').toggleClass('slide-active', open);
        $('#page-content, .navbar, body, .navbar-header').toggleClass('slide-active', open);

      }

      $scope.setupSidebar();

  });
