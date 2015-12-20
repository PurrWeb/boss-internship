module PageObject
  module FlashHelpers
    def self.included(target)
      target.class_eval do
        page_action :ensure_flash_success_message_displayed do |message|
          expect(find('.alert.alert-success')).to have_text(message)
        end

        page_action :ensure_flash_error_message_displayed do |message|
          expect(find('.alert.alert-danger')).to have_text(message)
        end
      end
    end
  end
end
