import React from 'react';
import { Link } from 'react-router-dom';

const ICO =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDE4NSAxODciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE4NSAxODc7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30NCgkuc3Qxe2ZpbGw6I0VFRUVFRTt9DQoJLnN0MntmaWxsOiNFRDdGN0U7fQ0KPC9zdHlsZT4NCjxnIGNsYXNzPSJzdDAiPg0KCTxnIGlkPSJmaWd1cmVzIj4NCgkJPGc+DQoJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjguNSwxOGMyLjQ4MSwwLDQuNSwyLjAxOSw0LjUsNC41UzcwLjk4MSwyNyw2OC41LDI3UzY0LDI0Ljk4MSw2NCwyMi41UzY2LjAxOSwxOCw2OC41LDE4IE0yNC41LDEzMw0KCQkJCWMyLjQ4MSwwLDQuNSwyLjAxOSw0LjUsNC41cy0yLjAxOSw0LjUtNC41LDQuNXMtNC41LTIuMDE5LTQuNS00LjVTMjIuMDE5LDEzMywyNC41LDEzMyBNMTc2LjUsMTM3YzIuNDgxLDAsNC41LDIuMDE5LDQuNSw0LjUNCgkJCQljMCwyLjQ4MS0yLjAxOSw0LjUtNC41LDQuNXMtNC41LTIuMDE5LTQuNS00LjVDMTcyLDEzOS4wMTksMTc0LjAxOSwxMzcsMTc2LjUsMTM3IE0xNzYuNjU1LDAuMDEzbC0xLjk1OCw2LjM2NmwtNi4zNzQsMS45NTYNCgkJCQlsNi4zNzQsMS45NTVsMS45NTgsNi4zNjZsMS45NTgtNi4zNjZsNi4zNzQtMS45NTVsLTYuMzc0LTEuOTU2TDE3Ni42NTUsMC4wMTNMMTc2LjY1NSwwLjAxM3ogTTY4LjUsMTUNCgkJCQljLTQuMTQyLDAtNy41LDMuMzU4LTcuNSw3LjVjMCw0LjE0MiwzLjM1OCw3LjUsNy41LDcuNXM3LjUtMy4zNTgsNy41LTcuNUM3NiwxOC4zNTgsNzIuNjQyLDE1LDY4LjUsMTVMNjguNSwxNXogTTguMzQ1LDI1Ljc4Nw0KCQkJCWwtMS45NTgsNi4zNjZsLTYuMzc0LDEuOTU1bDYuMzc0LDEuOTU2bDEuOTU4LDYuMzY2bDEuOTU4LTYuMzY2bDYuMzc0LTEuOTU2bC02LjM3NC0xLjk1NUw4LjM0NSwyNS43ODdMOC4zNDUsMjUuNzg3eiBNMjQuNSwxMzANCgkJCQljLTQuMTQyLDAtNy41LDMuMzU4LTcuNSw3LjVjMCw0LjE0MiwzLjM1OCw3LjUsNy41LDcuNXM3LjUtMy4zNTgsNy41LTcuNUMzMiwxMzMuMzU4LDI4LjY0MiwxMzAsMjQuNSwxMzBMMjQuNSwxMzB6IE0xNzYuNSwxMzQNCgkJCQljLTQuMTQyLDAtNy41LDMuMzU4LTcuNSw3LjVjMCw0LjE0MiwzLjM1OCw3LjUsNy41LDcuNXM3LjUtMy4zNTgsNy41LTcuNUMxODQsMTM3LjM1OCwxODAuNjQyLDEzNCwxNzYuNSwxMzRMMTc2LjUsMTM0eg0KCQkJCSBNNzEuMTgxLDE3MC4zNDRsLTEuOTU4LDYuMzY2bC02LjM3NCwxLjk1Nmw2LjM3NCwxLjk1NmwxLjk1OCw2LjM2NmwxLjk1OC02LjM2Nmw2LjM3NC0xLjk1NmwtNi4zNzQtMS45NTZMNzEuMTgxLDE3MC4zNDQNCgkJCQlMNzEuMTgxLDE3MC4zNDR6Ii8+DQoJCTwvZz4NCgk8L2c+DQo8L2c+DQo8ZyBjbGFzcz0ic3QwIj4NCgk8ZyBpZD0iY2FuY2VsIj4NCgkJPGc+DQoJCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNOTgsMzZjLTMyLjE2NCwwLTU4LDI1LjgzNi01OCw1OGMwLDMyLjE2NCwyNS44MzYsNTgsNTgsNThzNTgtMjUuODM2LDU4LTU4QzE1Niw2MS44MzYsMTMwLjE2NCwzNiw5OCwzNnoNCgkJCQkgTTk4LDE0MS40NTVjLTI2LjM2NCwwLTQ3LjQ1NS0yMS4wOTEtNDcuNDU1LTQ3LjQ1NVM3MS42MzYsNDYuNTQ1LDk4LDQ2LjU0NVMxNDUuNDU1LDY3LjYzNiwxNDUuNDU1LDk0DQoJCQkJUzEyNC4zNjQsMTQxLjQ1NSw5OCwxNDEuNDU1eiBNMTE3LjUwOSw3NC40OTFMMTE3LjUwOSw3NC40OTFjLTIuMTA5LTIuMTA5LTUuMjczLTIuMTA5LTcuMzgyLDBMOTgsODYuNjE4TDg1Ljg3Myw3NC40OTENCgkJCQljLTIuMTA5LTIuMTA5LTUuMjczLTIuMTA5LTcuMzgyLDBzLTIuMTA5LDUuMjczLDAsNy4zODJMOTAuNjE4LDk0bC0xMi4xMjcsMTIuMTI3Yy0yLjEwOSwyLjEwOS0yLjEwOSw1LjI3MywwLDcuMzgyDQoJCQkJYzEuMDU1LDEuMDU1LDIuMTA5LDEuNTgyLDMuNjkxLDEuNTgyYzEuNTgyLDAsMi42MzYtMC41MjcsMy42OTEtMS41ODJMOTgsMTAxLjM4MmwxMi4xMjcsMTIuMTI3DQoJCQkJYzEuMDU1LDEuMDU1LDIuNjM2LDEuNTgyLDMuNjkxLDEuNTgyczIuNjM2LTAuNTI3LDMuNjkxLTEuNTgyYzIuMTA5LTIuMTA5LDIuMTA5LTUuMjczLDAtNy4zODJMMTA1LjM4Miw5NGwxMi4xMjctMTIuMTI3DQoJCQkJQzExOS42MTgsNzkuNzYzLDExOS42MTgsNzYuNiwxMTcuNTA5LDc0LjQ5MXoiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K';
class NotFound extends React.Component {
  render() {
    return (
      <main className="boss-page-main">
        <div className="boss-page-main__content">
          <div className="boss-page-main__inner">
            <div className="boss-error boss-error_role_modal">
              <div className="boss-error__group">
                <div className="boss-error__icon">
                  <img src={ICO} alt="Error&quot;" className="boss-error__image" />
                </div>
                <div className="boss-error__info">
                  <h1 className="boss-error__title">
                    <span className="boss-error__title-code">404</span> Page Not Found
                  </h1>
                  <p className="boss-error__text">
                    <span className="boss-error__text-line">
                      It appears the page or resource you were looking for doesn't exist or has been moved.
                    </span>
                    <span className="boss-error__text-line">You should probably go back to homepage.</span>
                  </p>
                  <div className="boss-error__actions">
                    <Link to="/" className="boss-button boss-error__action">
                      Back to Home
                    </Link>
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

export default NotFound;
