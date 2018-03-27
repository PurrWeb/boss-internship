import React from "react"

export default function DashboardWrapper({title, children}) {

  return (
    <div className="boss-page-main__dashboard">
      <div className="boss-page-main__inner">
        <div className="boss-page-dashboard boss-page-dashboard_updated">
          {children}
        </div>
      </div>
    </div>            
  )
}

