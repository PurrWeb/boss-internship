import React from "react"

export default class RotaForecast extends React.Component {
    static propTypes = {
        rotaForecast: React.PropTypes.object.isRequired
    }
    render(){  
        var rotaForecast = this.props.rotaForecast;

        var dataRowComponents = getDataRows(rotaForecast).map(
            (row) => this.getDataRowComponent(row)
        );

        return <div>
            {dataRowComponents}
        </div>
    }
    getDataRowComponent(row){
        return <div className="row" key={row.title}>
            <div className="col-md-4">
                {row.title}
            </div>
            <div className="col-md-5" style={{textAlign: "right"}}>
                &pound;{row.total.toFixed(2)}
            </div>
            <div className="col-md-3" style={{textAlign: "right"}}>
                {row.percentage}%
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