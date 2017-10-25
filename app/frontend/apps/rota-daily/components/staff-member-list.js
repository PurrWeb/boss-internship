import React from 'react';
import oFetch from 'o-fetch';
import StaffMemberItem from './staff-member-item';

function HeaderRow({children}) {
  return (
    <div className="boss-staff-summary__cell boss-staff-summary__cell_role_header">
      {children}
    </div>
  )
}

function Header() {
  return (
    <div className="boss-staff-summary__row boss-staff-summary__row_role_header">
      <HeaderRow>Name</HeaderRow>
      <HeaderRow>Shifts</HeaderRow>
      <HeaderRow>Holidays</HeaderRow>
      <HeaderRow>Preferences</HeaderRow>
      <HeaderRow>Action</HeaderRow>
    </div>
  )
}

const PAGE_SIZE = 10;

class StaffMemberList extends React.PureComponent {

  constructor(props) {
    super(props);
  
    document.body.addEventListener('click', (e) => {
      const rotaDailyConfirmation = document.querySelector('.rota-daily-confirmation');
      if ((this.node && this.node.contains(e.target)) || (rotaDailyConfirmation && rotaDailyConfirmation.contains(e.target))) {
        return;
      }
      
      this.handleCloseTooltip();
    });

    this.state = {
      currentStaffId: null,
      staffMembers: props.staffMembers.slice(0, PAGE_SIZE)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(state => {
      if (this.props.staffMembers.size === nextProps.staffMembers.size) {
        return {
          staffMembers: nextProps.staffMembers.slice(0, state.staffMembers.size)
        }
      }
      return {
        staffMembers: nextProps.staffMembers.slice(0, PAGE_SIZE)
      }
    })
  }

  handleCloseTooltip = () => {
    document.body.classList.remove("boss-body_state_inactive");
    this.setState({currentStaffId: null});
  }

  handleAddShiftClick = (staffId) => {
    document.body.classList.add("boss-body_state_inactive");
    this.setState({currentStaffId: staffId});
  }

  renderStaffMembers = () => {
    return this.state.staffMembers.map((staffMember, key) => {
      return (
        <StaffMemberItem
          staffMember={staffMember}
          staffTypes={this.props.staffTypes}
          rotaDate={this.props.rotaDate}
          onAddShiftClick={this.handleAddShiftClick}
          currentStaffId={this.state.currentStaffId}
          key={key}
          setRef={this.setRef}
          handleAfterAdd={this.handleCloseTooltip}
          isMultipleShift={this.props.isMultipleShift}
          rotaStatus={this.props.rotaStatus}
        />
      )
    })
  }
  setRef = (tooltip) => {
    this.node = tooltip;
  }

  getLoadMoreSizes = () => {
    const currentSize = this.state.staffMembers.size;
    const fullSize = this.props.staffMembers.size;
    let loadSize = PAGE_SIZE;
    if ((fullSize - currentSize) < PAGE_SIZE) {
      loadSize = fullSize - currentSize;
    }

    return {currentSize, loadSize};
  }

  loadMore = () => {
    this.setState(state => {
      const {currentSize, loadSize} = this.getLoadMoreSizes();
      const staffMembers = this.props.staffMembers.slice(currentSize, currentSize + loadSize);
      
      return {
        staffMembers: state.staffMembers.concat(staffMembers)
      }
    });
  }

  renderLoadMoreButton = () => {
    return (
      <div className="boss-staff-summary__actions">
        <button
          onClick={this.loadMore}
          className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile"
        >Load More</button>
      </div>
    )
  }

  render() {
    const showLoadMore = this.state.staffMembers.size !== this.props.staffMembers.size;
    return (
      <div className="boss-rotas__staff">
        <div className="boss-staff-summary boss-staff-summary_page_rotas-daily">
          <Header />
          { this.renderStaffMembers() }
          { showLoadMore && this.renderLoadMoreButton() }
        </div>
      </div>
    )
  }
}

export default StaffMemberList;
