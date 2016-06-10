require 'rails_helper'

describe StaffMemberUpdatesEmail do
  subject { StaffMemberUpdatesEmail.new(staff_member: staff_member, old_master_venue: old_master_venue) }
  let(:old_master_venue) { FactoryGirl.create(:venue) }
  let(:old_address_values) do
    {
      address_1: 'old_address_1',
      address_2: 'old_address_2',
      address_3: 'old_address_3',
      address_4: 'old_address_4',
      region: 'old_region',
      country: 'old_country',
      postcode: 'old_postcode'
    }
  end
  let(:address) do
    FactoryGirl.create(
      :address,
      address_1: old_address_values.fetch(:address_1),
      address_2: old_address_values.fetch(:address_2),
      address_3: old_address_values.fetch(:address_3),
      address_4: old_address_values.fetch(:address_4),
      region:    old_address_values.fetch(:region),
      country:   old_address_values.fetch(:country),
      postcode:  old_address_values.fetch(:postcode)
    )
  end
  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
      master_venue: old_master_venue,
      employment_status_p45_supplied: false,
      employment_status_a: false,
      employment_status_b: false,
      employment_status_c: false,
      employment_status_d: false,
      address: address
    )
  end

  specify do
    expect(subject.data).to include({
      staff_member_name: staff_member.full_name.titlecase,
      staff_member_id: staff_member.id
    })
    expect(subject.send?).to eq(false)
  end

  context 'changing email' do
    let(:new_email) { 'new@email.org' }
    before do
      staff_member.email_address.email = new_email
    end

    it do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(email: new_email)
    end
  end

  context 'changing first name' do
    let(:new_name) { 'New' }
    before do
      staff_member.name.first_name = new_name
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(name: "New #{staff_member.name.surname}")
    end
  end

  context 'changing surname' do
    let(:new_name) { 'New' }
    before do
      staff_member.name.surname = new_name
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(name: "#{staff_member.name.first_name} New")
    end
  end

  context 'changing staff type' do
    let(:new_staff_type) do
      FactoryGirl.create(
        :staff_type,
        name: 'New Staff Type'
      )
    end

    before do
      staff_member.staff_type = new_staff_type
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(staff_type: new_staff_type.name)
    end
  end

  context 'changing pay_rate' do
    let(:new_pay_rate) do
      FactoryGirl.create(
        :pay_rate,
        name: 'New Pay Rate'
      )
    end

    before do
      staff_member.pay_rate = new_pay_rate
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(pay_rate: '£10.00 Per Hour')
    end
  end

  context 'changing employment status a' do
    let(:new_value) { true }

    before do
      staff_member.employment_status_a = new_value
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(
        employment_status_statement: EmploymentStatusStatement.text_for_point(:a)
      )
    end
  end

  context 'changing employment status b' do
    let(:new_value) { true }

    before do
      staff_member.employment_status_b = new_value
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(
        employment_status_statement: EmploymentStatusStatement.text_for_point(:b)
      )
    end
  end

  context 'changing employment status c' do
    let(:new_value) { true }

    before do
      staff_member.employment_status_c = new_value
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(
        employment_status_statement: EmploymentStatusStatement.text_for_point(:c)
      )
    end
  end

  context 'changing employment status d' do
    let(:new_value) { true }

    before do
      staff_member.employment_status_d = new_value
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(
        employment_status_statement: EmploymentStatusStatement.text_for_point(:d)
      )
    end
  end

  context 'changing employment status p45' do
    let(:new_value) { true }

    before do
      staff_member.employment_status_p45_supplied = new_value
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(
        employment_status_statement: EmploymentStatusStatement.text_for_point(:p45_supplied)
      )
    end
  end

  context 'changing address' do
    address_attributes = [
      :address_1,
      :address_2,
      :address_3,
      :address_4,
      :region,
      :country,
      :postcode
    ]

    address_attributes.each do |attribute|
      context "changing #{attribute}" do
        let(:new_value) { 'New Value' }

        before do
          staff_member.address.public_send("#{attribute}=", new_value)
        end

        specify do
          expect(
            subject.data.fetch(:changed_attribute_data)
          ).to include(attribute => new_value)

          (address_attributes - [attribute]).each do |other_attribute|
            expect(
              subject.data.fetch(:changed_attribute_data)
            ).to include(other_attribute => old_address_values.fetch(other_attribute))
          end
        end
      end
    end
  end

  context "changing date_of_birth" do
    let(:new_value) { Date.new(2001, 3, 2) }

    before do
      staff_member.date_of_birth = new_value
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(date_of_birth: new_value.to_s(:human_date))
    end
  end

  context "changing national_insurance_number" do
    let(:new_value) { 'sdaddsa' }

    before do
      staff_member.national_insurance_number = new_value
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(national_insurance_number: new_value)
    end
  end

  context "changing sia_badge_number" do
    let(:new_value) { 'sdaddsa' }

    before do
      staff_member.sia_badge_number = new_value
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(sia_badge_number: new_value)
    end
  end

  context "changing sia_badge_expiry_date" do
    let(:new_value) { Date.new(1983, 2, 3) }

    before do
      staff_member.sia_badge_expiry_date = new_value
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(sia_badge_expiry_date: new_value.to_s(:human_date))
    end
  end

  context "changing master venue" do
    let(:new_master_venue) { FactoryGirl.create(:venue, name: 'New master venue') }
    before do
      staff_member.master_venue = new_master_venue
    end

    specify do
      expect(
        subject.data.fetch(:changed_attribute_data)
      ).to include(master_venue: new_master_venue.name)
    end
  end
end
