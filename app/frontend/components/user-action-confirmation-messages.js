import React from "react"
import { connect } from "react-redux"

class UserActionConfirmationMessages extends React.Component {
    render(){
        var {messages} = this.props;
        if (messages.length === 0) {
            return null;
        }
        var messageElements = messages.map((message, i) => {
            return <div key={i}>
                {message}
            </div>
        })
        return <div className="callout">
            {messageElements}
        </div>
    }
}

function mapStateToProps(state){
    return {
        messages: state.userActionConfirmationMessages
    }
}

export default connect(mapStateToProps)(UserActionConfirmationMessages)