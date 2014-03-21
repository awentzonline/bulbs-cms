'use strict';

angular.module('bulbsCmsApp')
  .controller('ContentListCtrl', function ($scope, $http, $timeout, $location, $routeParams, $window, $, _, ContentApi) {

    //set title
    $window.document.title = 'AVCMS | Content';

    $scope.search = $location.search().search;
    $scope.queue = $routeParams.queue || 'all';
    $scope.pageNumber = $routeParams.pageNumber || '1';
    $scope.contentPage = {};
    $scope.myStuff = false;

    function updateIsMyStuff(){
        if(!$location.search().authors){
          $scope.myStuff = false;
          return;
        }
        var authors = $location.search().authors;
        if(typeof(authors) === 'string'){
          authors = [authors];
        }
        if(authors.length === 1 && authors[0] === $window.currentUser){
          $scope.myStuff = true;
        }else{
          $scope.myStuff = false;
        }
      }
    updateIsMyStuff();

    $scope.$on('$routeUpdate', function(){
        updateIsMyStuff();
      });

    $scope.$watch('myStuff', function(){
        if($scope.myStuff){
          $('#meOnly').bootstrapSwitch('setState', true, true);
        }else{
          $('#meOnly').bootstrapSwitch('setState', false, true);
        }
      });

    $('#meOnly').on('switch-change', function (e,data) {
        var value = data.value;
        if(value === true){
          $location.search().authors = [$window.currentUser];
          $scope.getContent();
        } else if (value === false){
          delete $location.search().authors;
          $scope.getContent();
        }
      });

    $scope.getContent = function(){
        $scope.contentPage = ContentApi.Content.query({
          status: $scope.queue,
          page: $scope.pageNumber,
          ordering: $scope.ordering
        });
      };
    $scope.getContent();

    $scope.goToPage = function(page){
        $location.search(_.extend($location.search(), {'page':page}));
        $scope.getContent();
      };

    $scope.sort = function(sort){
        if($location.search().ordering && $location.search().ordering.indexOf(sort) === 0){
          sort = '-' + sort;
        }
        $location.search(_.extend($location.search(), {'ordering': sort}));
        $scope.getContent();
      };

    $scope.publishSuccessCbk = function(article, data){
        var i;
        for(i=0; i<$scope.articles.length; i++){
          if($scope.articles[i].id === article.id){
            break;
          }
        }
        for(var field in data){ $scope.articles[i][field] = data[field]; }
      };

    $scope.trashSuccessCbk = function(){
        $timeout(function(){
            $scope.getContent();
            $('#confirm-trash-modal').modal('hide');
          }, 1500);
      };

    $('.expcol').click(function(e) {
        e.preventDefault();
        var nS = $(this).attr('state') === '1' ? '0' : '1',
            i = nS ? 'minus' : 'plus',
            t = nS ? 'Collapse' : 'Expand',
            tP = $( $(this).attr('href') ).find('.panel-collapse');

        if ( $(this).attr('state')==='0' ) { tP.collapse('show'); }
        else { tP.collapse('hide'); }
        $(this).html('<i class=\"fa fa-' + i + '-circle\"></i> ' + t + ' all');
        $(this).attr('state',nS);
      });

    $('#meOnly').bootstrapSwitch();

  })
  .directive('ngConfirmClick', [ // Used on the unpublish button
    function(){
      return {
        link: function (scope, element, attr) {
          var msg = attr.ngConfirmClick || 'Are you sure?';
          var clickAction = attr.confirmedClick;
          element.bind('click',function(){
            if(window.confirm(msg)){
              scope.$eval(clickAction);
            }
          });
        }
      };
    }
  ]);