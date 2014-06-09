/*

Image

This bridges the embed module that the editor exposes & our custom image implementation.

*/

(function(global) {
   'use strict';
    var OnionCmsUI = OnionCmsUI  || function(editor, options) {
        var toolbarPosition;
        function init() {
            toolbarPosition = $("#content-body .document-tools").offset().top + 12;
            $(window).scroll(function() {

                if (window.scrollY > toolbarPosition) {
                    $("#content-body .document-tools").addClass("fixed")
                }
                else {
                    $("#content-body .document-tools").removeClass("fixed")
                }
            });

            key('⌘+s, ctrl+s', function(e) { e.preventDefault(); }); //SAVE })
        }
        function destroy() {
            key.unbind('⌘+s, ctrl+s');
        }
        editor.on("init", init)
    }
    global.EditorModules.push(OnionCmsUI);
})(this);





(function(global) {
    'use strict';
    var OnionImage = OnionImage || function(editor, options) {

        editor.on("inline:edit:image", editImage);
        editor.on("inline:insert:image", uploadImage);

        function uploadImage(options) {

            //CHANGE THIS METHOD DO SOMETHING SET VIA OPTIONS
            global.uploadImage({onProgress: onProgress,
                                onSuccess: onSuccess,
                                onError: onError,
                                onCancel: onCancel})

            // insert image status overlay.
            function onProgress() {
                //update an indicator
            }

            function onSuccess(data) {
                //insert image.
                options.onSuccess(options.block, {image_id: data.id});
                window.picturefill();
            }

            function onError() {
                //show msg, allow user to trigger upload again
            }

            function onCancel() {
                //remove placeholder. Call it a day.
            }
        }

        var activeElement,
            current_id;

        function editImage(options) {

            current_id = options.element.getAttribute('data-image-id');
            openImageDrawer(current_id, onDrawerImageChange, onDrawerSave, onDrawerCancel);

            // openImageCropModal(current_id).then(
            //     function () {
            //         $(options.element).attr('data-image-id', current_id);
            //         window.picturefill();
            //     }
            // );

            function onDrawerImageChange(id) {
                $(options.element).attr('data-image-id', id);
                window.picturefill();
            }

            function onDrawerSave() {

            }

            function onDrawerCancel(oldId) {

            }
        }
    }
    global.EditorModules.push(OnionImage);
})(this);

(function(global) {
    'use strict';
    var OnionVideo = OnionVideo || function(editor, instanceOptions) {

        editor.on("inline:edit:onion-video", editVideo);
        editor.on("inline:insert:onion-video", uploadVideo);

        editor.on("init", cleanup);

        function cleanup() {
            // hack alert: let's transform old embeds here. Not ideal, but whatever.
            var old_embeds = $("[data-type=embed] iframe[src^='/videos/embed']").parents("div.embed");
            for (var i = 0; i < old_embeds.length; i++) {
                var id = $("iframe", old_embeds[i]).attr("src").split("=")[1]
                $(old_embeds[i]).attr("data-videoid", id);
            }
            old_embeds
                .attr("data-type", "onion-video")
                .addClass("onion-video")
                .attr("data-size", "big")
                .attr("data-crop", "16x9")
                .removeClass("size-")
                .removeClass("crop-")
                .addClass("crop-16x9")
                .addClass("size-big");
        }

        function uploadVideo(options) {
            console.log("uploadvideo here", editor, instanceOptions, options)
            //return an identifier, for cancelling?
            var activeElement = options.onSuccess(options.block, {videoid:"NONE"});
            return instanceOptions.uploadVideo().then(
                function(videoObject){
                    setVideoID(videoObject.attrs.id);
                }, function(error){
                    onError(error);
                }, function(progress){
                    onProgress(progress);
                }
            );

            // insert image status overlay.

            function onProgress() {
                //update an indicator
            }

            function setVideoID(id) {
                //insert image.
                $("iframe", activeElement).attr("src", instanceOptions.videoEmbedUrl + id);
                $(activeElement).attr('data-videoid', id)
            }

            function onError() {
                //show msg, allow user to trigger upload again
            }

            function onCancel() {
                //remove placeholder. Call it a day.
            }
        }

        function editVideo(el) {
            var id = $(el.element).data('videoid');
            window.editVideo(id);
        }
    }
    global.EditorModules.push(OnionVideo);
})(this);

(function(global) {
    'use strict';
    var ArticleList = ArticleList || function(editor, options) {
        //editor.on("inline:edit:articlelist", editImage);
        editor.on("inline:insert:articlelist", insert);
        function insert(options) {
            options.onSuccess(options.block, {})
        }
    }
    global.EditorModules.push(ArticleList);
})(this);



(function(global) {
    'use strict';
    var Embed = Embed || function(editor, options) {
        var self = this;
        editor.on("inline:edit:embed", edit);
        editor.on("inline:insert:embed", insert);

        $("#embed-modal").on("hide.bs.modal", function() {
            $("#set-embed-button").unbind("click");
            $(".embed-error").hide();
        });


        function edit(opts) {
            //populate modal contents

            $("#embed-modal .embed-body").val(unescape($(opts.element).attr("data-body")));
            $("#embed-modal .embed-source").val($(opts.element).attr("data-source"));
            $("#embed-modal .embed-caption").val($(".caption", opts.element).text());


            $("#embed-modal").modal("show");
            $("#set-embed-button").click(function () {
                var embed_body = $("#embed-modal .embed-body").val();
                if (embed_body.trim() === "") {
                     $(".embed-error").show();
                }
                else {
                    $(".embed-error").hide();
                    opts.onChange(opts.element,
                        {body: embed_body,
                        caption: $("#embed-modal .embed-caption").val(),
                        source: $("#embed-modal .embed-source").val(),
                        escapedbody: escape(embed_body)
                    })
                    $("#embed-modal").modal("hide");

                }
            });
            $("#embed-modal").modal("show");
        }

        function insert(opts) {
            $("#embed-modal input, #embed-modal textarea").val("")
            $("#embed-modal").modal("show");

            $("#set-embed-button").click(function () {
                var embed_body = $("#embed-modal .embed-body").val();

                if (embed_body.trim() === "") {
                     $(".embed-error").show();
                }
                else {
                    $(".embed-error").hide();
                    opts.onSuccess(opts.block,
                        {body: embed_body,
                        caption: $("#embed-modal .embed-caption").val(),
                        source: $("#embed-modal .embed-source").val(),
                        escapedbody: escape(embed_body)
                    })
                    $("#embed-modal").modal("hide");
                }
            });
        }
    }
    global.EditorModules.push(Embed);
})(this);


(function(global) {
    'use strict';
    var HR = HR || function(editor, options) {
        //editor.on("inline:edit:articlelist", editImage);
        editor.on("inline:insert:hr", insert);
        function insert(options) {
            $(options.block).before('<hr>');
        }
    }
    global.EditorModules.push(HR);
})(this);

/* prevents backspace from accidentally triggering a back event */

$(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent = false;
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if (['TEXTAREA', 'INPUT'].indexOf(d.tagName.toUpperCase() !==  -1)) {
            doPrevent = d.readOnly || d.disabled;
        }
        //we're in a content editable field
        else if (d.isContentEditable) {
            doPrevent = false;
        }
        else {
            doPrevent = true;
        }
    }
    if (doPrevent) {
        event.preventDefault();
    }
});
