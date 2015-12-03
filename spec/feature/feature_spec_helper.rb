require 'rails_helper'
require 'capybara/rspec'
require_all 'spec/feature/support/*.rb'
require_all 'spec/feature/pages/*.rb'
require_all 'spec/feature/components/*.rb'

RSpec.configure do |config|
  config.include Warden::Test::Helpers

  config.before :suite do
    Warden.test_mode!
  end

  config.after :each do
    Warden.test_reset!
  end
end
