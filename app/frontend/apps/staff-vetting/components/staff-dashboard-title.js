const StaffDashboardTitle = ({ text, count }) => {
  return (
    <h1 className="boss-page-dashboard__title">
      <span className="boss-page-dashboard__title-text">{text}</span>
      <span className="boss-page-dashboard__title-info">
        {count > 0 ? `+${count}` : 0}
      </span>
    </h1>
  );
};

export default StaffDashboardTitle;
