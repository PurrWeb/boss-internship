import React, { Component } from "react"

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