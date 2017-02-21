import {Dispatch} from 'redux';

import {SimpleAction} from './actions';

interface DefaultDispatchProps {
  readonly dispatch: Dispatch<SimpleAction>;
}

type PropsExtendedByConnect<OwnProps, MappedProps> = OwnProps & MappedProps & DefaultDispatchProps;

