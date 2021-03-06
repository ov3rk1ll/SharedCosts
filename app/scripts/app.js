'use strict';

/**
 * @ngdoc overview
 * @name sharedcostApp
 * @description
 * # sharedcostApp
 *
 * Main module of the application.
 */
angular
  .module('sharedcostApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'angular-loading-bar',
    'ui.bootstrap',
    'ChartAngular'
  ]).constant('settings', {
        'api': 'http://api.ov3rk1ll.com/sharedcosts'
  }).config(function($stateProvider, $urlRouterProvider, $httpProvider) {   
      $httpProvider.interceptors.push('errorInterceptor'); 
      $urlRouterProvider.otherwise('/');

      var modalInstance;

      $stateProvider
        .state('auth', {
          url: '/access_token={accessToken}&token_type={tokenType}&expires_in={expiresIn}',          
          template: 'auth',
          controller: function($state, $stateParams, $http, AuthService) {
            AuthService.login($stateParams.accessToken);
          }
        })
        .state('logout', {
          url: '/logout',          
          template: 'auth',
          controller: function($state, $stateParams, $http, AuthService) {
            AuthService.logout();
          }
        })
        .state('home', {
          url: '/{returnUrl:(?:/[^/]+)?}', //returnUrl',
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
      .state('projects', {
          url: '/list',
          templateUrl: 'views/projectlist.html',
          controller: 'ProjectlistCtrl',
          authenticate: true
        })
      /*.state('createproject', {
          url: '/list/add',          
          authenticate: true,
          onEnter: function($stateParams, $state, $modal, Entry, $http, settings) {
            console.log('add form');
          }
        })*/
      .state('projectsettings', {
          url: '/list/:id/edit',
          templateUrl: 'views/projectedit.html',
          controller: 'ProjecteditCtrl',
          authenticate: true,
          resolve: {
            current: function($stateParams, List){ return $stateParams.id == 'new' ? new List() : List.get({id:$stateParams.id}).$promise; }
          }
        })
      .state('project', {
          url: '/list/:id',
          templateUrl: 'views/projectdetail.html',
          controller: 'ProjectdetailCtrl',
          authenticate: true,
          resolve: {
            current: function($stateParams, List){ return List.get({id:$stateParams.id}).$promise; },
            entries: function($stateParams, Entry){ return Entry.query({projectId:$stateParams.id}).$promise; }
          }
        })
      .state('project.entries', {
          url: '/entry/:entryid',
          authenticate: true,
          onEnter: function($stateParams, $state, $modal, Entry, $http, current, entries, $location) {
            modalInstance = $modal.open({
              templateUrl: 'views/entryedit.html',
              controller: 'EntryeditCtrl',
              resolve: { 
                item: function(){
                  var entryid = $location.search().clone ? $location.search().clone : $stateParams.entryid;
                  // find entryid in entries
                  for(var e in entries){
                    if(entries[e].id == entryid) {
                      return entries[e];
                    }
                  }
                  return new Entry();
                },
                project: function(){ return current; }
              }        
            });
            modalInstance.result.then(
                function() { $state.go('project',  {id: $stateParams.id}, {reload: true}); }, 
                function() { $state.go('project', {id: $stateParams.id}); }
            );
          },
          onExit: function() {
            if (modalInstance) {
                modalInstance.dismiss();
            }
          }
        });
    }).run(function($rootScope, $state, AuthService, $cookies, $location){         
        $rootScope.$state = $state;
        $rootScope.$title = 'Home';
        
        $rootScope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
            $rootScope.$isLoggedIn = isLoggedIn;
            $rootScope.$currentUser = AuthService.currentUser();
        });
        
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
          if (toState.authenticate && !AuthService.isLoggedIn()){
            $state.transitionTo("home", {returnUrl: $location.url()});
            event.preventDefault(); 
          }
        });

        $rootScope.selectList = function(list){ 
          AuthService.setCurrentList(list);
          $state.go('project', {id: list.id});
        };
    });
    
    // http://stackoverflow.com/questions/14206492/how-do-i-store-a-current-user-context-in-angular
angular.module('sharedcostApp').factory( 'AuthService', function(settings, $http, $state, $cookieStore, $location, waitingDialog) {
  var currentUser = null;
  var currentList = null;
  return {
    oauth: function() {
      var clientId='197856423856-rg60fvq6n1g2ouh00sc70b8cnf1puqt7.apps.googleusercontent.com';
      var scope='https://www.googleapis.com/auth/plus.login';
      var redirectUri= /*'http://localhost:9000'; */ 'http://ov3rk1ll.github.io/SharedCosts';
      var responseType='token';
      var url='https://accounts.google.com/o/oauth2/auth?scope='+scope+'&client_id='+clientId+'&redirect_uri='+redirectUri+'&response_type='+responseType;
      window.location.replace(url);
    },
    login: function(token, returnUrl) {
        var dlg = waitingDialog.show("Signing you in...");
        $http.post(settings.api + '/login/google', {'token': token}).
          success(function(data) {
            var status = data.status;
            if(status == 'ok'){
              currentUser = data.user;
              $http.defaults.headers.common['session'] = data.session;
              $cookieStore.put('authtoken', token);
              dlg.close();
              if(returnUrl) $location.url(returnUrl); else $state.go('home');
            } else {
              $cookieStore.remove('authtoken');
              dlg.close();
              $state.go('home');
            }
          }).
          error(function(status) {
            console.log(status);
          });
    },
    logout: function() {
        var dlg = waitingDialog.show("Logging you out...");
        $http.get(settings.api + '/logout').
          success(function() {
            currentUser = null;
            $cookieStore.remove('authtoken');
            dlg.close();
            $state.go('home');
          }).
          error(function(status) {
            console.log(status);
          });
    },
    isLoggedIn: function() { return currentUser !== null; },
    currentUser: function() { return currentUser; },

    hasPermission: function(project, permission) {
      for (var m in project.members){
        if(project.members[m].id == currentUser.user_id){
          var x = parseInt(project.members[m].level) & parseInt(permission);
          if(x > 0) return true;
        }
      }
      return false;
    }
  };
}).factory('errorInterceptor', function ($q) {
        return {
            request: function (config) {
                return config || $q.when(config);
            },
            requestError: function(request){
                return $q.reject(request);
            },
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (response && response.status === 404) {
                }
                if (response && response.status === 403) {
                  window.alert(response.data.error.message);
                  return;
                }
                if (response && response.status >= 500) {
                }
                return $q.reject(response);
            }
        };
});
