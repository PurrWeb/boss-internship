export default window.handleError = {
    throwWithErrorPage: (errorText) => {
        setTimeout(() => {
            require('../assets/sass/index.sass');
            let url = require("url-loader?limit=1000000!../../assets/images/something-went-wrong.jpg");

            document.body.innerHTML = `
              <main class="boss-page-main boss-page-main_full">
                <div class="boss-page-main__content">
                    <div class="boss-page-main__inner">
                        <div class="boss-error">
                            <h1 class="boss-error__title">Something has gone horribly wrong</h1>
                            <img src="${url}" alt="Something went wrong" class="boss-error__image">
                            <p class="boss-error__text">There was an error in the code on this page. If the problem persists please contact Sina and let him know about it so that he can relay this information to the technical team.</p>
                            <a href="javascript:;" class="boss-button boss-button_role_reload-page boss-error__button" onClick="location.reload()">Reload page</a>
                        </div>
                    </div>
                </div>
              </main>
            `;
        }, 500);
        throw Error(errorText);
    }
}
