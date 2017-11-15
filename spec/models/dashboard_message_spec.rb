require 'rails_helper'

RSpec.describe DashboardMessage, type: :model do
  it { is_expected.to belong_to :created_by_user }
  it { is_expected.to belong_to :disabled_by_user }
  it { is_expected.to have_and_belong_to_many :venues }

  it { validate_presence_of :title }
  it { validate_presence_of :message }
end
