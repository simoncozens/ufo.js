ufo.js
======

ufo.js is a JavaScript parser (and eventually writer) for fonts in the UFO format. It is patterned on [opentype.js](https://www.github.com/nodebox/opentype.js).

It gives you access to the <strong>letterforms</strong> of text from the browser or node.js.

It is still under development and most parts don't work yet.

It makes heavy use of promises, so please ensure you are familiar with Javascript promise syntax.

Here's an example. We load a font, then display it on a canvas with id "canvas":

    /* NOT WORKING YET */
    ufo.load('fonts/Roboto-Black.ufo', function(err, font) {
        if (err) {
             alert('Font could not be loaded: ' + err);
        } else {
            var ctx = document.getElementById('canvas').getContext('2d');
            font.getPath('Hello, World!', 0, 150, 72).then( path => path.draw(ctx) )
        }
    });


API
===
### Loading a font
Use `ufo.load(url, callback)` to load a font from a URL. Since this method goes out the network, it is asynchronous.
The callback gets `(err, font)` where `font` is a `Font` object. Check if the `err` is null before using the font.

    opentype.load('fonts/Roboto-Black.ufo', function(err, font) {
        if (err) {
            alert('Could not load font: ' + err);
        } else {
            // Use your font here.
        }
    });

### The Font object

A Font represents a loaded UFO font file. It contains a set of glyphs and methods to draw text on a drawing context, or to get a path representing the text.

* `metainfo`: The metadata table of the font
* `fontinfo`: The font information table of the font
* `groups`: A list of kerning groups, if supplied
* `kerning`: The kern table, if supplied
* `glyphtable`: A list of available glyphs

#### `Font.stringToGlyphs(string)`
Convert the string to a list of glyph objects.

The string should be in "Glyphs format": portions of the string starting with a forward slash up to the next space or forward slash are considered a glyph name, but any other character stands for itself.

For instance, `A/zero /five/b b` represents the four characters A, 0, 5, b and b.

#### `Font.getKerningValue(leftGlyph, rightGlyph)`
Retrieve the value of the [kerning pair](https://en.wikipedia.org/wiki/Kerning) between the left glyph (or its index) and the right glyph (or its index). If no kerning pair is found, returns `null`. (*Note change from opentype.js*) The kerning value gets added to the advance width when calculating the spacing between glyphs.

#### `Font.getAdvanceWidth(text, fontSize, options)`
Returns the advance width of a text.

This is something different than Path.getBoundingBox() as for example a
suffixed whitespace increases the advancewidth but not the bounding box
or an overhanging letter like a calligraphic 'f' might have a quite larger
bounding box than its advance width.

This corresponds to canvas2dContext.measureText(text).width
* `fontSize`: Size of the text in pixels (default: 72).
* `options`: See Font.getPath

#### The Glyph object
A Glyph is an individual mark that often corresponds to a character. Some glyphs, such as ligatures, are a combination of many characters. Glyphs are the basic building blocks of a font.

* `font`: A reference to the `Font` object.
* `name`: The glyph name (e.g. "Aring", "five")
* `advanceWidth`: The width to advance the pen when drawing this glyph.
