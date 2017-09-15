import React from "react"

const DashboardWrapper = ({children}) => {
  return (
    <div className="boss-page-main__dashboard">
      <div className="boss-page-main__inner">
        {children}
      </div>
    </div>
  );
}

export default DashboardWrapper;
