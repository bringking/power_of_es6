document.addEventListener("DOMContentLoaded", function( event ) {


    //This is terrible idea usually, but for our purposes, setup our own logging
    window.console.log = function( val ) {
        setResultsWindow(JSON.stringify(val));
    };

    var mobilecheck = function() {
        var check = false;
        (function( a, b ) {
            if ( /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)) )check = true
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    if ( mobilecheck() ) {
        $('.editor-input-header small').hide();
        $('.editor-output-header small').hide();
    }

    var currentInputEditor, currentOutputEditor, currentResultsWindow, native;

    //attach click handler to expanders
    var expanders = document.querySelectorAll(".expand");
    for ( var i = 0; i < expanders.length; i++ ) {
        var x = expanders[i];
        x.addEventListener("click", function() {

            var editor = this.offsetParent.nextElementSibling;
            var parentHeader = $(this.offsetParent);

            //find the other header
            var otherHeader;
            if ( parentHeader.hasClass("editor-input-header") ) {
                otherHeader = $(parentHeader.siblings(".editor-output-header"));
            } else {
                otherHeader = $(parentHeader.siblings(".editor-input-header"));
            }

            //add classes to editor
            if ( editor.classList.contains("expanded") ) {
                editor.classList.remove("expanded");
                otherHeader.css({visibility: "visible"});
            } else {
                editor.classList.add("expanded");
                otherHeader.css({visibility: "hidden"});
            }

            //trigger resize
            if ( currentInputEditor ) {
                currentInputEditor.resize();
            }
            if ( currentOutputEditor ) {
                currentOutputEditor.resize();
            }

        });
    }

    $(".play").on("click", function() {
        var newVal = getCurrentInputValue();
        if ( newVal ) {
            var results = evalFunctionReturnJson(newVal);
            setResultsWindow(results);
        }

    });

    // Full list of configuration options available at:
    // https://github.com/hakimel/reveal.js#configuration
    Reveal.initialize({
        controls: true,
        progress: true,
        history: true,
        center: true,

        transition: 'slide', // none/fade/slide/convex/concave/zoom

        // Optional reveal.js plugins
        dependencies: [
            {
                src: 'assets/js/markdown/marked.js', condition: function() {
                return !!document.querySelector('[data-markdown]');
            }
            },
            {
                src: 'assets/js/markdown/markdown.js', condition: function() {
                return !!document.querySelector('[data-markdown]');
            }
            },
            {
                src: 'assets/js/highlight/highlight.js', condition: function() {
                return !!document.querySelector('pre code');
            }, callback: function() {
                window.hljs = hljs;
                hljs.configure({
                    languages: ["javascript"]
                });
                hljs.initHighlightingOnLoad();

            }
            }

        ]
    });

    /**
     * Transform ES6 text to ES5.1 using 6to5
     */
    function transformText( input, opts ) {
        var parsed = "";
        try {
            parsed = to5.transform(input, opts).code;
        }
        catch ( err ) {
            console.error(err);
            console.error("didn't set output because it errored");
        }

        return parsed;

    }

    /**
     * get the input value of the current editor
     * @returns {*}
     */
    function getCurrentInputValue() {
        if ( currentInputEditor ) {
            //get the ES5 transformed value
            return native
                ? currentInputEditor.getValue()
                : transformText(currentInputEditor.getValue());
        }

    }

    /**
     * Given a string of code, evaluate as JSON and return
     * @param code
     * @returns {*}
     */
    function evalFunctionReturnJson( code ) {
        try {
            //eval the result
            eval(code);
        } catch ( e ) {
            console.error(e);
        }
    }

    /**
     * Set the output of the result window
     * @param text
     */
    function setResultsWindow( text ) {
        if ( currentResultsWindow ) {
            var row = currentResultsWindow.session.doc.getLength();
                var len = text.length;
                currentResultsWindow.session.doc.insert({row: row, column: 0}, text);
                currentResultsWindow.session.doc.insert({row: row, column: len}, '\n');


            //currentResultsWindow.session.doc.insertNewLine({row: row, column: 0});

        }
    }

    /**
     * Setup any editors on the current slide
     * @param slideElement
     */
    function setupEditors( slideElement ) {

        if ( !slideElement )
            return;

        var isMobile = mobilecheck();

        //get the input editor
        var foundInput = slideElement.querySelectorAll(".editor-input")[0];

        //get the output editor
        var foundOutput = slideElement.querySelectorAll(".editor-output")[0];

        //get the result editor
        var foundResult = slideElement.querySelectorAll(".editor-result-output")[0];

        var input, output, result, inputCode;

        //attach the ace editor
        if ( foundInput ) {
            native = foundInput.className.indexOf("native") > -1;
            //don't use ace on mobile
            if ( isMobile ) {
                inputCode = foundInput.innerHTML.toString();
                if ( inputCode.indexOf('<pre') === -1 ) {

                    var inputPre = $('<pre class="full-height"><code class="hljs javascript">' + inputCode + '</code></pre>');
                    foundInput.innerHTML = "";
                    $(foundInput).append(inputPre);
                    hljs.highlightBlock(inputPre[0]);

                }

            } else {
                input = ace.edit(foundInput);
                currentInputEditor = input;
                input.setTheme("ace/theme/monokai");
                input.getSession().setMode("ace/mode/javascript");
                input.getSession().setUseWrapMode(false);
                input.setShowPrintMargin(false);
                input.setDisplayIndentGuides(false);
                input.renderer.setShowGutter(false);
                input.setHighlightActiveLine(false);
            }
        }
        //attach the ace editor
        if ( foundOutput ) {

            //don't use ace on mobile
            if ( isMobile ) {

            } else {
                output = ace.edit(foundOutput);
                currentOutputEditor = output;
                output.setTheme("ace/theme/monokai");
                output.getSession().setMode("ace/mode/javascript");
                output.getSession().setUseWrapMode(false);
                output.setShowPrintMargin(false);
                output.setDisplayIndentGuides(false);
                output.renderer.setShowGutter(false);
                output.setHighlightActiveLine(false);
                //set the initial value
                output.setValue(transformText(input.getValue()), 0);
            }

        }

        //attach the ace editor
        if ( foundResult && !isMobile ) {
            result = ace.edit(foundResult);
            currentResultsWindow = result;
            result.setTheme("ace/theme/monokai");
            result.getSession().setUseWrapMode(true);
            result.setShowPrintMargin(false);
            result.setReadOnly(true);
            result.setDisplayIndentGuides(false);
            result.renderer.setShowGutter(false);
            result.setHighlightActiveLine(false);
        }

        //listen for changes and parse
        if ( input ) {
            input.on("change", function() {

                //set the new value
                var newVal = getCurrentInputValue();

                if ( newVal ) {

                    //if there is an output window, set the value
                    if ( output ) {
                        output.setValue(newVal, 0);
                    }

                    //evaluate and set the result
                    //evalFunctionReturnJson(newVal);

                }
            });

        }

    }

    //setup ace on change
    Reveal.addEventListener('slidechanged', function( event ) {
        setupEditors(event.currentSlide);
    });

    Reveal.addEventListener('ready', function( event ) {
        setupEditors(event.currentSlide)
    });

});
