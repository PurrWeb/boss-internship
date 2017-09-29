import React from "react"

export default function DashboardTitle({title, children}) {
  return (
    <div className="boss-page-dashboard__group">
      <h1 className="boss-page-dashboard__title">{title}</h1>
      <div className="boss-page-dashboard__buttons-group">
        {children}
      </div>
    </div>
  )
}
