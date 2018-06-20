require_relative '../support/test_image_helper'

FactoryGirl.define do
  factory :mobile_app do
    name 'test_name'
    ios_download_url 'https://test-ios-url.fake.com'
    google_play_url 'https://test-android-url.fake.com'

    trait :security_app do
      name MobileApp::SECURITY_APP_NAME
    end
  end
end
