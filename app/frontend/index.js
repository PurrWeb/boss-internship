import React from 'react';
import ReactDOM from 'react-dom';
window.React = React;
window.ReactDOM = ReactDOM;

import "./lib/load-underscore-mixins"

import StaffFinder from './react_components/staff-finder';
registerComponent('StaffFinder', StaffFinder);

import RotaApp from './react_components/rota-app'
registerComponent('RotaApp', RotaApp)
