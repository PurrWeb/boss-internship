class PageComponent
  include ::Capybara::DSL
  include ::RSpec::Matchers

  def initialize(parent)
    @parent = parent
  end

  attr_reader :parent

  def self.page_action(name, &block)
    define_method(name) do |*args|
      parent.assert_on_correct_page

      # Force block to behave like a method (execute in the context of the instance)
      self.instance_exec(*args, &block)
    end
  end

  def url_helpers
    parent.url_helpers
  end

  private
  def assert_on_correct_page
    parent.assert_on_correct_page
  end
end
