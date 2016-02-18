import React, { Component } from "react"
import TestUtils from "react-addons-test-utils"
import ReactDOM from "react-dom"

export class ContextProvider extends Component {
    render(){
        var dynamicChildContextTypes = {};
        for (var key in this.props.context) {
            dynamicChildContextTypes[key] = React.PropTypes.any;
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
*/
export function simpleRender(createdElement){
    var component = TestUtils.renderIntoDocument(createdElement);
    var node = ReactDOM.findDOMNode(component);

    return {component, node};
}