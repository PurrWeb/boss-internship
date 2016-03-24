import React from "react"
import utils from "~lib/utils"
import Spinner from "~components/spinner"
import ComponentErrors from "~components/component-errors"

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
        return <div className="rota-forecast">
            {this.getForecastHeaderRow()}
            {this.getForecastBody()}
        </div>
    }
    getForecastBody(){
        var dataRows = getDataRows(this.props.rotaForecast);
        var dataRowComponents = dataRows.map(
            (row) => this.getDataRowComponent(row)
        );

        return <div className="rota-forecast__body">
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
            forecastedTakeComponent = <div>
                &pound;&nbsp;
                <input
                    value={this.props.forecastedTake}
                    style={{width: "85%", textAlign: "right"}}
                    onChange={(event) => this.props.onForecastedTakeChanged(event.target.value)}
                    type="text" />
            </div>

            updateForecastButton = <a
                className="btn btn-default btn-sm"
                onClick={this.props.onUpdateForecastClick} >
                Update
            </a>

            if (this.props.isUpdatingForecast){
                updateForecastButton = <Spinner />
            }
        }

        return <div className="rota-forecast__header-row row">
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-4">
                        Forecast
                    </div>
                    <div className="col-md-5" style={{textAlign: "right"}}>
                        {forecastedTakeComponent}
                    </div>
                    <div className="col-md-3" style={{textAlign: "right"}}>
                        {updateForecastButton}
                    </div>
                </div>
            </div>
            {this.getErrorComponent()}

        </div>
    }
    getErrorComponent(){
        if (!this.props.errors){
            return null;
        }
        return <div className="col-md-12" style={{marginBottom: -10, marginTop: 10}}>
            <ComponentErrors errors={this.props.errors} />
        </div>
    }
    getDataRowComponent(row){
        return <div className="row" key={row.title}>
            <div className="col-md-4">
                {row.title}
            </div>
            <div className="col-md-5" style={{textAlign: "right"}}>
                &pound;{utils.formatMoney(row.total)}
            </div>
            <div className="col-md-3" style={{textAlign: "right"}}>
                {Math.round(row.percentage*100)/100}%
            </div>
        </div>
    }
}

function getDataRows(rotaForecast){
    return [
        {
            title: "Staff",
            total: rotaForecast.staff_total,
            percentage: rotaForecast.staff_total_percentage
        },
        {
            title: "PRs",
            total: rotaForecast.pr_total,
            percentage: rotaForecast.pr_total_percentage
        },
        {
            title: "Kitchen",
            total: rotaForecast.kitchen_total,
            percentage: rotaForecast.kitchen_total_percentage
        },
        {
            title: "Security",
            total: rotaForecast.security_total,
            percentage: rotaForecast.security_total_percentage
        },
        {
            title: "Total",
            total: rotaForecast.total,
            percentage: rotaForecast.total_percentage
        }
    ];
}