import DatabaseFactory from "./database-factory"
import expect from "expect"

describe("DatabaseFactory", function(){
    var dataHandlerDetails = {
        actionTypes: [],
        collectionName: "users",
        actionCreators: {},
        handledActionTypes: [],
        reducer: function(){}
    }

    it("Prevents adding two reducers with the same collection name", function(){
        var dbFactory = new DatabaseFactory();

        dbFactory.registerDataHandler(dataHandlerDetails)
        expect(function(){
            dbFactory.registerDataHandler(dataHandlerDetails)
        }).toThrow("Reducer users already exists")
    })

    it("Prevents adding two action creators with the same name", function(){
        var dbFactory = new DatabaseFactory();

        dbFactory.registerActionCreator("addUser", function(){})
        expect(function(){
            dbFactory.registerActionCreator("addUser", function(){})
        }).toThrow("Action creator addUser already exists. Maybe it's created by makeDefaultDataHandler?");
    })

    it("Prevents getting the root reducer if a reducer is handling a non-existent action type", function(){
        var dbFactory = new DatabaseFactory();

        var dataHandler = {...dataHandlerDetails}
        dataHandler.handledActionTypes = ["deleteUser"]
        dbFactory.registerDataHandler(dataHandler)
        expect(function(){
            dbFactory.getRootReducer();
        }).toThrow("Trying to handle non-existent action type deleteUser in reducer users")
    })

    it("Throws an exception when an unknown action type is dispatched", function(){
        var dbFactory = new DatabaseFactory();
        var rootReducer = dbFactory.getRootReducer();

        var action = {type: "DOESNT_EXIST"}
        expect(function(){
            rootReducer({}, action);
        }).toThrow("Dispatched non-existent action type DOESNT_EXIST")
    })
})
