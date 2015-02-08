document.addEventListener("DOMContentLoaded", function( event ) {

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
                src: 'assets/js/highlight/highlight.js', async: true, condition: function() {
                return !!document.querySelector('pre code');
            }, callback: function() {
                hljs.initHighlightingOnLoad();
            }
            }

        ]
    });

    /**
     * Transform ES6 text to ES5.1 using 6to5
     */
    function transformText( input ) {
        var parsed = "";
        try {
            parsed = to5.transform(input).code;
        }
        catch ( err ) {
            console.error(err);
            console.log("didn't set output because it errored");
        }

        return parsed;

    }

    /**
     * Setup any editors on the current slide
     * @param slideElement
     */
    function setupEditors( slideElement ) {
        //get the input editor
        var foundInput = slideElement.querySelectorAll(".editor-input")[0];
        //get the output editor
        var foundOutput = slideElement.querySelectorAll(".editor-output")[0];

        //get the result editor
        var foundResult = slideElement.querySelectorAll(".editor-result-output")[0];

        var input, output, result, native;

        //attach the ace editor
        if ( foundInput ) {
            input = ace.edit(foundInput);
            input.setTheme("ace/theme/monokai");
            input.getSession().setMode("ace/mode/javascript");
            input.getSession().setUseWrapMode(true);

            native = foundInput.className.indexOf("native") > -1;
        }
        //attach the ace editor
        if ( foundOutput ) {
            output = ace.edit(foundOutput);
            output.setTheme("ace/theme/monokai");
            output.getSession().setMode("ace/mode/javascript");
            output.getSession().setUseWrapMode(true);

            //set the initial value
            output.setValue(transformText(input.getValue()), 0);

        }
        //attach the ace editor
        if ( foundResult ) {
            result = ace.edit(foundResult);
            result.setTheme("ace/theme/monokai");
            result.getSession().setUseWrapMode(true);
            result.setReadOnly(true);
        }

        //listen for changes and parse
        if ( input ) {
            input.on("change", function() {

                //set the new value
                var newVal, resultStr;

                //get the ES5 transformed value
                newVal = native
                    ? input.getValue()
                    : transformText(input.getValue());

                if ( newVal ) {
                    //if there is an output window, set the value
                    if ( output ) {
                        output.setValue(newVal, 0);
                    }

                    try {
                        //eval the result
                        resultStr = eval(newVal)();

                        //set the value of the results window
                        result.setValue(resultStr, 0);
                    } catch ( e ) {
                        console.error(e);
                    }

                }
            });

        }

    }

    //setup ace on change
    Reveal.addEventListener('slidechanged', function( event ) {
        setupEditors(event.currentSlide);
    });

    //setup slides for initial load

    setupEditors(document.querySelectorAll(".present")[0]);

});
