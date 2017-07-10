import React from "react"
import { Provider} from "react-redux"
import { createBossStore } from "~redux/store"
import actionCreators from "~redux/actions"
import oFetch from "o-fetch";
export default class RotaApp extends React.Component {
    constructor(props){
        super(props);
        this.store = createBossStore();
    }
    getViewData(){
        if (this.props.viewData) {
            return this.props.viewData;
        }
        return oFetch(window, "boss.store");
    }
}
