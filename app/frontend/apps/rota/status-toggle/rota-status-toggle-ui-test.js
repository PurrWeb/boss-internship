import RotaStatusToggleUi from "./rota-status-toggle-ui"
import React from "react";
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"
import expect from "expect"

describe("RotaStatusToggleUi", function(){
    it("If the status is in_progress it shows the status and a button to change it to finished", function(){
        var toggle = TestUtils.renderIntoDocument(
            <RotaStatusToggleUi
                status={"in_progress"}
                nextStatus={"finished"}
                onClick={() => null} />
        );

        var node = ReactDOM.findDOMNode(toggle);
        expect(node.getElementsByClassName("rota-status-toggle__status")[0].innerHTML).toBe("In Progress")
        expect(node.getElementsByClassName("next-rota-status-button")[0].innerHTML).toBe("Mark as Finished");
    })

    it("Does not show a next status button if there is no `nextStatus`", function(){
        var toggle = TestUtils.renderIntoDocument(
            <RotaStatusToggleUi
                status={"in_progress"}
                onClick={() => null} />
        );

        var node = ReactDOM.findDOMNode(toggle);
        expect(node.getElementsByClassName("next-rota-status-button").length).toBe(0);
    })
});