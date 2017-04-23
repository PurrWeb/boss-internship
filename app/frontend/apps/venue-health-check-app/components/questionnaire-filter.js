import React from 'react';
import classnames from 'classnames';

export default class QuestionnaireFilter extends React.Component {
  static displayName = 'QuestionnaireFilter';

  toggleDropdown(e) {
    e.preventDefault();

    let dropdownSwitch = $(e.target.closest('.boss-dropdown__switch'));
    let dropdownContent = $(e.target.closest('.boss-page-dashboard__filter')).find('.boss-dropdown__content').first();

    dropdownSwitch.toggleClass('boss-dropdown__switch_state_opened');
    dropdownContent.slideToggle().end().toggleClass('boss-dropdown__content_state_opened');
  }

  setSectionFilter(e) {
    this.props.setFilter({ section: e.target.value });
  }

  setGroupByFilter(e) {
    this.props.setFilter({ groupBy: e.target.value });
  }

  setDisplayFilter(e) {
    this.props.setFilter({ display: e.target.value });
  }

  setAreaFilter(e) {
    this.props.setFilter({ area: e.target.value });
  }

  dropdownSectionOptions() {
    var sectionOptions = this.props.categories.map((category, index) => {
      return (
        <option value={ category.name } key={ category.name }>
          { category.name }
        </option>
      );
    });

    sectionOptions.unshift(
      <option value="any" key="any" selected>
        Any
      </option>
    );

    return sectionOptions;
  }

  dropdownAreaOptions() {
    var areaOptions = this.props.areas.map((area, index) => {
      return (
        <option value={ area.name } key={ area.name }>
          { area.name }
        </option>
      );
    });

    areaOptions.unshift(
      <option value="any" key="any" selected>
        Any
      </option>
    );

    return areaOptions;
  }

  dropdownGroupByOptions() {
    return ['section', 'question', 'area'].map((groupName, index) => {
      return (
        <option value={ groupName } key={ groupName } selected={ groupName == this.props.filters.groupBy }>
          { groupName }
        </option>
      );
    });
  }

  render() {
    return (
      <div className="boss-page-dashboard__filter">
        <div className="boss-dropdown">
          <div className="boss-dropdown__header">
            <a
              href="#"
              className="boss-dropdown__switch boss-dropdown__switch_role_filter boss-dropdown__switch_state_opened"
              onClick={ this.toggleDropdown.bind(this) }
              >
                Filtering
              </a>
          </div>

          <div className="boss-dropdown__content boss-dropdown__content_state_opened">
            <div className="boss-dropdown__content-inner">

              <form action="#" className="boss-form">
                <div className="boss-form__field">
                  <p className="boss-form__label"><span className="boss-form__label-text">Display</span></p>
                  <div className="boss-form__switcher boss-form__switcher_size_small">
                    <label className="boss-form__switcher-label">
                      <input
                        type="radio"
                        name="display"
                        value="unanswered"
                        className="boss-form__switcher-radio"
                        defaultChecked={ this.props.filters.display == 'unanswered' }
                        onClick={ this.setDisplayFilter.bind(this) }
                      />
                      <span className="boss-form__switcher-label-text">Unanswered Only</span>
                    </label>

                    <label className="boss-form__switcher-label">
                      <input
                        type="radio"
                        name="display"
                        value="all"
                        className="boss-form__switcher-radio"
                        defaultChecked={ this.props.filters.display == 'all' }
                        onClick={ this.setDisplayFilter.bind(this) }
                      />
                      <span className="boss-form__switcher-label-text">All</span>
                    </label>
                  </div>
                </div>

                <div className="boss-form__row boss-form__row_position_last">
                  <div className="boss-form__field boss-form__field_layout_third">
                    <label for="filter-section" className="boss-form__label"><span className="boss-form__label-text">Section</span></label>
                    <div className="boss-form__select">
                      <select name="section" id="filter-section" onChange={ this.setSectionFilter.bind(this) }>
                        { this.dropdownSectionOptions() }
                      </select>
                    </div>
                  </div>

                  <div className="boss-form__field boss-form__field_layout_third">
                    <label for="filter-area" className="boss-form__label"><span className="boss-form__label-text">Area</span></label>
                    <div className="boss-form__select">
                      <select id="filter-area" name="area" onChange={ this.setAreaFilter.bind(this) }>
                        { this.dropdownAreaOptions() }
                      </select>
                    </div>
                  </div>

                  <div className="boss-form__field boss-form__field_layout_third">
                    <label for="filter-group-by" className="boss-form__label"><span className="boss-form__label-text">Group by</span></label>
                    <div className="boss-form__select">
                      <select id="filter-group-by" name="group-by" onChange={ this.setGroupByFilter.bind(this) }>
                        { this.dropdownGroupByOptions() }
                      </select>
                    </div>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
