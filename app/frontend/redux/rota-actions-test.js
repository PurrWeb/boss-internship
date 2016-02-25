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
            rotas: {
                99: {
                    status:"published",
                    date: new Date(2016,1,15),
                    venue: {id: 10}
                }
            }
        };
        var data = {
            shift: {
                starts_at: new Date(2016,1,15,16,0,0)
            },
            venueId: 10
        }

        var dispatch = function(){};
        var getState = function(){return storeState}
        addRotaShift(data)(dispatch, getState);
        updateRotaShift(data)(dispatch, getState);
        deleteRotaShift(data)(dispatch, getState);
        expect(window.confirm.calls.length).toBe(3);
    });

    it("Shows a confirmatin dialog before publishing a week's shifts", function(){
        var dispatch = function(){};
        var getState = function(){};
        publishRotas({})(dispatch, getState);
        expect(window.confirm).toHaveBeenCalled();
    })
});