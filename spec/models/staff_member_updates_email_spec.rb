require 'rails_helper'

describe StaffMemberUpdatesEmail do
  subject { StaffMemberUpdatesEmail.new(staff_member: staff_member, old_master_venue: old_master_venue) }
  let(:old_master_venue) { FactoryGirl.create(:venue) }
  let(:old_address_values) do
    {
      address: 'old_address_text',
      county: 'old_county',
      country: 'old_country',
      postcode: 'old_postcode'
    }
  end
  let(:address) do
    FactoryGirl.create(
      :address,
      address: old_address_values.fetch(:address),
      county:    old_address_values.fetch(:county),
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
    let(:old_email) { staff_member.email_address.email }
    let(:new_email) { 'new@email.org' }
    before do
      old_email
      staff_member.email_address = EmailAddress.new(email: new_email)
    end

    it 'should list email as changed' do
      expect(
        subject.data.fetch(:changed_attributes)
      ).to include(:email_address)
    end

    it 'should list correct old email' do
      expect(
        subject.data.fetch(:old_values).fetch(:email_address)
      ).to eq(old_email)
    end

    it 'should list correct new email' do
      expect(
        subject.data.fetch(:new_values).fetch(:email_address)
      ).to eq(new_email)
    end
  end

  context 'changing first name' do
    let(:old_name) { staff_member.full_name }
    let(:new_first_name) { 'New' }
    let(:new_surname) { 'Name' }
    before do
      old_name
      staff_member.name.assign_attributes(
        first_name: new_first_name,
        surname: new_surname
      )
    end

    it 'should list name with changed attributes' do
      expect(
        subject.data.fetch(:changed_attributes)
      ).to include(:name)
    end

    it 'should list correct old value' do
      expect(
        subject.data.fetch(:old_values).fetch(:name)
      ).to eq(old_name)
    end

    it 'should list correct new value' do
      expect(
        subject.data.fetch(:new_values).fetch(:name)
      ).to eq(staff_member.full_name)
    end
  end

  context 'changing staff type' do
    let(:old_staff_type) do
      staff_member.staff_type
    end
    let(:new_staff_type) do
      FactoryGirl.create(
        :staff_type,
        name: 'New Staff Type'
      )
    end

    before do
      old_staff_type
      staff_member.staff_type = new_staff_type
    end

    it 'should list staff types as changed' do
      expect(
        subject.data.fetch(:changed_attributes)
      ).to include(:staff_type_id)
    end

    it 'should list old staff type as changed' do
      expect(
        subject.data.fetch(:old_values).fetch(:staff_type_id)
      ).to eq(old_staff_type.name)
    end

    it 'should list new staff type as changed' do
      expect(
        subject.data.fetch(:new_values).fetch(:staff_type_id)
      ).to eq(new_staff_type.name)
    end
  end

  context 'changing pay_rate' do
    let(:old_pay_rate) { staff_member.pay_rate }
    let(:new_pay_rate) do
      FactoryGirl.create(
        :pay_rate,
        name: 'New Pay Rate',
        cents: 500
      )
    end

    before do
      old_pay_rate
      staff_member.pay_rate = new_pay_rate
    end

    it 'it should list pay_rate as changed attributes' do
      expect(
        subject.data.fetch(:changed_attributes)
      ).to include(:pay_rate_id)
    end

    it 'should list correct old value' do
      expect(
        subject.data.fetch(:old_values).fetch(:pay_rate_id)
      ).to eq(old_pay_rate.text_description)
    end

    it 'should list correct new value' do
      expect(
        subject.data.fetch(:new_values).fetch(:pay_rate_id)
      ).to eq(new_pay_rate.text_description)
    end
  end

  [:a, :b, :c, :d, :p45_supplied].each do |field|
    context "changing employment status #{field}" do
      let(:new_value) { true }

      before do
        staff_member.public_send("employment_status_#{field}=", new_value)
      end

      it 'should report employment_status_statement change' do
        expect(
          subject.data.fetch(:changed_attributes)
        ).to include(:employment_status_statement)
      end

      it 'should display correct old value' do
        expect(
          subject.data.fetch(:old_values).fetch(:employment_status_statement)
        ).to eq("")
      end

      it 'should display correct new value' do
        expect(
          subject.data.fetch(:new_values).fetch(:employment_status_statement)
        ).to eq(EmploymentStatusStatement.text_for_point(field))
      end
    end
  end

  context 'changing address' do
    address_attributes = [
      :address,
      :county,
      :country,
      :postcode
    ]
    new_value = 'new value'



    address_attributes.each do |attribute|
      context "changing #{attribute}" do
        let(:new_address) do
          new_address_values = {}
          new_address_values[attribute] = new_value
          (address_attributes - [attribute]).each do |other_attribute|
            new_address_values[other_attribute] = old_address_values.fetch(other_attribute)
          end
          Address.create!(new_address_values)
        end

        before do
          staff_member.address = new_address
        end

        it 'should report all address values changing' do
          address_attributes.each do |address_attribute|
            expect(
              subject.data.fetch(:changed_attributes)
            ).to include(address_attribute)
          end
        end

        it 'should report old values correctly' do
          address_attributes.each do |other_attribute|
            expect(
              subject.data.fetch(:old_values).fetch(other_attribute)
            ).to eq(old_address_values.fetch(other_attribute))
          end
        end

        it 'should report new values correctly' do
          expect(
            subject.data.fetch(:new_values).fetch(attribute)
          ).to eq(new_value)

          (address_attributes - [attribute]).each do |other_attribute|
            expect(
              subject.data.fetch(:new_values).fetch(other_attribute)
            ).to eq(old_address_values.fetch(other_attribute))
          end
        end
      end
    end
  end

  context "changing date_of_birth" do
    let(:old_value) { staff_member.date_of_birth }
    let(:new_value) { Date.new(2001, 3, 2) }

    before do
      old_value
      staff_member.date_of_birth = new_value
    end

    it 'should list date of birth with changes' do
      expect(
        subject.data.fetch(:changed_attributes)
      ).to include(:date_of_birth)
    end

    it 'should report correct new value' do
      expect(
        subject.data.fetch(:new_values).fetch(:date_of_birth)
      ).to eq(new_value.to_s(:human_date))
    end

    it 'should report correct old value' do
      expect(
        subject.data.fetch(:old_values).fetch(:date_of_birth)
      ).to eq(old_value.to_s(:human_date))
    end
  end

  context "changing national_insurance_number" do
    let(:old_value) { staff_member.national_insurance_number }
    let(:new_value) { 'sdaddsa' }

    before do
      old_value
      staff_member.national_insurance_number = new_value
    end

    it 'should list ni number as changed attribute' do
      expect(
        subject.data.fetch(:changed_attributes)
      ).to include(:national_insurance_number)
    end

    it 'should supply correct new value' do
      expect(
        subject.data.fetch(:new_values).fetch(:national_insurance_number)
      ).to eq(new_value)
    end

    it 'should supply correct old value' do
      expect(
        subject.data.fetch(:old_values).fetch(:national_insurance_number)
      ).to eq(old_value)
    end
  end

  context "changing sia_badge_number" do
    let(:old_value) { staff_member.sia_badge_number }
    let(:new_value) { 'sdaddsa' }

    before do
      old_value
      staff_member.sia_badge_number = new_value
    end

    it 'should list badge number as changed attribute' do
      expect(
        subject.data.fetch(:changed_attributes)
      ).to include(:sia_badge_number)
    end

    it 'should supply correct new value' do
      expect(
        subject.data.fetch(:new_values).fetch(:sia_badge_number)
      ).to eq(new_value)
    end

    it 'should supply correct old value' do
      expect(
        subject.data.fetch(:old_values).fetch(:sia_badge_number)
      ).to eq('Not Specified')
    end
  end

  context "changing sia_badge_expiry_date" do
    let(:old_value) { staff_member.sia_badge_expiry_date }
    let(:new_value) { Date.new(1983, 2, 3) }

    before do
      old_value
      staff_member.sia_badge_expiry_date = new_value
    end

    it 'should list badge expiry date as changed attribute' do
      expect(
        subject.data.fetch(:changed_attributes)
      ).to include(:sia_badge_expiry_date)
    end

    it 'should supply correct new value' do
      expect(
        subject.data.fetch(:new_values).fetch(:sia_badge_expiry_date)
      ).to eq(new_value.to_s(:human_date))
    end

    it 'should supply correct old value' do
      expect(
        subject.data.fetch(:old_values).fetch(:sia_badge_expiry_date)
      ).to eq('Not Specified')
    end
  end

  context "changing master venue" do
    let(:new_master_venue) { FactoryGirl.create(:venue, name: 'New master venue') }
    before do
      staff_member.master_venue = new_master_venue
    end

    it 'should list master venue as changed attribute' do
      expect(
        subject.data.fetch(:changed_attributes)
      ).to include(:master_venue)
    end

    it 'should supply correct new value' do
      expect(
        subject.data.fetch(:new_values).fetch(:master_venue)
      ).to eq(new_master_venue.name)
    end

    it 'should supply correct old value' do
      expect(
        subject.data.fetch(:old_values).fetch(:master_venue)
      ).to eq(old_master_venue.name)
    end
  end
end
