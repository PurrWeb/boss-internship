// Use bluebird so unhandled exceptions aren't swallowed by default
import Promise from "bluebird"
Promise.onPossiblyUnhandledRejection(function(err){
    console.warn("Unhandled exception in Promise")
    throw err;
})

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
