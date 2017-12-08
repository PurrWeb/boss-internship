import React from 'react';
import oFetch from 'o-fetch';
import utils from "~/lib/utils";
import safeMoment from "~/lib/safe-moment"

class OverviewBoard extends React.Component {
  alertClassForCentValue(centValue){
    return centValue < 0 ? "boss-overview__list-item_state_alert" : ""
  }

  render() {
    const dailyReport = oFetch(this.props, 'dailyReport');
    const actualCostCents = oFetch(dailyReport, 'actualCostCents');
    const overheadsCents = oFetch(dailyReport, 'overheadsCents');
    const varianceCents = oFetch(dailyReport, 'varianceCents');
    const rotaedCostCents = oFetch(dailyReport, 'rotaedCostCents');
    const lastCalculatedAtM = safeMoment.iso8601Parse(oFetch(dailyReport, 'lastCalculatedAt'));

    return <section className="boss-board boss-board_context_stack">
        <header className="boss-board__header">
          <h2 className="boss-board__title boss-board__title_size_medium">Overview</h2>
        </header>
        <div className="boss-board__main">
          <div className="boss-board__overview">
            <div className="boss-overview">
              <ul className="boss-overview__list">
                <li className={`boss-overview__list-item boss-overview__list-item_role_stats ${this.alertClassForCentValue(overheadsCents)}`}>
                  <p className="boss-overview__list-name">Overheads</p>
                  <p className="boss-overview__list-number">
                    {`£${overheadsCents / 100.0}`}
                  </p>
                </li>
                <li className={`boss-overview__list-item boss-overview__list-item_role_stats ${this.alertClassForCentValue(rotaedCostCents)}`}>
                  <p className="boss-overview__list-name">Rotaed Cost - Overheads</p>
                  <p className="boss-overview__list-number">
                    {`£${rotaedCostCents / 100.0}`}
                  </p>
                </li>
                <li className={`boss-overview__list-item boss-overview__list-item_role_stats ${this.alertClassForCentValue(actualCostCents)}`}>
                  <p className="boss-overview__list-name">Actual Cost - Overheads</p>
                  <p className="boss-overview__list-number">
                    {`£${actualCostCents / 100.0}`}
                  </p>
                </li>
                <li className={`boss-overview__list-item boss-overview__list-item_role_stats ${this.alertClassForCentValue(varianceCents)}`}>
                  <p className="boss-overview__list-name">Variance</p>
                  <p className="boss-overview__list-number">
                    {`£${varianceCents / 100.0}`}
                  </p>
                </li>
                <li className="boss-overview__list-item boss-overview__list-item_role_stats ">
                  <p className="boss-overview__list-name">Last Updated</p>
                  <p className="boss-overview__list-number">{ lastCalculatedAtM.format(utils.humanDateFormatWithTime()) }</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
  }
}

export default OverviewBoard;