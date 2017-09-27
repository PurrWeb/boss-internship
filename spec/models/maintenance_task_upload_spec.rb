require 'rails_helper'

RSpec.describe MaintenanceTaskImage, type: :model do
  it { is_expected.to belong_to :maintenance_task }
end
