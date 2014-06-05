'use strict';

angular.module('bulbsCmsApp')
  .directive('sectionsField', function (routes, _, IfExistsElse, ContentApi) {
    return {
      templateUrl: routes.PARTIALS_URL + 'taglike-autocomplete-field.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.name = 'section';
        scope.label = 'Sections';
        scope.placeholder = 'Enter a section';
        scope.resourceUrl = '/cms/api/v1/tag/?ordering=name&types=core_section&search=';
        scope.display = function (o) {
          return o.name;
        };

        scope.$watch('article.tags', function(){
          scope.objects = _.where(article.tags, {type: 'core_section'});
        }, true);

        scope.add = function (o, input, freeForm) {
          var tagVal = freeForm ? o : o.name;
          IfExistsElse.ifExistsElse(
            ContentApi.all('tag').getList({
              ordering: 'name',
              search: tagVal
            }),
            {name: tagVal},
            function (tag) { scope.article.tags.push(tag); },
            function () { console.log('Can\'t create sections.'); },
            function (data, status) { if (status === 403) { Login.showLoginModal(); } }
          );
          $(input).val('');
        };

        scope.delete = function (e) {
          var tag = $(e.target).parents('[data-taglikeobject]').data('taglikeobject');
          var name = tag.name;
          var newtags = [];
          for (var i in scope.article.tags) {
            if (scope.article.tags[i].name !== name) {
              newtags.push(scope.article.tags[i]);
            }
          }
          scope.article.tags = newtags;
        };

        scope.div1classes = 'col-sm-8';
        scope.h1classes = 'h6 col-xs-12';
        scope.div2classes = 'col-sm-4 form-group';
        scope.div3classes = 'col-sm-8';

      }
    };
  });
