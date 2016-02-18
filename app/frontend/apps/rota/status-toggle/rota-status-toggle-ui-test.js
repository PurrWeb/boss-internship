import RotaStatusToggleUi from "./rota-status-toggle-ui"
import React from "react";
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"
import expect from "expect"

describe("RotaStatusToggleUi", function(){
    it("If the status is in_progress it shows the a dropdown where the status can be changed", function(){
        var toggle = TestUtils.renderIntoDocument(
            <RotaStatusToggleUi
                status={"in_progress"}
                nextStatus={"finished"}
                onStatusSelected={() => null} />
        );

        var node = ReactDOM.findDOMNode(toggle);
        expect(node.getElementsByClassName("Select").length).toBe(1);
    })

    it("Does not show a dropdown if the status is 'published'", function(){
        var toggle = TestUtils.renderIntoDocument(
            <RotaStatusToggleUi
                status={"published"}
                onStatusSelected={() => null} />
        );

        var node = ReactDOM.findDOMNode(toggle);
        expect(node.getElementsByClassName("Select").length).toBe(0);
    })

    it("If an update is in progress it shows a spinner instead of the dropdown", function(){
        var toggle = TestUtils.renderIntoDocument(
            <RotaStatusToggleUi
                status={"finished"}
                nextStatus={"in_progress"}
                statusUpdateInProgress={true}
                onStatusSelected={() => null} />
        );

        var node = ReactDOM.findDOMNode(toggle);
        expect(node.getElementsByClassName("Select").length).toBe(0);
        expect(node.getElementsByClassName("spinner").length).toBe(1);
    })
});