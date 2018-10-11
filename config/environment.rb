# Load the Rails application.
require File.expand_path('../application', __FILE__)
# Remove rails forms validation errors wrapper
ActionView::Base.field_error_proc = Proc.new do |html_tag, instance|
  html_tag.html_safe
end
# Initialize the Rails application.
Rails.application.initialize!
