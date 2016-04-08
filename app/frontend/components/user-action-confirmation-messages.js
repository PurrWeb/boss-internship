import React from "react"
import { connect } from "react-redux"

class UserActionConfirmationMessages extends React.Component {
    render(){
        var messageElements = this.props.messages.map((message, i) => {
            return <div key={i}>
                {message}
            </div>
        })
        return <div>
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