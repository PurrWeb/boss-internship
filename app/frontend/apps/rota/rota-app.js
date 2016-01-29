import React, { Component } from 'react'
import { Provider} from "react-redux"
import store from '~redux/store.js'
import RotaView from './rota-view.js'
import * as actionCreators from "~redux/actions.js"

function processBackendRotaObject(rota){
    var newRota = {...rota};

    var date = rota.date;
    var [year, month, day] = date.split("-").map(parseFloat);
    newRota.date = new Date(year, month - 1, day, 12, 0);

    // Before we've created the first shift for a rota the rota
    // isn't saved on the backend, so it doesn't have an ID
    if (rota.id === null) {
        newRota.id = "UNPERSISTED_ROTA";
    }

    return newRota
}

function processBackendShiftObject(shift){
    return Object.assign({}, shift, {
        starts_at: new Date(shift.starts_at),
        ends_at: new Date(shift.ends_at)
    });
}

function indexById(data){
  return _.indexBy(data, "id")
}

export default class RotaApp extends Component {
    componentWillMount(){
        let viewData = window.boss.rota;

        let rotaData = viewData.rotas;
        let staffTypeData = viewData.staff_types;
        let rotaShiftData = viewData.rota_shifts;
        let staffMemberData = viewData.staff_members;
        let venueData = viewData.venues;

        rotaData = rotaData.map(processBackendRotaObject);
        rotaShiftData = rotaShiftData.map(processBackendShiftObject);
        
        var initialPageData = {
            pageOptions: {
                displayedRota: _.first(rotaData).id
            },
            staffTypes: indexById(staffTypeData),
            staffMembers: indexById(staffMemberData),
            rotaShifts: indexById(rotaShiftData),
            rotas: indexById(rotaData),
            venues: indexById(venueData)
        }

        store.dispatch(actionCreators.loadInitialRotaAppState(initialPageData));
    }
    render() {
        return <Provider store={store}>
            <RotaView />
        </Provider>
    }
}
