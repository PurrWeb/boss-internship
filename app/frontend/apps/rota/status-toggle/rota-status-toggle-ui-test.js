import RotaStatusToggleUi from "./rota-status-toggle-ui"
import React from "react";
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"
import expect from "expect"
import {simpleRender} from "~lib/test-helpers"

describe("RotaStatusToggleUi", function(){
    it("If the status is in_progress it shows the a dropdown where the status can be changed", function(){
        var {component} = simpleRender(
            <RotaStatusToggleUi
                status={"in_progress"}
                nextStatus={"finished"}
                onStatusSelected={() => null} />
        , {
            storeState: {}
        });

        var node = ReactDOM.findDOMNode(component);
        expect(node.getElementsByClassName("Select").length).toBe(1);
    })

    it("Does not show a dropdown if the status is 'published'", function(){
        var {component} = simpleRender(
            <RotaStatusToggleUi
                status={"published"}
                onStatusSelected={() => null} />
        , {storeState: {}});

        var node = ReactDOM.findDOMNode(component);
        expect(node.getElementsByClassName("Select").length).toBe(0);
    })

    it("If an update is in progress it shows a spinner instead of the dropdown", function(){
        var {component} = simpleRender(
            <RotaStatusToggleUi
                status={"finished"}
                nextStatus={"in_progress"}
                statusUpdateInProgress={true}
                onStatusSelected={() => null} />
        , {
            storeState: {}
        });

        var node = ReactDOM.findDOMNode(component);
        expect(node.getElementsByClassName("Select").length).toBe(0);
        expect(node.getElementsByClassName("spinner").length).toBe(1);
    })
});
