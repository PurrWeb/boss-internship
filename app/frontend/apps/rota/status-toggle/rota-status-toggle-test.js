import RotaStatusToggle from "./rota-status-toggle"
import { createStore } from "redux"
import {Provider} from "react-redux"
import React from "react";
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"
import expect from "expect"

describe("RotaStatusToggle", function(){
    it("If the current status is 'in_progress' it has the next status 'finished' in the props", function(){
        var state = {
            pageOptions: {
                displayedRota: 3
            },
            rotas: {
                3: {
                    id: 3,
                    date: new Date(),
                    venue: {id: 88},
                    status: "in_progress"
                }
            }
        };
        var store = createStore(function(){
            console.log("in reduceer", arguments)
            return state
        });

        var toggleWrapper;
        TestUtils.renderIntoDocument(
            <Provider store={store}>
                <RotaStatusToggle ref={(t) => toggleWrapper = t}/>
            </Provider>
        );


        var toggle = toggleWrapper.getWrappedInstance();
        expect(toggle.props.nextStatus).toBe("finished")
    })
});