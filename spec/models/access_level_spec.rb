require 'rails_helper'

describe AccessLevel do
  describe "self#for_user_role" do
    User::ROLES.each do |role|
      it 'should return an access level' do
        expect(AccessLevel.for_user_role(role)).to be_an(AccessLevel)
      end
    end
  end

  describe '#value' do
    AccessLevel::LEVEL_DATA.keys.each do |access_level_identifier|
      context "role: #{access_level_identifier}" do
        specify 'should have an integer value' do
          expect(AccessLevel.new(access_level_identifier).value).to be_a(Fixnum)
        end
      end
    end
  end

  describe '#is_effectively?' do
    context 'when suppling an access level object' do
      AccessLevel::LEVEL_DATA.keys.each do |access_level_identifier|
        context "access level: #{access_level_identifier}" do
          let(:access_level) { AccessLevel.new(access_level_identifier) }
          let(:access_level_value) { access_level.value }
          context "role: #{access_level_identifier}" do
            let(:lesser_access_level_indentifiers) do
              AccessLevel::LEVEL_DATA.keys.select do |filter_level_identifier|
                AccessLevel.new(filter_level_identifier).value < access_level_value
              end
            end
            let(:greater_access_levels_identifiers) do
              AccessLevel::LEVEL_DATA.keys.select do |filter_level_identifier|
                AccessLevel.new(filter_level_identifier).value > access_level_value
              end
            end

            specify 'should be true for self' do
              expect(access_level.is_effectively?(access_level)).to eq(true)
            end

            specify 'should be false for greater levels' do
              greater_access_levels_identifiers.each do |greater_level_identifier|
                target_level = AccessLevel.new(greater_level_identifier)
                expect(access_level.is_effectively?(target_level)).to eq(false)
              end
            end

            specify 'should be true for lesser levels' do
              lesser_access_level_indentifiers.each do |lesser_level_identifier|
                target_level = AccessLevel.new(lesser_level_identifier)
                expect(access_level.is_effectively?(target_level)).to eq(true)
              end
            end
          end
        end
      end
    end
  end
end
