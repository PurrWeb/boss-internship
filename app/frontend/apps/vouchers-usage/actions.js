import { createAction } from 'redux-actions';
import moment from 'moment';
import notify from '~/components/global-notification';

import {
  INITIAL,
} from './constants';

export const initialLoad = createAction(INITIAL);
