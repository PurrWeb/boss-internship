import React, { Component } from 'react';

const LOCK_ICON =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxODUgMTg3IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxODUgMTg3OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAgICA7fS5zdDF7ZmlsbDojZWVlO30uc3Qye2ZpbGw6I2VkN2Y3ZTt9PC9zdHlsZT48ZyBjbGFzcz0ic3QwIj48ZyBpZD0iZmlndXJlcyI+PGc+PHBhdGggY2xhc3M9InN0MSIgZD0iTTY4LjUsMThjMi40ODEsMCw0LjUsMi4wMTksNC41LDQuNVM3MC45ODEsMjcsNjguNSwyN1M2NCwyNC45ODEsNjQsMjIuNVM2Ni4wMTksMTgsNjguNSwxOCBNMjQuNSwxMzNjMi40ODEsMCw0LjUsMi4wMTksNC41LDQuNXMtMi4wMTksNC41LTQuNSw0LjVzLTQuNS0yLjAxOS00LjUtNC41UzIyLjAxOSwxMzMsMjQuNSwxMzMgTTE3Ni41LDEzN2MyLjQ4MSwwLDQuNSwyLjAxOSw0LjUsNC41YzAsMi40ODEtMi4wMTksNC41LTQuNSw0LjVzLTQuNS0yLjAxOS00LjUtNC41QzE3MiwxMzkuMDE5LDE3NC4wMTksMTM3LDE3Ni41LDEzNyBNMTc2LjY1NSwwLjAxM2wtMS45NTgsNi4zNjZsLTYuMzc0LDEuOTU2bDYuMzc0LDEuOTU1bDEuOTU4LDYuMzY2bDEuOTU4LTYuMzY2bDYuMzc0LTEuOTU1bC02LjM3NC0xLjk1NkwxNzYuNjU1LDAuMDEzTDE3Ni42NTUsMC4wMTN6IE02OC41LDE1Yy00LjE0MiwwLTcuNSwzLjM1OC03LjUsNy41YzAsNC4xNDIsMy4zNTgsNy41LDcuNSw3LjVzNy41LTMuMzU4LDcuNS03LjVDNzYsMTguMzU4LDcyLjY0MiwxNSw2OC41LDE1TDY4LjUsMTV6IE04LjM0NSwyNS43ODdsLTEuOTU4LDYuMzY2bC02LjM3NCwxLjk1NWw2LjM3NCwxLjk1NmwxLjk1OCw2LjM2NmwxLjk1OC02LjM2Nmw2LjM3NC0xLjk1NmwtNi4zNzQtMS45NTVMOC4zNDUsMjUuNzg3TDguMzQ1LDI1Ljc4N3ogTTI0LjUsMTMwYy00LjE0MiwwLTcuNSwzLjM1OC03LjUsNy41YzAsNC4xNDIsMy4zNTgsNy41LDcuNSw3LjVzNy41LTMuMzU4LDcuNS03LjVDMzIsMTMzLjM1OCwyOC42NDIsMTMwLDI0LjUsMTMwTDI0LjUsMTMweiBNMTc2LjUsMTM0Yy00LjE0MiwwLTcuNSwzLjM1OC03LjUsNy41YzAsNC4xNDIsMy4zNTgsNy41LDcuNSw3LjVzNy41LTMuMzU4LDcuNS03LjVDMTg0LDEzNy4zNTgsMTgwLjY0MiwxMzQsMTc2LjUsMTM0TDE3Ni41LDEzNHogTTcxLjE4MSwxNzAuMzQ0bC0xLjk1OCw2LjM2NmwtNi4zNzQsMS45NTZsNi4zNzQsMS45NTZsMS45NTgsNi4zNjZsMS45NTgtNi4zNjZsNi4zNzQtMS45NTZsLTYuMzc0LTEuOTU2TDcxLjE4MSwxNzAuMzQ0TDcxLjE4MSwxNzAuMzQ0eiIvPjwvZz48L2c+PC9nPjxnIGNsYXNzPSJzdDAiPjxnIGlkPSJsb2NrIj48Zz48cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTMzLjkxLDgwLjcwOVY2OS4wNzFDMTMzLjkxLDUyLjU4OSwxMjAuODEzLDM5LDEwNC4zNTgsMzloLTYuNzE2Yy0xNi40NTUsMC0zMC4yMjQsMTMuNTIyLTMwLjIyNCwzMC4wNzF2MTEuNjM4QzYwLjcwMiw4Mi43OTQsNTYsODkuMTg1LDU2LDk2LjY1M3YzNi44NjZDNTYsMTQyLjczNCw2My40NTUsMTUwLDcyLjY1NywxNTBoNTYuNjg3YzkuMjAyLDAsMTYuNjU3LTcuMjY2LDE2LjY1Ny0xNi40ODJWOTYuNjUzQzE0Niw4OS4xODUsMTQxLjI5OSw4Mi43OTQsMTMzLjkxLDgwLjcwOXogTTc1LjQ3Nyw2OS4wNzFjMC0xMi4wNDIsMTAuMTQyLTIxLjk5OCwyMi4xNjQtMjEuOTk4aDYuNzE2YzEyLjAyMiwwLDIxLjQ5Myw5Ljk1NiwyMS40OTMsMjEuOTk4djEwLjk2NUg3NS40NzdWNjkuMDcxeiBNMTM3Ljk0LDEzMy4zMTZjMCw0Ljc3Ni0zLjgyOCw4LjYxMS04LjU5Nyw4LjYxMUg3Mi42NTdjLTQuNzY5LDAtOC41OTctMy44MzUtOC41OTctOC42MTFWOTYuNzJjMC00Ljc3NiwzLjgyOC04LjYxMSw4LjU5Ny04LjYxMWg1Ni42ODdjNC43NjksMCw4LjU5NywzLjgzNSw4LjU5Nyw4LjYxMVYxMzMuMzE2eiBNOTkuNjU3LDExMC45ODJjLTIuMjE2LDAtNC4wMywxLjgxNi00LjAzLDQuMDM2VjEyNy44YzAsMi4yMiwxLjgxMyw0LjAzNiw0LjAzLDQuMDM2czQuMDMtMS44MTYsNC4wMy00LjAzNnYtMTIuNzgyQzEwMy42ODYsMTEyLjc5OCwxMDEuODczLDExMC45ODIsOTkuNjU3LDExMC45ODJ6Ii8+PC9nPjwvZz48L2c+PC9zdmc+';

class UnauthorizedPage extends Component {
  render() {
    return (
      <main className="boss-page-main">
        <div className="boss-page-main__content">
          <div className="boss-page-main__inner">
            <div className="boss-error boss-error_role_modal">
              <div className="boss-error__group">
                <div className="boss-error__icon">
                  <img src={LOCK_ICON} alt="Lock" className="boss-error__image" />
                </div>
                <div className="boss-error__info">
                  <h1 className="boss-error__title">
                    <span className="boss-error__title-code">401</span> Unauthorized
                  </h1>
                  <p className="boss-error__text">
                    <span className="boss-error__text-line">You are not authorized to view this page.</span>
                    <span className="boss-error__text-line">Please contact administrator and request access.</span>
                  </p>
                  <div className="boss-error__actions">
                    <a href="/" className="boss-button boss-error__action">
                      Back to Home
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default UnauthorizedPage;
