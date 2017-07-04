window.initMobileMenu = () => {
    var mobileIcon = document.querySelector('.boss-main-menu__navicon');
    var mobileShadowClose = document.querySelector('.boss-mobile-menu__closearea');
    var mobileMenu = document.querySelector('.boss-mobile-menu');
    var mobileMenuSide = document.querySelector('.boss-mobile-menu__side');
    var mobileClose = document.querySelector('.boss-mobile-menu__close');
    var dropLink = document.querySelectorAll('.boss-mobile-menu__button_dropdown .boss-mobile-menu__button-link_dropdown');
    var bossCheck = $('.boss-check');
    var drop;

    if (!!dropLink && Object.prototype.toString.call(dropLink) === '[object NodeList]') {
      dropLink.forEach((item) => {
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
    }

    if (!!bossCheck) {
      bossCheck.each(function(){
        var checkDropdown = $(this).find('.boss-check__dropdown'),
            checkDropdownLink = $(this).find('.boss-check__dropdown-link');

        function toggleCheckDropdown(e) {
          e.preventDefault();
          var text = checkDropdownLink.text();
          checkDropdownLink.text(text === 'See Total' ? 'Hide Totals' : 'See Totals');

          if(checkDropdown.hasClass('boss-check__dropdown_state_closed')) {
            checkDropdown.slideToggle().removeClass('boss-check__dropdown_state_closed');
            $(this).removeClass('boss-check__dropdown-link_state_closed');
          } else {
            checkDropdown.slideToggle().addClass('boss-check__dropdown_state_closed');
            $(this).addClass('boss-check__dropdown-link_state_closed');
          }
        }

        checkDropdownLink.on('click', toggleCheckDropdown);
      });
    }

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
    if (!!mobileIcon) {
      mobileIcon.addEventListener('click', openMobileMenu);
      mobileShadowClose.addEventListener('click', closeMobileMenu);
      mobileClose.addEventListener('click', closeMobileMenu);
    }
}
