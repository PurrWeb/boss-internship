import React from "react"
import moment from "moment"
import utils from "~lib/utils"
import cx from 'classnames'

export default class RotaNavigation extends React.Component {
    static PropTypes = {
        dateOfRota: React.PropTypes.instanceOf(Date).isRequired,
        getRotaLink: React.PropTypes.func.isRequired,
        getRotaOverviewLink: React.PropTypes.func.isRequired,
        className: React.PropTypes.string,
    }
    render(){
        var dates = this.getDates();
        const className = cx('row', this.props.className)
        return <div className={className} style={{textAlign: "center"}}>
            <div className="shrink column">
                <a href={this.props.getRotaLink(dates.previousDate)}>
                    <i className="fa fa-chevron-left mr-base" />{moment(dates.previousDate).format("DD MMM YYYY")}
                </a>
            </div>
            <div className="column">
                <a href={this.props.getRotaOverviewLink({
                    weekStartDate: dates.weekStartDate,
                    weekEndDate: dates.weekEndDate
                })}>
                    Weekly Rota Overview
                </a>
            </div>
            <div className="shrink column">
                <a href={this.props.getRotaLink(dates.nextDate)}>
                    {moment(dates.nextDate).format("DD MMM YYYY")}<i className="fa fa-chevron-right ml-base" />
                </a>
            </div>
        </div>
    }
    getDates(){
        var { dateOfRota } = this.props;

        var previousDate = new Date(dateOfRota);
        previousDate.setDate(dateOfRota.getDate() - 1);

        var nextDate = new Date(this.props.dateOfRota);
        nextDate.setDate(dateOfRota.getDate() + 1);

        var weekStartDate = utils.getWeekStartDate(dateOfRota);
        var weekEndDate = utils.getWeekEndDate(dateOfRota);

        return {
            previousDate,
            nextDate,
            weekStartDate,
            weekEndDate
        }
    }
}