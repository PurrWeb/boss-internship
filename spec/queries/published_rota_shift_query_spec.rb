require 'rails_helper'

describe PublishedRotaShiftQuery do
  let(:staff_member) { FactoryGirl.create(:staff_member)  }
  let(:query) { PublishedRotaShiftQuery.new(staff_member: staff_member) }
  let(:result) { query.all }

  before do
    shift
  end

  context 'shift in published rota' do
    let(:rota) { FactoryGirl.create(:rota, :published)}
    let(:shift) { FactoryGirl.create(:rota_shift, rota: rota, staff_member: staff_member) }

    it 'should be in result' do
      expect(result).to include(shift)
    end
  end

  context 'shift published but disabled' do
    let(:rota) { FactoryGirl.create(:rota, :published)}
    let(:shift) { FactoryGirl.create(:rota_shift, rota: rota, staff_member: staff_member, enabled: false) }

    it 'should not be in result' do
      expect(result).to_not include(shift)
    end
  end

  context 'shift in unpublished rota' do
    let(:rota) { FactoryGirl.create(:rota)}
    let(:shift) { FactoryGirl.create(:rota_shift, rota: rota, staff_member: staff_member) }

    it 'should not be in result' do
      expect(result).to_not include(shift)
    end
  end

  context 'shift published but for other staff member' do
    let(:other_staff_member) { FactoryGirl.create(:staff_member) }
    let(:rota) { FactoryGirl.create(:rota, :published)}
    let(:shift) { FactoryGirl.create(:rota_shift, rota: rota, staff_member: other_staff_member) }

    it 'should not be in result' do
      expect(result).to_not include(shift)
    end
  end
end
