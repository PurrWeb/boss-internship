import React from "react"
import Spinner from "~components/spinner"

export default class KeyDialog extends React.Component {
    render(){
        const buttonOrSpinner = this.props.loadDataInProgress ?
            <Spinner /> :
            <button type="submit" className="boss3-clock-button boss3-clock-button_very-big" data-test-marker-api-key-button>Load Clock In/Out Page</button>;

        return (
            <div className="boss3-main-content">
                <div className="boss3-main-content__body boss3-main-content__body_role_lock-screen">
                    <a href="#" className="boss3-clock-button boss3-clock-button_role_reload
                                boss3-main-content__body_adjust_lock-screen-reload-button"
                       onClick={() => { location.reload(); }}
                    >Reload</a>

                    <form action="" className="boss3-form boss3-form_role_enter_key"
                          onSubmit={(e) => {
                                e.preventDefault();
                                if (this.apiKeyInput.value != null && this.apiKeyInput.value != "") {
                                  this.props.onApiKeySelected(this.apiKeyInput.value)
                                }
                            }}
                          data-test-marker-key-dialog-form
                    >
                        <label htmlFor="key" className="boss3-label boss3-label_type_big boss3-main-content__body_adjust_lock-screen-label-big">Enter Key</label>
                        <input type="text" id="key" className="boss3-input boss3-input_big boss3-input_type_key
                                boss3-input_outlined boss3-main-content__body_adjust_lock-screen-input"
                                ref={(input) => this.apiKeyInput = input}
                        />
                {buttonOrSpinner}
            </form>

                </div>
            </div>
        )
    }
}
