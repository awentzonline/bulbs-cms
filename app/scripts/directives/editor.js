'use strict';

angular.module('bulbsCmsApp')
  .directive('onionEditor', function (routes, $, Zencoder, BettyCropper, openImageCropModal, VIDEO_EMBED_URL) {
    return {
      require: 'ngModel',
      replace: true,
      restrict: 'E',
      templateUrl: routes.PARTIALS_URL + 'editor.html',
      scope: {ngModel:'='},
      link: function(scope, element, attrs, ngModel) {

        if (!ngModel) {
          return;
        }

        var formatting;
        if (attrs.formatting) {
          formatting = attrs.formatting.split(",");
        }

        if (attrs.role == "multiline") {
          var options = {
            /* global options */
            onContentChange: read,
            multiline: true,
            
            formatting: formatting || ['link', 'bold','italic','blockquote','heading','list'],
            
            placeholder: {
              text: attrs.placeholder ||  "<p>Write here</p>",
              container: $(".editorPlaceholder", element[0])[0],
            },

            link: {
              domain: "avclub.com"
            },

            statsContainer: ".wordcount",
            
            inlineObjects: attrs.inlineObjects,

            image: {
              insertDialog: BettyCropper.upload,
              editDialog: openImageCropModal,
            },
            video: {
              insertDialog: Zencoder.onVideoFileUpload,
              editDialog: function() {},
              videoEmbedUrl: VIDEO_EMBED_URL
            }
          }
        }
        else {
          $(".document-tools, .embed-tools", element).hide();
          var defaultValue = "";
          var options = {
            /* global options */
            multiline: false,
            onContentChange: read,
            placeholder: {
              text: attrs.placeholder ||  "<p>Write here</p>",
              container: $(".editorPlaceholder", element[0])[0],
            },
            formatting: formatting || []
          }
        }

        var editor = new OnionEditor($(".editor", element[0])[0], options);

        ngModel.$render = function() {
          editor.setContent(ngModel.$viewValue || defaultValue);
        }
        // Write data to the model
        function read() {
          scope.$apply(function(){
            var html = editor.getContent();
            ngModel.$setViewValue(html);
          });
        }

        scope.$watch(ngModel, function() {
          editor.setContent(ngModel.$viewValue || defaultValue);
        });
      }
    };
  });