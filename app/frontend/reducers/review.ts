import {ActionWithPayload} from '../interfaces/actions';
import {SHOW_REVIEWED, HIDE_REVIEWED, TOGGLE_REVIEWED} from '../constants/action-names';

export type Structure = boolean;

const review = (state: Structure = false, action: ActionWithPayload<Structure>): Structure => {
  switch (action.type) {
    case SHOW_REVIEWED: {
        return action.payload;
    }
    case HIDE_REVIEWED: {
        return action.payload;
    }
    case TOGGLE_REVIEWED: {
        return !state;
    }
    default: {
        return state;
    }
  }
};

export default review;
