import React from 'react';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import ModalNote from './modal-note';
import oFetch from 'o-fetch';

export default class DetailsModal extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      showModal: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    $('.boss-modal-window_role_details').attr('style', '');
    $('.boss-modal-window_role_details').find('a').first().css('display', 'none');
  }

  componentDidMount() {
    let _this = this;
    let links = document.querySelectorAll('[data-modal-id="' + this.props.modal_id + '"]');

    links.forEach((item) => {
      item.addEventListener('click', () => {
        this.handleClick();
      });
    });

    $('.boss-modal-window_role_details').find('a').first().css('display', 'none');
  }

  handleClick = () => this.setState({ showModal: true })
  handleClose = () => this.setState({ showModal: false })

  render() {
    if (this.state.showModal) {
      const varianceCentsText = oFetch(this.props, 'variance_cents_text');
      const varianceCents = oFetch(this.props, 'variance_cents');
      var varianceLabelClass = "";
      if (varianceCents < 0) {
        varianceLabelClass = 'boss-stats__label_state_alert';
      } else if ( varianceCents > 0) {
        varianceLabelClass = 'boss-stats__label_state_success';
      }

      return (
          <Modal className="boss-modal-window boss-modal-window_role_details" isOpen={ this.state.showModal } contentLabel={"Details"}>
            <a className="boss-modal-window__close" onClick={ this.handleClose.bind(this) }></a>
            <div className="boss-modal-window__header boss-modal-window__header_details">Details View</div>
            <div className="boss-modal-window__content">
              <div className="boss-stats">
                <div className="boss-stats__meta">
                  <p className={ `boss-stats__label ${varianceLabelClass}` }>
                    <span>{ varianceCentsText }</span>
                  </p>

                  <p className="boss-stats__label boss-stats__label_role_date">
                    <span>{ this.props.created_at}</span>
                  </p>
                  <p className="boss-stats__label boss-stats__label_role_user">{ this.props.checked_by }</p>
                </div>

                <ModalNote { ...this.props } />

                <div className="boss-stats__table">
                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">£50 Notes</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.fifty_pound_note_pounds}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">£20 Notes</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.twenty_pound_note_pounds}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">£10 Notes</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.ten_pound_note_pounds}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">£5 Notes</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.five_pound_note_pounds}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">£2 Coins</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.two_pound_coins_pounds}-</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">£1 Coins</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.one_pound_coins_pounds}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">50p Coins</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.fifty_pence_coins_cents}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">20p Coins</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.twenty_pence_coins_cents}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">10p Coins</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.ten_pence_coins_cents}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">5p Coins</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.five_pence_coins_cents}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">Out to order</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.out_to_order_cents}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">Ash Cash</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.ash_cash_cents}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">Security Plus</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.security_plus_cents}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">Other</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.other_cents}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">Coppers</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.coppers_cents}</p>
                    </div>
                  </div>

                  <div className="boss-stats__table-row">
                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text boss-stats__table-text_role_label">Payouts</p>
                    </div>

                    <div className="boss-stats__table-cell">
                      <p className="boss-stats__table-text">{this.props.costs.payouts_cents}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
      )
    } else {
      return <div></div>
    }
  }
}
