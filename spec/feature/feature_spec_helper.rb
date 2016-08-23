require 'rails_helper'
require 'capybara/rspec'
require 'capybara/poltergeist'
require_all 'spec/feature/support/*.rb'
require_all 'spec/feature/pages/support/*.rb'
require_all 'spec/feature/pages/*.rb'
require_all 'spec/feature/components/*.rb'

Capybara.javascript_driver = :poltergeist

RSpec.configure do |config|
end
