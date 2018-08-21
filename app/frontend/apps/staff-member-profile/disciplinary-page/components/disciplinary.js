import React from 'react';
import ProfileWrapper from '../../profile-wrapper';
import oFetch from 'o-fetch';
import Immutable from 'immutable';
import * as constants from '../constants';
import { openConfirmationModal, openContentModal, openWarningModal } from '~/components/modals';
import PropTypes from 'prop-types';
import DisciplinaryFilter from './disciplinary-filter';
import DisciplinaryList from './disciplinary-list';
import DisciplinaryLevelList from './disciplinary-level-list';
import DisciplinaryItem from './disciplinary-item';
import DisciplinaryDetails from './disciplinary-details';
import DisciplinaryAdd from './disciplinary-add';
import DisciplinaryAddConfirm from './disciplinary-add-confirm';

class Disciplinary extends React.Component {
  state = {
    isLoaded: false,
  };

  componentDidMount = () => {
    const filterQueryString = new URLSearchParams(window.location.search);
    const queryString = decodeURI(filterQueryString.toString()) ? `?${decodeURI(filterQueryString.toString())}` : '';

    this.props.loadDisciplinaries({ queryString }).then(resp => {
      this.setState({
        isLoaded: true,
      });
      const startDate = oFetch(resp.data, 'filter.start_date');
      const endDate = oFetch(resp.data, 'filter.end_date');
      const disabled = oFetch(resp.data, 'filter.show_disabled');
      const expired = oFetch(resp.data, 'filter.show_expired');
      const show = [expired && constants.EXPIRED, disabled && constants.DISABLED].filter(value => value);
      this.changeURL({ startDate, endDate, show });
    });
  };

  changeURL = ({ startDate, endDate, show }) => {
    const filterQueryString = new URLSearchParams(window.location.search);

    filterQueryString.delete('show[]');
    filterQueryString.delete('start_date');
    filterQueryString.delete('end_date');
    if (startDate && endDate) {
      filterQueryString.set('start_date', startDate);
      filterQueryString.set('end_date', endDate);
    }
    show.forEach(value => filterQueryString.append('show[]', value));
    const queryString = decodeURI(filterQueryString.toString()) ? `?${decodeURI(filterQueryString.toString())}` : '';
    const staffMemberId = oFetch(this.props, 'staffMemberId');
    window.history.pushState('state', 'title', `/staff_members/${staffMemberId}/disciplinaries${queryString}`);
    return queryString;
  };

  handleFilterUpdate = ({ startDate, endDate, show }) => {
    const queryString = this.changeURL({ startDate, endDate, show });
    this.props.loadDisciplinaries({ queryString });
  };

  handleViewDetails = disciplinary => {
    openContentModal({
      config: {
        title: (
          <span>
            <span className="boss-modal-window__marked">{oFetch(disciplinary, 'title')}</span> Details
          </span>
        ),
        modalClassName: 'boss-modal-window_role_disciplinary-details',
      },
      props: {
        nature: oFetch(disciplinary, 'nature'),
        conduct: oFetch(disciplinary, 'conduct'),
        consequence: oFetch(disciplinary, 'consequence'),
      },
    })(DisciplinaryDetails);
  };

  handleAddDisciplinarySubmit = (hideModal, values, hideConfirmationModal) => {
    hideConfirmationModal();
    const addDisciplinary = oFetch(this.props, 'addDisciplinary');
    return addDisciplinary(values).then(resp => {
      hideModal();
      return resp;
    });
  };

  handleDisableDisciplinarySubmit = (hideModal, values) => {
    const disableDisciplinary = oFetch(this.props, 'disableDisciplinary');
    return disableDisciplinary(values).then(resp => {
      hideModal();
      return resp;
    });
  };

  handleOpenConfirmAddDisciplinaryModal = (hideModal, values) => {
    return new Promise((resolve, reject) => {
      openConfirmationModal({
        submit: hideConfirmationModal =>
          this.handleAddDisciplinarySubmit(hideModal, values, hideConfirmationModal)
            .then(resp => resolve(resp))
            .catch(err => reject(err)),
        config: { title: 'WARNING !!!' },
        props: { hideModal, values },
        closeCallback: reject,
      })(DisciplinaryAddConfirm);
    });
  };

  handleAddDisciplinary = () => {
    openContentModal({
      submit: this.handleOpenConfirmAddDisciplinaryModal,
      config: {
        title: 'Add Disciplinary',
        modalClassName: 'boss-modal-window_role_add',
      },
    })(DisciplinaryAdd);
  };

  handleOpenDisableDisciplinary = ({ disciplinaryId }) => {
    openWarningModal({
      submit: hideModal => this.handleDisableDisciplinarySubmit(hideModal, { disciplinaryId }),
      config: {
        title: 'WARNING !!!',
        text: 'Are You Sure?',
        buttonText: 'Disable',
      },
    });
  };

  render() {
    const { isLoaded } = this.state;
    const startDate = oFetch(this.props, 'startDate');
    const endDate = oFetch(this.props, 'endDate');
    const show = oFetch(this.props, 'show');
    const canCreateDisciplinary = oFetch(this.props, 'canCreateDisciplinary');
    const disablePermissions = oFetch(this.props, 'disablePermissions');

    if (!isLoaded) {
      return (
        <ProfileWrapper currentPage="disciplinary">
          <section className="boss-board boss-board_role_profile-disciplinary">
            <header className="boss-board__header">
              <h2 className="boss-board__title">Disciplinary</h2>
            </header>
            <div className="boss-board__main">
              <div className="boss-board__manager" />
            </div>
          </section>
        </ProfileWrapper>
      );
    }
    const disciplinariesGroupedByLevel = oFetch(this.props, 'disciplinariesGroupedByLevel');
    return (
      <ProfileWrapper currentPage="disciplinary">
        <section className="boss-board boss-board_role_profile-disciplinary">
          <header className="boss-board__header">
            <h2 className="boss-board__title">Disciplinary</h2>
            {canCreateDisciplinary && (
              <div className="boss-board__button-group" onClick={this.handleAddDisciplinary}>
                <p className="boss-button boss-button_role_add">Add Disciplinary</p>
              </div>
            )}
          </header>
          <div className="boss-board__main">
            <div className="boss-board__manager">
              <DisciplinaryFilter
                startDate={startDate}
                endDate={endDate}
                show={show}
                onFilterUpdate={this.handleFilterUpdate}
                canCreateDisciplinary={canCreateDisciplinary}
              />
              <DisciplinaryLevelList
                disciplinariesGroupedByLevel={disciplinariesGroupedByLevel}
                itemRenderer={(disciplinaries, level) => {
                  return (
                    <DisciplinaryList
                      title={level}
                      disciplinaries={disciplinaries}
                      itemRenderer={disciplinary => {
                        const permission = disablePermissions.find((value, key) => disciplinary.id.toString() === key);
                        const isDisablable = permission ? permission.get('isDisablable') : false;
                        return (
                          <DisciplinaryItem
                            {...disciplinary}
                            onViewDetails={() => this.handleViewDetails(disciplinary)}
                            onOpenDisableDisciplinary={() =>
                              this.handleOpenDisableDisciplinary({ disciplinaryId: disciplinary.id })
                            }
                            isDisablable={isDisablable}
                          />
                        );
                      }}
                    />
                  );
                }}
              />
            </div>
          </div>
        </section>
      </ProfileWrapper>
    );
  }
}

Disciplinary.propTypes = {
  disciplinariesGroupedByLevel: PropTypes.instanceOf(Immutable.Map).isRequired,
  staffMemberId: PropTypes.number.isRequired,
  addDisciplinary: PropTypes.func.isRequired,
  disableDisciplinary: PropTypes.func.isRequired,
  loadDisciplinaries: PropTypes.func.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  show: PropTypes.instanceOf(Immutable.List).isRequired,
  canCreateDisciplinary: PropTypes.bool.isRequired,
  disablePermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default Disciplinary;
