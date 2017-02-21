import {combineReducers} from 'redux';

import formsData, {Structure as FormsDataStructure} from './forms';
import {ReducersOfType} from '../interfaces/index';
import app, {Structure as AppStructure} from './app';

export interface Structure {
  readonly formsData: FormsDataStructure;
  readonly app: AppStructure;
}

const reducers: ReducersOfType<Structure> = {
  formsData,
  app
};

const allReducers = combineReducers<Structure>(reducers);

export default allReducers;
