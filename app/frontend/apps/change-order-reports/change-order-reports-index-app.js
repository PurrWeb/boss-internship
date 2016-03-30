import _ from 'underscore'
import React, { Component } from 'react'
import utils from "~lib/utils"
import { appRoutes } from "~lib/routes"
import { processBackendObject } from '~lib/backend-data/process-backend-object.js'
import WeekPicker from "~components/week-picker"

export default class ChangeOrderReportsIndexApp extends Component {
  render(){
    let date = window.boss.pageData.date;

    return <WeekPicker
      selectionStartDate={ new Date(date) }
      onChange={({startDate, endDate, allDates}) => {
              location.href = appRoutes.changeOrderReportsIndex({
                  date: startDate
              })
          }
      }
    />
  }
}
