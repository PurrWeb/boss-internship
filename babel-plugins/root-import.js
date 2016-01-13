// Based on http://stackoverflow.com/a/31069137/1290545
// There's also a "babel-root-import" plugin on npm, but when I try to use it
// Babel says it didn't export a Plugin instance.
// I think it's to do with passing options into the plugin, since I'm having the
// same issue with this plugin.
// So I'm just hard-coding the path in here rather than in the confif.
const JS_ROOT = "/app/frontend";

module.exports = function (babel) {
    // get the working directory
    var cwd = process.cwd();

    return new babel.Transformer("babel-root-import", {
        ImportDeclaration: function(node, parent) {
            // probably always true, but let's be safe
            if (!babel.types.isLiteral(node.source)) {
                return node;
            }

            var ref = node.source.value;

            // ensure a value, make sure it's not home relative e.g. ~/foo
            if (!ref || ref[0] !== '~' || ref[1] === '/') {
                return node;
            }

            node.source.value = cwd + JS_ROOT + '/' + node.source.value.slice(1);

            return node;
        }
    });
};