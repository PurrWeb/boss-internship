require 'rails_helper'

describe GetRootRedirectPath do
  let(:service) { GetRootRedirectPath.new(user: user) }
  let(:service_result) { service.call }

  User::ROLES.each do |role|
    let(:user) { FactoryGirl.create(:user, role: role) }

    it "should return a value for #{role} role" do
      expect(service_result).to be_a(String)
    end
  end
end
