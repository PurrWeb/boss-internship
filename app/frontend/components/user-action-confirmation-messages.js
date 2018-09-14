import React from "react"
import { connect } from "react-redux"

class UserActionConfirmationMessages extends React.Component {
    render(){
        var {messages} = this.props;
        if (messages.length === 0) {
            return null;
        }
        var messageElements = messages.map((message, i) => {
            return <p className="boss-message__text boss-message__text_marked" key={i}>
                {message}
            </p>
        })
        return (
            <div className="boss-staff-type-menu__row">
                <div className="boss-message boss-message_role_ca-note">
                    {messageElements}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        messages: state.userActionConfirmationMessages
    }
}

export default connect(mapStateToProps)(UserActionConfirmationMessages)