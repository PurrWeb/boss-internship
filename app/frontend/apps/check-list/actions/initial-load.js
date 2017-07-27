import {
  INITIAL,
} from '../constants/action-names';

export default (initialData) => {
  return {
    type: INITIAL,
    payload: initialData
  };
}
