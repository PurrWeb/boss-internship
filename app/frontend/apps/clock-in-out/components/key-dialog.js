import React from "react"
import Spinner from "~/components/spinner"

export default class KeyDialog extends React.Component {
    render(){
        const buttonOrSpinner = this.props.loadDataInProgress ?
            <Spinner /> :
            <button type="submit" className="boss-clock-button boss-clock-button_type_very-big" data-test-marker-api-key-button>Load Clock In/Out Page</button>;

        return (
            <div className="boss-main-content">
                <div className="boss-main-content__body boss-main-content__body_role_lock-screen">
                    <button className="boss-clock-button boss-clock-button_role_reload boss-main-content__body_adjust_lock-screen-reload-button"
                       onClick={() => { location.reload(); }}
                    >Reload</button>

                    <form action="" className="boss-form boss-form_role_enter_key"
                          onSubmit={(e) => {
                                e.preventDefault();
                                if (this.apiKeyInput.value != null && this.apiKeyInput.value != "") {
                                  this.props.onApiKeySelected(this.apiKeyInput.value)
                                }
                            }}
                          data-test-marker-key-dialog-form
                    >
                        <label htmlFor="key" className="boss-label boss-label_type_big boss-main-content__body_adjust_lock-screen-label-big">Enter Key</label>
                        <input type="text" id="key" className="boss-input boss-input_type_big boss-input_role_key boss-input_outlined boss-main-content__body_adjust_lock-screen-input"
                                ref={(input) => this.apiKeyInput = input}
                        />
                {buttonOrSpinner}
            </form>

                </div>
            </div>
        )
    }
}
