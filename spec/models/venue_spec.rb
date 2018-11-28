require 'rails_helper'

RSpec.describe Venue, type: :model do
  it { should have_and_belong_to_many :questionnaires }
  it { should belong_to(:creator) }
  it { should have_many(:rotas) }
  it { should have_many(:staff_member_venues) }
  it { should have_many(:master_staff_members) }
  it { should have_many(:other_staff_members) }
  it { should have_many(:maintenance_tasks) }
  it { should have_and_belong_to_many :dashboard_messages }

  it { should validate_numericality_of(:safe_float_cents).is_greater_than_or_equal_to(0) }
  it { should validate_numericality_of(:till_float_cents).is_greater_than_or_equal_to(0) }
  it { validate_presence_of :name }
  it { validate_uniqueness_of :name }
  it { validate_presence_of :creator }
end
