import React, { Component } from 'react'
import { Provider} from "react-redux"
import store from '~redux/store.js'
import RotaView from './rota-view.js'
import * as actionCreators from "~redux/actions.js"
import * as backendData from "~redux/process-backend-data"


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

        rotaData = rotaData.map(backendData.processRotaObject);
        rotaShiftData = rotaShiftData.map(backendData.processShiftObject);
        
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
