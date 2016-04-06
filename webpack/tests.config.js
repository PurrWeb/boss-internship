var context = require.context('../app/frontend', true, /-test\.jsx?$/);
context.keys().forEach(context);

var originalErrorFunction = console.error;
beforeEach(function(){
    console.error = function(){
        originalErrorFunction.apply(this, arguments);    
        throw new Error("Tests fail if console.error is called, mostly to catch PropType issues")
    }
});
afterEach(function(){
    console.error = originalErrorFunction;
})