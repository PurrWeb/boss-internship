import React from "react"
import { Provider } from "react-redux"
import { configureStore } from '../configure-store';

import MessageBoardContainer from "./containers/message-board-container";
import messageBoard from "./reducers/message-board"
import { reducer as form } from 'redux-form/immutable';

export default class MessageBoardApp extends React.Component {
  render() {
    return (
      <Provider store={ configureStore({ messageBoard, form }) }>
        <MessageBoardContainer />
      </Provider>
    )
  }
}
