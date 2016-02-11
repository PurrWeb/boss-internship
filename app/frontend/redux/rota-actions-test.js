import expect from "expect"
import {addRotaShift, updateRotaShift, deleteRotaShift, publishRotas} from "./actions"

describe("Rota Actions", function(){
    beforeEach(function(){
        expect.spyOn(window, "confirm");
    });

    afterEach(function(){
        expect.restoreSpies();
    });    

    it("Shows a confirmation dialog before adding a shift to a published rota", function(){
        var storeState = {
            pageOptions: {
                displayedRota: 99
            },
            rotas: {
                99: {
                    status:"published"
                }
            }
        };

        var dispatch = function(){};
        var getState = function(){return storeState}
        addRotaShift({})(dispatch, getState);
        updateRotaShift({})(dispatch, getState);
        deleteRotaShift({})(dispatch, getState);
        expect(window.confirm.calls.length).toBe(3);
    });

    it("Shows a confirmatin dialog before publishing a week's shifts", function(){
        var dispatch = function(){};
        var getState = function(){};
        publishRotas({})(dispatch, getState);
        expect(window.confirm).toHaveBeenCalled();
    })
});