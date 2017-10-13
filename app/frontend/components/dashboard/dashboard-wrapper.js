import React from "react"

export default function DashboardWrapper({classes = '', children}) {

  const dashboardClasses = `boss-page-dashboard ${classes}`

  return (
    <div className="boss-page-main__dashboard">
      <div className="boss-page-main__inner">
        <div className={dashboardClasses}>
          {children}
        </div>
      </div>
    </div>
  )
}
