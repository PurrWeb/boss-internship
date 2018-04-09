import jQuery from 'jquery';
import bouncedEmailModal from '~/components/bounced-email-modal';

(function ($) {
  $(function() {
    $('[bounced-email]').on('click', function () {
      var $this = $(this);

      var bouncedData = {
        email: $this.data('bounced-email'),
        error_code: $this.data('bounced-error-code'),
        reason: $this.data('bounced-reason'),
        bounced_at: $this.data('bounced-at'),
        updated_at: $this.data('bounced-updated-at'),
      }
  
      bouncedEmailModal(bouncedData)
    });
  })
})(jQuery);
