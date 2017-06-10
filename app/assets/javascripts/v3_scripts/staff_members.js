$(function() {
  var mobileIcon = document.querySelector('.boss-main-menu__navicon');
  var mobileShadowClose = document.querySelector('.boss-mobile-menu__closearea');
  var mobileMenu = document.querySelector('.boss-mobile-menu');
  var mobileMenuSide = document.querySelector('.boss-mobile-menu__side');
  var mobileClose = document.querySelector('.boss-mobile-menu__close');
  var dropIcon = document.querySelector('.boss-mobile-menu__button_dropdown i');
  var drop;

  dropIcon.addEventListener('click', function () {
      drop = this.nextElementSibling;
      drop.classList.toggle('boss-mobile-menu__dropdown_state_active');

      if (drop.classList.contains('boss-mobile-menu__dropdown_state_active')) {
          this.style.backgroundColor = '#ededed';
      } else {
          this.style.backgroundColor = 'transparent';
      }
  });

  function openMobileMenu() {
      document.body.style.overflow = 'hidden';
      mobileMenu.classList.add('boss-mobile-menu_state_active');
      mobileMenuSide.classList.add('boss-mobile-menu__side_state_active');
  }

  function closeMobileMenu() {
      document.body.style.overflow = 'visible';
      mobileMenu.classList.remove('boss-mobile-menu_state_active');
      mobileMenuSide.classList.remove('boss-mobile-menu__side_state_active');
  }

  mobileIcon.addEventListener('click', openMobileMenu);
  mobileShadowClose.addEventListener('click', closeMobileMenu);
  mobileClose.addEventListener('click', closeMobileMenu);


  // Filter toggle demo js
  var filter = $('.boss-dropdown');

  filter.each(function(){
      var filterSwitch = $(this).find('.boss-dropdown__switch'),
          filterContent = $(this).find('.boss-dropdown__content'),
          pageContent = $('.boss-page-main__content');

      function toggleFilter(e) {
          e.preventDefault();
          filterSwitch.toggleClass('boss-dropdown__switch_state_opened');
          filterContent.slideToggle().end().toggleClass('boss-dropdown__content_state_opened');
          pageContent.toggleClass('boss-page-main__content_state_inactive');
      }

      filterSwitch.on('click', toggleFilter);
  });

  // React select demo interaction. For the demo purposes only
  $(function(){
    $('.Select').css('overflow','hidden')
    $('.Select-control').on('click', function(e){
      e.stopPropagation();

      var select = $(this).closest('.Select');

      $('.Select').not(select).removeClass('is-focused is-open').css('overflow','hidden');

      if (select.hasClass('is-open')){
        select.removeClass('is-focused is-open').css('overflow','hidden');
      } else {
        select.addClass('is-focused is-open').css('overflow','visible');
      }
    });

    $('.Select-option').on('mouseover', function() {
      if (!$(this).hasClass('selected-option')) {
        $(this).addClass('is-focused');
      }
    });

    $('.Select-option').on('mouseout', function() {
      if (!$(this).hasClass('selected-option')) {
        $(this).removeClass('is-focused');
      }
    });

    $('.Select-option').on('click', function() {
      $(this).closest('.Select-menu').find('.Select-option').removeClass('is-focused').removeClass('selected-option');
      $(this).addClass('is-focused').addClass('selected-option');

      $('.Select').removeClass('is-focused is-open').css('overflow','hidden');
      $(this).closest('.boss-form__field').find('.Select-placeholder').html($(this).html());

      $(this).closest('.Select-menu').find('option').removeAttr('selected');
      $(this).closest('.Select-menu').find('option[value=' + $(this).attr('data-value-id') + ']').attr('selected', 'selected');
    });

    $("html").on("click", function(e) {
      $(".Select").removeClass("is-focused is-open").css("overflow","hidden");
    });
  });
});
