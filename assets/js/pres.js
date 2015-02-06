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
        var input, output;

        //attach the ace editor
        if ( foundInput ) {
            input = ace.edit(foundInput);
            input.setTheme("ace/theme/monokai");
            input.getSession().setMode("ace/mode/javascript");

        }
        //attach the ace editor
        if ( foundOutput ) {
            output = ace.edit(foundOutput);
            output.setTheme("ace/theme/monokai");
            output.getSession().setMode("ace/mode/javascript");
            //set the initial value
            output.setValue(transformText(input.getValue()), 0);
        }

        //listen for changes and parse
        if ( input && output ) {
            input.on("change", function() {
                //set the new value
                output.setValue(transformText(input.getValue()), 0);
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
