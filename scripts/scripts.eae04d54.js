"use strict";angular.module("sharedcostApp",["ngAnimate","ngCookies","ngResource","ngSanitize","ngTouch","ui.router","angular-loading-bar","ui.bootstrap","ChartAngular"]).constant("settings",{api:"http://api.ov3rk1ll.com/sharedcosts"}).config(["$stateProvider","$urlRouterProvider","$httpProvider",function(a,b,c){c.interceptors.push("errorInterceptor"),b.otherwise("/");var d;a.state("auth",{url:"/access_token={accessToken}&token_type={tokenType}&expires_in={expiresIn}",template:"auth",controller:["$state","$stateParams","$http","AuthService",function(a,b,c,d){d.login(b.accessToken)}]}).state("logout",{url:"/logout",template:"auth",controller:["$state","$stateParams","$http","AuthService",function(a,b,c,d){d.logout()}]}).state("home",{url:"/{returnUrl:(?:/[^/]+)?}",templateUrl:"views/main.html",controller:"MainCtrl"}).state("projects",{url:"/list",templateUrl:"views/projectlist.html",controller:"ProjectlistCtrl",authenticate:!0}).state("projectsettings",{url:"/list/:id/edit",templateUrl:"views/projectedit.html",controller:"ProjecteditCtrl",authenticate:!0,resolve:{current:["$stateParams","List",function(a,b){return"new"==a.id?new b:b.get({id:a.id}).$promise}]}}).state("project",{url:"/list/:id",templateUrl:"views/projectdetail.html",controller:"ProjectdetailCtrl",authenticate:!0,resolve:{current:["$stateParams","List",function(a,b){return b.get({id:a.id}).$promise}],entries:["$stateParams","Entry",function(a,b){return b.query({projectId:a.id}).$promise}]}}).state("project.entries",{url:"/entry/:entryid",authenticate:!0,onEnter:["$stateParams","$state","$modal","Entry","$http","current","entries","$location",function(a,b,c,e,f,g,h,i){d=c.open({templateUrl:"views/entryedit.html",controller:"EntryeditCtrl",resolve:{item:function(){var b=i.search().clone?i.search().clone:a.entryid;for(var c in h)if(h[c].id==b)return h[c];return new e},project:function(){return g}}}),d.result.then(function(){b.go("project",{id:a.id},{reload:!0})},function(){b.go("project",{id:a.id})})}],onExit:function(){d&&d.dismiss()}})}]).run(["$rootScope","$state","AuthService","$cookies","$location",function(a,b,c,d,e){a.$state=b,a.$title="Home",a.$watch(c.isLoggedIn,function(b){a.$isLoggedIn=b,a.$currentUser=c.currentUser()}),a.$on("$stateChangeStart",function(a,d){d.authenticate&&!c.isLoggedIn()&&(b.transitionTo("home",{returnUrl:e.url()}),a.preventDefault())}),a.selectList=function(a){c.setCurrentList(a),b.go("project",{id:a.id})}}]),angular.module("sharedcostApp").factory("AuthService",["settings","$http","$state","$cookieStore","$location","waitingDialog",function(a,b,c,d,e,f){var g=null;return{oauth:function(){var a="197856423856-rg60fvq6n1g2ouh00sc70b8cnf1puqt7.apps.googleusercontent.com",b="https://www.googleapis.com/auth/plus.login",c="http://ov3rk1ll.github.io/SharedCosts",d="token",e="https://accounts.google.com/o/oauth2/auth?scope="+b+"&client_id="+a+"&redirect_uri="+c+"&response_type="+d;window.location.replace(e)},login:function(h,i){var j=f.show("Signing you in...");b.post(a.api+"/login/google",{token:h}).success(function(a){var f=a.status;"ok"==f?(g=a.user,b.defaults.headers.common.session=a.session,d.put("authtoken",h),j.close(),i?e.url(i):c.go("home")):(d.remove("authtoken"),j.close(),c.go("home"))}).error(function(a){console.log(a)})},logout:function(){var e=f.show("Logging you out...");b.get(a.api+"/logout").success(function(){g=null,d.remove("authtoken"),e.close(),c.go("home")}).error(function(a){console.log(a)})},isLoggedIn:function(){return null!==g},currentUser:function(){return g},hasPermission:function(a,b){for(var c in a.members)if(a.members[c].id==g.user_id){var d=parseInt(a.members[c].level)&parseInt(b);if(d>0)return!0}return!1}}}]).factory("errorInterceptor",["$q",function(a){return{request:function(b){return b||a.when(b)},requestError:function(b){return a.reject(b)},response:function(b){return b||a.when(b)},responseError:function(b){return b&&404===b.status,b&&403===b.status?void window.alert(b.data.error.message):(b&&b.status>=500,a.reject(b))}}}]),angular.module("sharedcostApp").factory("List",["$resource","settings",function(a,b){return a(b.api+"/projects/:id",{id:"@id"},{})}]).factory("Entry",["$resource","settings",function(a,b){return a(b.api+"/projects/:projectId/entries/:id",{projectId:"@projectId",id:"@id"},{})}]),angular.module("sharedcostApp").controller("MainCtrl",["$scope","$rootScope","$stateParams","AuthService","$cookieStore",function(a,b,c,d,e){b.$title="Home",e.get("authtoken")&&!d.isLoggedIn()&&d.login(e.get("authtoken"),c.returnUrl),a.$watch(d.isLoggedIn,function(b){a.isLoggedIn=b,a.currentUser=d.currentUser()}),a.login=function(){d.oauth()},a.logout=function(){d.oauth()}}]),angular.module("sharedcostApp").controller("ProjectlistCtrl",["$scope","List","$rootScope",function(a,b,c){c.$title="List",b.query(function(b){a.projects=b})}]),angular.module("sharedcostApp").directive("userbadge",function(){return{template:'<span class="userbadge"><img ng-src="{{ user.picture }}" alt="{{ user.name }}" class="img-circle" style="max-height: 18px;"> {{ user.name }}</span> ',restrict:"E",scope:{user:"="}}}).directive("bitpermissions",["$compile",function(){return{require:"ngModel",scope:{ngModel:"="},link:function(a,b,c,d){d.$parsers.push(function(b){var d=parseInt(a.ngModel);return b?d|=parseInt(c.bit):d&=~parseInt(c.bit),d}),d.$formatters.push(function(a){var b=parseInt(a)&parseInt(c.bit);return b>0?!0:!1})}}}]),angular.module("sharedcostApp").controller("ProjectdetailCtrl",["$scope","$rootScope","current","entries","AuthService",function(a,b,c,d,e){b.$title=c.data.name,a.project=c,a.entries=d,a.members=c.members,a.chartMembers={},a.group={open:!1},a.hasPermission=e.hasPermission,a.$watch("group.open",function(b){b&&!a.chartMembers.data&&a.renderChart()}),a.renderChart=function(){var b=[];for(var c in a.members)b.push({label:a.members[c].name,value:a.members[c].paid});a.chartMembers={data:b}}}]),angular.module("sharedcostApp").controller("NavigationCtrl",["$scope","$rootScope","List","AuthService",function(a,b,c,d){a.$watch(d.isLoggedIn,function(b){b&&c.query(function(b){a.projects=b})}),b.$watch("$state",function(){}),b.$on("$stateChangeStart",function(){a.setSidebarState(!1)}),a.$on("projectWasChanged",function(b,d){console.log(d),c.query(function(b){a.projects=b})}),a.login=function(){d.oauth()},a.logout=function(){d.oauth()};var e=".navbar-toggle",f="#page-content",g=".navbar-header",h="0px",i="-100%",j="-80%";a.setupSidebar=function(){$("#slide-nav.navbar .container").append($('<div id="navbar-height-col"></div>')),$("#slide-nav.navbar .container").append($('<div id="navbar-height-col-outside"></div>')),$("#slide-nav").on("click",e,function(){var b=$(this).hasClass("slide-active");a.setSidebarState(!b)}),$("#navbar-height-col-outside").on("click",function(){$(e).click()});var b="#slidemenu, #page-content, body, .navbar, .navbar-header";$(window).on("resize",function(){$(window).width()>767&&$(".navbar-toggle").is(":hidden")&&$(b).removeClass("slide-active")})},a.setSidebarState=function(a){$("#slidemenu").stop().animate({left:a?"0px":i}),$("#navbar-height-col").stop().animate({left:a?"0px":j}),$("#navbar-height-col-outside").stop().animate({left:a?"0px":"-100%"}),$(f).stop().animate({left:a?h:"0px"}),$(g).stop().animate({left:a?h:"0px"}),$(".navbar-toggle").toggleClass("slide-active",a),$("#slidemenu").toggleClass("slide-active",a),$("#page-content, .navbar, body, .navbar-header").toggleClass("slide-active",a)},a.setupSidebar()}]),angular.module("sharedcostApp").controller("EntryeditCtrl",["$scope","item","project","$location",function(a,b,c,d){d.search().clone&&(b.id=""),a.item=b,a.projectId=c.data.id,a.members=c.members,a.dateOptions={startingDay:1},a.format="dd.MM.yyyy",a.open=function(b){b.preventDefault(),b.stopPropagation(),a.opened=!0},a.dismiss=function(){a.$dismiss()},a.save=function(){b.$save({projectId:a.projectId}).then(function(){a.$close(!0)})},a.remove=function(){window.confirm("Are you sure?")&&b.$delete({projectId:a.projectId}).then(function(){a.$close(!0)})}}]),angular.module("sharedcostApp").provider("waitingDialog",function(){var a=angular.element('<div class="modal-dialog modal-m"><div class="modal-content"><div class="modal-header"><h3 style="margin:0;"></h3></div><div class="modal-body"><div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div></div></div></div>');this.$get=["$modal",function(b){return{show:function(c,d){"undefined"==typeof d&&(d={});var e=$.extend({progressType:"material-yellow-A700"},d);return"undefined"==typeof c&&(c="Loading"),a.find(".progress-bar").attr("class","progress-bar"),e.progressType&&a.find(".progress-bar").addClass("progress-bar-"+e.progressType),a.find("h3").text(c),b.open({template:a.html(),backdrop:"static",keyboard:!1})},hide:function(){$dialog.modal("hide")}}}]}),angular.module("sharedcostApp").controller("ProjecteditCtrl",["$scope","$rootScope","$state","current","$http","settings","AuthService",function(a,b,c,d,e,f,g){a.item=d;var h=a.item.data?a.item.data.id:null;console.log(h),!g.hasPermission(d,4)&&h&&c.go("home"),h||(a.item.members=[{name:g.currentUser().name,picture:g.currentUser().picture,level:15,id:g.currentUser().user_id}]),a.remove=function(a,b){a.splice(b,1)},a.add=function(b){a.item.members.push({name:b.authid.name,picture:b.authid.picture,level:b.level,authid:b.authid.id,id:"0",provider:"google"}),a.newuser={}},a.save=function(){a.item.$save(function(a){b.$broadcast("projectWasChanged",a.data.id),h?window.alert("Saved"):c.go("project",{id:a.data.id})})},a.getLocation=function(a){return e.get(f.api+"/user/suggest",{params:{query:a}}).then(function(a){return console.log(a),a.data.map(function(a){return{name:a.displayName,picture:a.image.url,id:a.id}})})}}]);