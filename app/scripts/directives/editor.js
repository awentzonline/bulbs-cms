'use strict';

angular.module('bulbsCmsApp')
  .provider('EditorOptions', function () {
    var _options = {
      "image": {
        "size": ["big", "medium", "small", "tiny"],
        "crop": ["original", "16x9", "1x1", "3x1"],
        "defaults": {
          "size": "big",
          "crop": "original",
          "image_id": 0,
          "caption": "",
          "url": "",
          "format": "jpg"
        },
        "template":
          "<div data-type=\"image\" class=\"onion-image image inline size-{{size}} crop-{{crop}}\" data-image-id=\"{{image_id}}\" data-size=\"{{size}}\" data-crop=\"{{crop}}\" data-format=\"{{format}}\"><div></div><span class=\"caption\">{{caption}}</span></div>"
      },
      "onion-video": {
        "size": ["big"],
        "crop": ["16x9"],
        "defaults": {
          "size": "big",
          "crop": "16x9"
        },
        "template":
          "<div data-type=\"onion-video\" class=\"onion-video video inline size-{{size}} crop-{{crop}}\" data-video-id=\"{{video_id}}\" data-size=\"{{size}}\" data-crop=\"{{crop}}\"><div><iframe src=\"/videos/embed?id={{video_id}}\"></iframe></div></div>"
      },
      "embed": {
        "size": ["original", "big", "small"],
        "crop": ["16x9", "4x3", "auto"],
        "defaults": {
          "size":"original",
          "crop": "auto",
          "body": ""
        },
        "template":
          "<div data-type=\"embed\" data-crop=\"{{crop}}\" class=\"inline embed size-{{size}} crop-{{crop}}\" data-source=\"{{source}}\" data-body=\"{{escapedbody}}\"><div>{{body}}</div><span class=\"caption\">{{caption}}</span></div>"
      },
      "youtube": {
        "size": ["big"],
        "crop": ["16x9", "4x3"],
        "defaults": {
          "size": "big",
          "crop": "16x9",
          "youtube_id": "foMQX9ZExsE",
          "caption": ""
        },
        "template":
        "<div data-type=\"youtube\" class=\"youtube inline size-{{size}} crop-{{crop}}\" data-youtube-id=\"{{youtube_id}}\" data-size=\"{{size}}\" data-crop=\"{{crop}}\"><div><img src=\"http://img.youtube.com/vi/{{youtube_id}}/hqdefault.jpg\"></div<span class=\"caption\">{{caption}}</span></div>"
      },
      "hr": {
        "template":  "<hr/>"
      }
    };

    this.setOptions = function(options) {
      _options = options;
    };

    this.$get = function () {
      return {
        getOptions: function () {
          return _options;
        }
      };
    };

  })
  .directive('onionEditor', function (routes, $, Zencoder, BettyCropper, openImageCropModal, EditorOptions, VIDEO_EMBED_URL) {

    /* Gab configuration out of .  */

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
            
            inlineObjects:'/views/inline-objects.json',

            image: {
              onInsert: BettyCropper.upload,
              onEdit: openImageCropModal,
            },
            video: {
              onInsert: Zencoder.onVideoFileUpload,
              onEdit: function() {},
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