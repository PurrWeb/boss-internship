module PageObject
  class Page
    include ::Capybara::DSL
    include ::RSpec::Matchers

    def initialize(url_helpers:  Rails.application.routes.url_helpers)
      @url_helpers ||= url_helpers
    end

    attr_reader :url_helpers

    def self.surf_to
      self.new.tap do |page|
        page.surf_to
      end
    end

    def self.page_action(name, &block)
      define_method(name) do |*args|
        assert_on_correct_page
        # Force block to behave like a method (execute in the context of the instance)
        self.instance_exec(*args, &block)
      end
    end

    private
    def assert_on_correct_page
      raise 'Page objects must overide default #assert_on_correct_page'
    end
  end
end
