import Immutable from 'immutable';

export const Venue = Immutable.Record({
  id: undefined,
  name: undefined,
  address: undefined,
});

export const knownRecordTypes = new Immutable.Map({
  Venue,
});

export const fromJS = any => {
  return Immutable.fromJS(any);
};

// By default, ensure deep conversion with fromJS() and then invoke Record constructor:
knownRecordTypes.forEach((Type, name) => (fromJS[name] = any => new Type(fromJS(any))));