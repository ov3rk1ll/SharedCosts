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
        'api': 'http://localhost/sharedcost/api'
  }).config(function($stateProvider, $urlRouterProvider, $httpProvider) {   
      $httpProvider.interceptors.push('errorInterceptor'); 
      $urlRouterProvider.otherwise('/');
      
      $stateProvider
        .state('auth', {
          url: '/access_token={accessToken}&token_type={tokenType}&expires_in={expiresIn}',          
          template: 'auth',
          controller: function($state, $stateParams, $http, AuthService) {
            AuthService.login($stateParams.accessToken);
          }
        })
        .state('home', {
          url: '/{returnUrl}', //returnUrl',
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
      .state('projects', {
          url: '/list',
          templateUrl: 'views/projectlist.html',
          controller: 'ProjectlistCtrl',
          authenticate: true
        })
      .state('createproject', {
          url: '/list/add',          
          authenticate: true,
          onEnter: function($stateParams, $state, $modal, Entry, $http, settings) {
            console.log("add form");
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
      .state('project.edit', {
          url: '/entry/:entryid',
          authenticate: true,
          onEnter: function($stateParams, $state, $modal, Entry, $http, settings, $location, current, entries) {
            $modal.open({
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
                //members: function(members){ return members; /*$http.get(settings.api + '/projects/' + $stateParams.id + '/users');*/ },
                project: function(){ return current; }
              }        
            }).result.then(
                function() { $state.go('project',  {id: $stateParams.id}, {reload: true}); }, 
                function() { $state.go('project', {id: $stateParams.id}); }
            );
          }
        });
    }).run(function($rootScope, $state, AuthService, $cookies, $location){         
        $rootScope.$state = $state;
        
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
angular.module('sharedcostApp').factory( 'AuthService', function(settings, $http, $state, $cookies, $location, waitingDialog) {
  var currentUser = null;
  var currentList = null;
  return {
    oauth: function() {
      var clientId='174190054188-fnomfn083gohkmq9okkapqbevgitltnd.apps.googleusercontent.com';
      var scope='https://www.googleapis.com/auth/userinfo.email';
      var redirectUri='http://localhost:9000';
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
              $cookies.authtoken = token;
              dlg.close();
              if(returnUrl) $location.url(returnUrl); else $state.go('home');
            } else {
              $cookies.authtoken = '';
              dlg.close();
              $state.go('home');
            }
          }).
          error(function(status) {
            console.log(status);
          });
    },
    logout: function() {
        $http.get(settings.api + '/logout').
          success(function() {
            currentUser = null;
          }).
          error(function(status) {
            console.log(status);
          });
    },
    isLoggedIn: function() { return currentUser !== null; },
    currentUser: function() { return currentUser; },

    getCurrentList: function() { return currentList; },
    setCurrentList: function(list) { currentList = list; }
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
