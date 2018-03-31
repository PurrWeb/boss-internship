import React from 'react';
import oFetch from 'o-fetch';

export class PaymentFilter extends React.Component {
  render() {
    const startDate = this.props.startDate;
    const endDate = this.props.endDate;

    return <div className="boss-board__manager-filter">
			<form action="#" className="boss-form">
				<div className="boss-form__row boss-form__row_align_center boss-form__row_hidden-l">
					<div className="boss-form__field boss-form__field_role_control boss-form__field_layout_max">
						<p className="boss-form__label boss-form__label_type_light"><span className="boss-form__label-text">Filter</span></p>
						<div className="date-range-picker date-range-picker_type_interval date-range-picker_type_icon">
							<div className="DateRangePicker">
								<div>
									<div className="DateRangePickerInput">
										<div className="DateInput">
											<input aria-label="Start Date" className="DateInput__input needsclick" id="startDate" name="startDate" value="2017-10-16" placeholder="Start Date" autoComplete="off" aria-describedby="DateInput__screen-reader-message-startDate" type="text" />
											<p id="DateInput__screen-reader-message-startDate" className="screen-reader-only">Press the down arrow key to interact with the calendar and select a date. Press the question mark key to get the keyboard shortcuts for changing dates.</p>
											<div className="DateInput__display-text DateInput__display-text--has-input">11/14/2016</div>
										</div>
										<div className="DateRangePickerInput__arrow" aria-hidden="true" role="presentation">
											<svg viewBox="0 0 1000 1000">
												<path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"></path>
											</svg>
										</div>
										<div className="DateInput">
											<input aria-label="End Date" className="DateInput__input needsclick" id="endDate" name="endDate" value="2017-10-26" placeholder="End Date" autoComplete="off" aria-describedby="DateInput__screen-reader-message-endDate" type="text" />
											<p id="DateInput__screen-reader-message-endDate" className="screen-reader-only">Press the down arrow key to interact with the calendar and select a date. Press the question mark key to get the keyboard shortcuts for changing dates.</p>
											<div className="DateInput__display-text DateInput__display-text--has-input">11/20/2016</div>
										</div>
										<button type="button" aria-label="Clear Dates" className="DateRangePickerInput__clear-dates">
											<div className="DateRangePickerInput__close-icon">
												<svg viewBox="0 0 12 12">
													<path fillRule="evenodd" d="M11.53.47a.75.75 0 0 0-1.061 0l-4.47 4.47L1.529.47A.75.75 0 1 0 .468 1.531l4.47 4.47-4.47 4.47a.75.75 0 1 0 1.061 1.061l4.47-4.47 4.47 4.47a.75.75 0 1 0 1.061-1.061l-4.47-4.47 4.47-4.47a.75.75 0 0 0 0-1.061z"></path>
												</svg>
											</div>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="boss-form__field boss-form__field_layout_min">
						<div className="boss-form__switcher">
							<label className="boss-form__switcher-label">
							<input type="radio" name="display-desktop" value="1" className="boss-form__switcher-radio" checked="" />
							<span className="boss-form__switcher-label-text">Show All</span>
							</label>
							<label className="boss-form__switcher-label">
								<input type="radio" name="display-desktop" value="2" className="boss-form__switcher-radio" />
								<span className="boss-form__switcher-label-text">Uncollected Only</span>
							</label>
							<label className="boss-form__switcher-label">
								<input type="radio" name="display-desktop" value="3" className="boss-form__switcher-radio" />
								<span className="boss-form__switcher-label-text">Late Only</span>
							</label>
						</div>
					</div>
					<div className="boss-form__field boss-form__field_layout_min">
						<button className="boss-button boss-form__submit" type="submit">Update</button>
					</div>
				</div>
				<div className="boss-form__group boss-form__group_position_last boss-form__group_visible-l">
					<div className="boss-form__field">
						<p className="boss-form__label"><span className="boss-form__label-text">Filter</span></p>
						<div className="date-range-picker date-range-picker_type_interval-fluid date-range-picker_type_icon">
							<div className="DateRangePicker">
								<div>
									<div className="DateRangePickerInput">
										<div className="DateInput">
											<input aria-label="Start Date" className="DateInput__input needsclick" id="startDate" name="startDate" value="2017-10-16" placeholder="Start Date" autoComplete="off" aria-describedby="DateInput__screen-reader-message-startDate" type="text" />
											<p id="DateInput__screen-reader-message-startDate" className="screen-reader-only">Press the down arrow key to interact with the calendar and select a date. Press the question mark key to get the keyboard shortcuts for changing dates.</p>
											<div className="DateInput__display-text DateInput__display-text--has-input">11/14/2016</div>
										</div>
										<div className="DateRangePickerInput__arrow" aria-hidden="true" role="presentation">
											<svg viewBox="0 0 1000 1000">
												<path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"></path>
											</svg>
										</div>
										<div className="DateInput">
											<input aria-label="End Date" className="DateInput__input needsclick" id="endDate" name="endDate" value="2017-10-26" placeholder="End Date" autoComplete="off" aria-describedby="DateInput__screen-reader-message-endDate" type="text" />
											<p id="DateInput__screen-reader-message-endDate" className="screen-reader-only">Press the down arrow key to interact with the calendar and select a date. Press the question mark key to get the keyboard shortcuts for changing dates.</p>
												<div className="DateInput__display-text DateInput__display-text--has-input">11/20/2016</div>
										</div>
										<button type="button" aria-label="Clear Dates" className="DateRangePickerInput__clear-dates"><div className="DateRangePickerInput__close-icon"><svg viewBox="0 0 12 12"><path fillRule="evenodd" d="M11.53.47a.75.75 0 0 0-1.061 0l-4.47 4.47L1.529.47A.75.75 0 1 0 .468 1.531l4.47 4.47-4.47 4.47a.75.75 0 1 0 1.061 1.061l4.47-4.47 4.47 4.47a.75.75 0 1 0 1.061-1.061l-4.47-4.47 4.47-4.47a.75.75 0 0 0 0-1.061z"></path></svg></div></button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="boss-form__field">
						<div className="boss-form__switcher boss-form__switcher_layout_vertical-s">
							<label className="boss-form__switcher-label">
								<input type="radio" name="display-mobile" value="1" className="boss-form__switcher-radio" checked="" />
								<span className="boss-form__switcher-label-text">Show All</span>
							</label>
							<label className="boss-form__switcher-label">
								<input type="radio" name="display-mobile" value="2" className="boss-form__switcher-radio" />
								<span className="boss-form__switcher-label-text">Uncollected Only</span>
							</label>
							<label className="boss-form__switcher-label">
								<input type="radio" name="display-mobile" value="3" className="boss-form__switcher-radio" />
								<span className="boss-form__switcher-label-text">Late Only</span>
							</label>
						</div>
					</div>
				</div>
			</form>
    </div>;
  }
}
