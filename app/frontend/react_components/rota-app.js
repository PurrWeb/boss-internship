import React, { Component } from 'react'
import { Provider} from "react-redux"
import store from '../redux/store.js'
import RotaView from './rota-view.js'
import * as actionCreators from "../redux/actions.js"

export default class RotaApp extends Component {
  render() {
    return <Provider store={store}>
      <RotaView />
    </Provider>
  }
}