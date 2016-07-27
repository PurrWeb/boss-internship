import React, { Component } from "react"
import AppComponent from "../app-component"

export default class RollbarErrorTestApp extends AppComponent {
  componentWillMount(){
    throw new Error('This is a test');
  }

  render(){
    <div>Arlight Luv!</div>
  }
}
