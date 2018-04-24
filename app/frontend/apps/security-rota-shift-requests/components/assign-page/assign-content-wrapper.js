import React from 'react';

const ErrorBlock = ({error}) => (
  <div className="boss-alert boss-alert_context_above">
    <p className="boss-alert__text">{error}</p>
  </div>
);

const ContentWrapper = ({ children, error }) => {
  return (
    <div className="boss-page-main__content">
      <div className="boss-page-main__inner">
      {error && <ErrorBlock error={error} />}
        <section className="boss-board">
          <div className="boss-board__main">
            <div className="boss-board__rota">{children}</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContentWrapper;
