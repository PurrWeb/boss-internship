import React from 'react';
import ReactDOM from 'react-dom';
window.React = React;
window.ReactDOM = ReactDOM;

import "./lib/load-underscore-mixins"

import HelloWorld from './react_components/hello-world';
registerComponent('HelloWorld', HelloWorld);

import ProposedRotaAssignment from './react_components/proposed-rota-assignment';
registerComponent('ProposedRotaAssignment', ProposedRotaAssignment);

import StaffFinder from './react_components/staff-finder';
registerComponent('StaffFinder', StaffFinder);

import RotaApp from './react_components/rota-app'
registerComponent('RotaApp', RotaApp)
