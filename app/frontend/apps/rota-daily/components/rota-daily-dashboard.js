import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BossSelect from '~/components/boss-select';
import DashboardWrapper from '~/components/dashboard-wrapper';
import {
  addNewShift,
  cancelAddNewShift,
  setRotaStatus,
} from '../actions';

const mapStateToProps = (state) => {
  return {
    currentVenue: state.getIn(['page', 'currentVenue']),
    rotaStatus: state.getIn(['page', 'rota', 'status']),
    isAddingNewShift: state.getIn(['page', 'isAddingNewShift']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      addNewShift,
      cancelAddNewShift,
      setRotaStatus,
    }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class RotaDailyDashboard extends React.Component {
  setRotaStatus = (status) => {
    this.props.actions.setRotaStatus(status.value);
  }
  
  render() {
    const {
      currentVenue,
      rotaStatus,
      actions: {
        addNewShift,
        cancelAddNewShift,
      },
    } = this.props;
    const rotaStatuses = [{value: 'in_progress', label: 'In Progress'}, {value: 'finished', label: 'Finished'}];
    const selectedStatus = rotaStatuses.find(status => status.value === rotaStatus);
    return (
      <DashboardWrapper>
        <div className="boss-page-dashboard boss-page-dashboard_updated boss-page-dashboard_page_rotas-daily">
          <h1 className="boss-page-dashboard__title">
            <span className="boss-page-dashboard__title-text">Rota for{'\u00A0'}</span>
            <span className="boss-page-dashboard__title-text boss-page-dashboard__title-text_marked">
              {currentVenue.get('name')}
            </span>
          </h1>
          <div className="boss-page-dashboard__group">
            <div className="boss-page-dashboard__controls-group">
              <div className="boss-form">
                <div className="boss-form__field boss-form__field_role_control">
                  <p className="boss-form__label boss-form__label_type_light boss-form__label_desktop">
                    <span className="boss-form__label-text">Rota Status</span>
                  </p>
                  { rotaStatus === 'published'
                    ? <span className="boss-form__label boss-form__label_type_light boss-form__label_desktop">Published</span>
                    : <BossSelect
                        className="boss-form__select_size_small"
                        options={rotaStatuses}
                        selected={selectedStatus}
                        onChange={this.setRotaStatus}
                        mappedProps={{
                          clearable: false,
                          searchable: false,
                        }}
                      />
                  }
                </div>
              </div>
            </div>
            <div className="boss-page-dashboard__buttons-group">
              { this.props.isAddingNewShift 
                ? <button
                    onClick={cancelAddNewShift}
                    className="boss-button boss-button_role_cancel boss-page-dashboard__button"
                  >Cancel</button>
                : <button
                    onClick={addNewShift}
                    className="boss-button boss-button_role_add boss-page-dashboard__button"
                  >Add New Shift Hours</button>
              }
            </div>
          </div>
        </div>
      </DashboardWrapper>
    )
  }
}

export default RotaDailyDashboard;
