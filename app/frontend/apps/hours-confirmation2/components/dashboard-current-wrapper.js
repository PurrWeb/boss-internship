import React from "react"
import DashboardWrapper from './dashboard-wrapper';

export default function DashboardCurrentWrapper({title, children}) {

  return (
    <DashboardWrapper>
      <h1 className="boss-page-dashboard__title">{title}</h1>
      <div className="boss-page-dashboard__group">
        {children}
      </div>
    </DashboardWrapper>
  )
}

