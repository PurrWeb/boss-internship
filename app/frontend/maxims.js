window.initMaximsJs = () => {
    var mobileIcon = document.querySelector('.boss-main-menu__navicon');
    var mobileShadowClose = document.querySelector('.boss-mobile-menu__closearea');
    var mobileMenu = document.querySelector('.boss-mobile-menu');
    var mobileMenuSide = document.querySelector('.boss-mobile-menu__side');
    var mobileClose = document.querySelector('.boss-mobile-menu__close');
    var dropIcon = document.querySelectorAll('.boss-mobile-menu__button_dropdown i');
    var drop;

    dropIcon.forEach((item) => {
        item.addEventListener('click', function () {
            drop = this.nextElementSibling;
            drop.classList.toggle('boss-mobile-menu__dropdown_state_active');

            if (drop.classList.contains('boss-mobile-menu__dropdown_state_active')) {
                this.style.backgroundColor = "#ededed";
            } else {
                this.style.backgroundColor = "transparent";
            }
        });
    })

    dropIcon

    function openMobileMenu() {
        document.body.style.overflow = "hidden";
        mobileMenu.classList.add('boss-mobile-menu_state_active');
        mobileMenuSide.classList.add('boss-mobile-menu__side_state_active');
    }

    function closeMobileMenu() {
        document.body.style.overflow = "visible";
        mobileMenu.classList.remove('boss-mobile-menu_state_active');
        mobileMenuSide.classList.remove('boss-mobile-menu__side_state_active');
    }

    mobileIcon.addEventListener('click', openMobileMenu);
    mobileShadowClose.addEventListener('click', closeMobileMenu);
    mobileClose.addEventListener('click', closeMobileMenu);
}
