import React from "react"
import utils from "~/lib/utils"
import Spinner from "~/components/spinner"
import ComponentErrors from "~/components/component-errors"

export default class RotaForecast extends React.Component {
    static propTypes = {
        rotaForecast: React.PropTypes.object.isRequired,
        forecastedTake: React.PropTypes.string.isRequired,
        canEditForecastedTake: React.PropTypes.bool,
        onForecastedTakeChanged: React.PropTypes.func,
        onUpdateForecastClick: React.PropTypes.func,
        isUpdatingForecast: React.PropTypes.bool
    }
    render(){
        return <div className="boss-board__rota">
          <div className="boss-forecast">
            {this.getForecastHeaderRow()}
            {this.getForecastBody()}
          </div>
        </div>
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
                    value={this.props.forecastedTake}
                    className="boss-forecast__amount-input"
                    onChange={(event) => this.props.onForecastedTakeChanged(event.target.value)}
                    type="text" />
            </div>

            updateForecastButton = <a
                className="boss-button boss-button_type_small"
                data-test-marker-update-forecast-button
                onClick={this.props.onUpdateForecastClick} >
                Update
            </a>

            if (this.props.isUpdatingForecast){
                updateForecastButton = <Spinner />
            }
        }

        return <div className="boss-forecast__row boss-forecast__row_role_header">
                <div className="boss-forecast__cell">
                  Forecast
                </div>
                <div className="boss-forecast__cell">
                  {forecastedTakeComponent}
                </div>
                <div className="boss-forecast__cell">
                    {updateForecastButton}
                </div>
            {this.getErrorComponent()}
        </div>
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
              {row.percentage !== null ? (Math.round(row.percentage*100)/100) + "%" : "-"}
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
