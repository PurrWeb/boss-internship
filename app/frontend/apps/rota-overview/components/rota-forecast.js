import PropTypes from 'prop-types';
import React from "react"
import utils from "~/lib/utils"
import Spinner from "~/components/spinner"
import ComponentErrors from "~/components/component-errors"

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
            (row) => this.getDataRowComponent(row)
        );

        return <div>
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
    getDataRowComponent(row){
      const rowClassName = row.title === 'Total' ? 'boss-forecast__row boss-forecast__row_role_footer' : 'boss-forecast__row';
      const rowPercentageClass = row.percentage > 0 ? 'boss-button_role_secondary' : 'boss-button_role_alert';
      
      return <div className={rowClassName} key={row.title}>
          <div className="boss-forecast__cell">
              {row.title}
          </div>
          <div className="boss-forecast__cell">
              &pound;{utils.formatMoney(row.total/100)}
          </div>
          <div className="boss-forecast__cell">
            <p className={'boss-button boss-button_type_small boss-button_type_no-behavior boss-button_role_secondary ' + rowPercentageClass}>
              {row.percentage !== null ? (Math.round(row.percentage*100)/100) + "%" : "0%"}
              </p>
          </div>
      </div>
    }
}

function getDataRows(rotaForecast){
    return [
        {
          title: "Overheads",
          total: rotaForecast.overhead_total_cents,
          percentage: rotaForecast.overhead_total_percentage
        },
        {
            title: "Staff",
            total: rotaForecast.staff_total_cents,
            percentage: rotaForecast.staff_total_percentage
        },
        {
            title: "PRs",
            total: rotaForecast.pr_total_cents,
            percentage: rotaForecast.pr_total_percentage
        },
        {
            title: "Kitchen",
            total: rotaForecast.kitchen_total_cents,
            percentage: rotaForecast.kitchen_total_percentage
        },
        {
            title: "Security",
            total: rotaForecast.security_total_cents,
            percentage: rotaForecast.security_total_percentage
        },
        {
            title: "Total",
            total: rotaForecast.total_cents,
            percentage: rotaForecast.total_percentage
        }
    ];
}
