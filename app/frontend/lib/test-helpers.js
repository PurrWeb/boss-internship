import PropTypes from 'prop-types';
import React, { Component } from "react"
import TestUtils from "react-dom/test-utils"
import ReactDOM from "react-dom"
import {createStore} from "redux"

export class ContextProvider extends Component {
    render(){
        var dynamicChildContextTypes = {};
        for (var key in this.props.context) {
            dynamicChildContextTypes[key] = PropTypes.any;
        }

        class DynamicContextProvider extends Component{
            getChildContext() {
                return this.props.context;
            }
            render(){
                return this.props.children[0];
            }
        }
        DynamicContextProvider.childContextTypes = dynamicChildContextTypes;
        return <DynamicContextProvider context={this.props.context}>
            {this.props.children};
        </DynamicContextProvider>
    }
}

export class NoOpComponent extends Component{
    render(){
        return null;
    }
}

/**
Example usage:
var  node = simpleRender(<HelloWorldMessage />).node;
expect(node.textContent).toContain("Hello World");

You can also pass in a store state and a context through the options object.

Returns an object with:
- component => The React component
- node => The DOM node
- findChild(componentType) => function to find a child component
*/
export function simpleRender(createdElement, options){
    var context, storeState;
    if (options !== undefined){
        var {context, storeState} = options;
    }


    if (context === undefined){
        context = {};
    }
    if (storeState !== undefined){
        context.store = createStore(function(){
            return storeState;
        })
    }

    var contextProviderComponent = TestUtils.renderIntoDocument(
        <ContextProvider context={context}>
            {createdElement}
        </ContextProvider>
    );

    var component = TestUtils.findRenderedComponentWithType(
        contextProviderComponent,
        contextProviderComponent.props.children.type
    );
    function getNode() {
        return ReactDOM.findDOMNode(component);
    }

    var findChild = function(childComponentType){
        return TestUtils.findRenderedComponentWithType(
            component,
            childComponentType
        );
    }

    var $ = function(selector){
        return getNode().querySelector(selector);
    }

    var $$ = function(selector){
        return getNode().querySelectorAll(selector);
    }

    return {component, getNode, findChild, $, $$};
}

export function accelerateTimeouts(fn){
    var originalSetTimeout = setTimeout;
    window.setTimeout =  function(callback, time){
        return originalSetTimeout(callback, time / 100);
    }
    fn();
    window.setTimeout = originalSetTimeout;
}
