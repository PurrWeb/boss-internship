import PropTypes from 'prop-types';
import React from "react"
import utils from "~/lib/utils"
import Spinner from "~/components/spinner"
import ComponentErrors from "~/components/component-errors"
import oFetch from 'o-fetch';

export default class RotaForecast extends React.Component {
    static propTypes = {
        rotaForecast: PropTypes.object.isRequired,
        forecastedTake: PropTypes.string.isRequired,
        canEditForecastedTake: PropTypes.bool,
        onForecastedTakeChanged: PropTypes.func,
        onUpdateForecastClick: PropTypes.func,
        isUpdatingForecast: PropTypes.bool
    }

    constructor(props) {
      super(props);

      this.state = {
        forecastedTake: utils.formatMoney(props.rotaForecast.forecasted_take_cents / 100)
      }
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        forecastedTake: utils.formatMoney(nextProps.rotaForecast.forecasted_take_cents / 100)
      });
    }

    render(){
        return <div className="boss-board__rota">
          <div className="boss-forecast">
            {this.getForecastHeaderRow()}
            {this.getErrorComponent()}
            {this.getForecastBody()}
            {this.getForecastFooter()}
          </div>
        </div>
    }

    onUpdateForecast = (forecastedTake) => {
      this.setState({
        forecastedTake: this.state.forecastedTake
      }, () => {
        this.props.onUpdateForecastClick(this.state.forecastedTake);
      });
    }

    getForecastBody(){
        var dataRows = getDataRows(this.props.rotaForecast);
        var dataRowComponents = dataRows.map(
          (row) => this.getForcastDataRowComponent(row)
        );

        return <div>
          {dataRowComponents}
        </div>;
    }

    getForecastFooter() {
        var dataRows = getFooterRows(this.props.rotaForecast);
        var dataRowComponents = dataRows.map(
            (row) => this.getStandardDataRowComponent({
              row: row,
              useAlertStyling: false,
            })
        );

        return <div className="boss-forecast__group boss-forecast__group_role_footer">
            {dataRowComponents}
        </div>;
    }

    getForecastHeaderRow(){
        var forecastedTakeComponent = <div>
            &pound;
            {this.props.forecastedTake}
        </div>;
        var updateForecastButton = null

        if (this.props.canEditForecastedTake){
            forecastedTakeComponent = <div className="boss-forecast__cell">
                <span className="boss-forecast__amount-currency">&pound;&nbsp;</span>
                <input
                    data-test-marker-forecasted-take
                    value={this.state.forecastedTake}
                    className="boss-forecast__amount-input"
                    onChange={(event) => this.setState({forecastedTake: event.target.value})}
                    type="text" />
            </div>

            updateForecastButton = <a
                className="boss-button boss-button_type_small"
                data-test-marker-update-forecast-button
                onClick={() => this.onUpdateForecast()} >
                Update
            </a>

            if (this.props.isUpdatingForecast){
                updateForecastButton = <div className="boss-spinner"></div>
            }
        }

        return (
          <div className="boss-forecast__row boss-forecast__row_role_header">
          {
            this.props.isUpdatingForecast
              ? <div className="boss-spinner"></div>
              : <div className="boss-forecast__row boss-forecast__row_role_header">
                  <div className="boss-forecast__cell">
                    Forecast
                  </div>
                  <div className="boss-forecast__cell">
                    {forecastedTakeComponent}
                  </div>
                  <div className="boss-forecast__cell">
                    {updateForecastButton}
                  </div>
                </div>
          }
          </div>
        )
    }
    getErrorComponent(){
        return <ComponentErrors
                errorHandlingId={this.props.errorHandlingId}
                extraStyle={{marginBottom: -10, marginTop: 10}} />

    }

    getForcastDataRowComponent(row){
      const thresholdPercentage = oFetch(row, 'thresholdPercentage');
      const rowPercentage = oFetch(row, 'percentage');
      const useAlertStyling = (rowPercentage <= 0) || (thresholdPercentage && rowPercentage > thresholdPercentage);

      return this.getStandardDataRowComponent({
        row: row,
        useAlertStyling: useAlertStyling
      })
    }

    getStandardDataRowComponent(options){
      const row = oFetch(options, 'row');
      const useAlertStyling = oFetch(options, 'useAlertStyling');
      const rowPercentageClass = useAlertStyling ? 'boss-button_role_alert' : 'boss-button_role_secondary';

      return <div className="boss-forecast__row" key={row.title}>
          <div className="boss-forecast__cell">
              {row.title}
          </div>
          <div className="boss-forecast__cell">
              &pound;{utils.formatMoney(row.total/100)}
          </div>
          <div className="boss-forecast__cell">
             {row.percentage !== undefined && <p className={'boss-button boss-button_type_small boss-button_type_no-behavior boss-button_role_secondary ' + rowPercentageClass}>
              {row.percentage !== null ? (Math.round(row.percentage*100)/100) + "%" : "0%"}
              </p>}
          </div>
      </div>
    }
}

function getTaxAndNI(rotaForecast) {
    return (rotaForecast.overhead_total_cents + rotaForecast.kitchen_total_cents + rotaForecast.staff_total_cents) * 0.08;
}

function getFooterRows(rotaForecast) {
    return [
        {
            title: "Tax & NI",
            total: getTaxAndNI(rotaForecast),
        },
        {
            title: "Total",
            total: rotaForecast.total_cents,
            percentage: rotaForecast.total_percentage
        }
    ]
}

function getDataRows(rotaForecast){
    return [
        {
          title: "Overheads",
          total: rotaForecast.overhead_total_cents,
          percentage: rotaForecast.overhead_total_percentage,
          thresholdPercentage: oFetch(rotaForecast, 'venue_overheads_threshold_percentage'),
        },
        {
            title: "Staff",
            total: rotaForecast.staff_total_cents,
            percentage: rotaForecast.staff_total_percentage,
            thresholdPercentage: oFetch(rotaForecast, 'venue_staff_threshold_percentage'),
        },
        {
            title: "PRs",
            total: rotaForecast.pr_total_cents,
            percentage: rotaForecast.pr_total_percentage,
            thresholdPercentage: oFetch(rotaForecast, 'venue_pr_threshold_percentage'),
        },
        {
            title: "Kitchen",
            total: rotaForecast.kitchen_total_cents,
            percentage: rotaForecast.kitchen_total_percentage,
            thresholdPercentage: oFetch(rotaForecast, 'venue_kitchen_threshold_percentage'),
        },
        {
            title: "Security",
            total: rotaForecast.security_total_cents,
            percentage: rotaForecast.security_total_percentage,
            thresholdPercentage: oFetch(rotaForecast, 'venue_security_threshold_percentage'),
        },
    ];
}
