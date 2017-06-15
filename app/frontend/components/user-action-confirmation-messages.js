import React from "react"
import { connect } from "react-redux"

class UserActionConfirmationMessages extends React.Component {
    render(){
        var {messages} = this.props;
        if (messages.length === 0) {
            return null;
        }
        var messageElements = messages.map((message, i) => {
            return <p className="boss-message__text" key={i}>
                {message}
            </p>
        })
        return <div className="boss-message boss-message_role_ca-note">
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