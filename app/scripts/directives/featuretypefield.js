'use strict';

angular.module('bulbsCmsApp')
  .directive('featuretypeField', function (routes, IfExistsElse, ContentApi, Raven) {
    return {
      templateUrl: routes.PARTIALS_URL + 'textlike-autocomplete-field.html',
      restrict: 'E',
      scope: {
        article: '='
      },
      replace: true,
      link: function postLink(scope, element, attrs) {
        scope.name = 'feature_type';
        scope.label = 'Feature Type';
        scope.placeholder = 'Feature Type';
        scope.resourceUrl = '/cms/api/v1/things/?type=feature_type&q=';

        scope.$watch('article.feature_type', function(){
          scope.model = scope.article.feature_type;
        });

        scope.display = function (o) {
          return (o && o.name) || '';
        };

        scope.add = function (o, input, freeForm) {
          var fVal = freeForm ? o : o.name;
          IfExistsElse.ifExistsElse(
            ContentApi.all('things').getList({
              type: 'feature_type',
              q: fVal
            }),
            {name: fVal},
            function (ft) { scope.article.feature_type = ft.name; $('#feature-type-container').removeClass('newtag'); },
            function (value) { scope.article.feature_type = value.name; $('#feature-type-container').addClass('newtag'); },
            function (data, status) { Raven.captureMessage('Error Adding Feature Type', {extra: data}); }
          );
        };

        scope.delete = function (e) {
          article.feature_type = null;
        };

      }
    };
  });
