import {createSimpleAction, createActionWithPayload} from './actions';
import {SimpleAction} from '../interfaces/actions';

describe('createSimpleAction', () => {
  test('it should be defined', () => {
    expect(createSimpleAction).toBeDefined();
  });

  test('returns proper action', () => {
    const actionType = 'TEST_TYPE';
    const action: SimpleAction = createSimpleAction(actionType);

    expect(action).toEqual({
      type: actionType
    });
  });
});

describe('createSimpleAction', () => {
  test('should be defined', () => {
    expect(createActionWithPayload).toBeDefined();
  });

  test('returns proper action', () => {
    const actionType = 'TEST_TYPE';
    const payload = {
      someData: 100
    };
    const action: SimpleAction = createActionWithPayload(actionType, payload);

    expect(action).toEqual({
      type: actionType,
      payload
    });
  });
});



