class AnonymiseDatabase
  def call
    ActiveRecord::Base.transaction do
      processed_user_ids = []

      puts "Anonymising Addresses"
      Address.find_each do |address|
        address.update_attributes!(
          address: FactoryHelper::Address.street_address,
          county: FactoryHelper::Address.state,
          country: FactoryHelper::Address.country,
          postcode: FactoryHelper::Address.postcode
        )
      end

      puts "Anonymising Staff Members"
      StaffMember.find_each do |staff_member|
        male = Random.rand(2) == 1

        update_name_and_email(male: male, record: staff_member)

        new_gender = male ? StaffMember::MALE_GENDER : StaffMember::FEMALE_GENDER

        new_phone_number = FactoryHelper::PhoneNumber.phone_number

        new_national_insurance_number = generate_fake_ni_number

        new_pin_code = generate_new_pin_code

        new_sia_badge_number = staff_member.sia_badge_number.present? && generate_new_sia_badge_number

        staff_member.update_attributes!(
          gender: new_gender,
          phone_number: new_phone_number,
          national_insurance_number: new_national_insurance_number,
          pin_code: new_pin_code,
          sia_badge_number: new_sia_badge_number
        )

        if staff_member.user.present?
          user = staff_member.user
          user.name = staff_member.name
          user.email_address = staff_member.email_address
          user.save!

          processed_user_ids << user.id
        end
      end

      puts "Anonymising Venues"
      used_venue_names = []
      Venue.find_each do |venue|
        success = false

        while !success do
          new_venue_name = FactoryHelper::Commerce.color.titlecase

          if !used_venue_names.include?(new_venue_name)
            used_venue_names << new_venue_name
            venue.update_attributes!(name: new_venue_name)
            success = true
          end
        end
      end

      puts "Anonymising Users"
      User.find_each do |user|
        next if processed_user_ids.include?(user.id)

        update_name_and_email(record: user)

        new_password = Faker::Lorem.characters(10)

        user.update_attributes!(
          password: new_password
        )
      end

      puts "Anonymising API Keys"
      ApiKey.find_each do |api_key|
        api_key.update_attribute(:key, SecureRandom.hex)
      end

      puts "Anonymising Access Tokens"
      AccessToken.find_each do |access_token|
        access_token.update_attributes!(
          token: SecureRandom.hex
        )
      end

      puts "Anonymising Invites"
      Invite.find_each do |invite|
        new_email = invite.user.present? ? invite.user.email : FactoryHelper::Internet.free_email

        invite.update_attributes!(
          email: new_email,
          token: SecureRandom.hex
        )
      end

      puts "Setting up Dev User"
      dev_user = User.enabled.dev.first
      raise 'Dev user not found' unless dev_user.present?

      dev_user_first_name = 'Dev'
      dev_user_surname = 'User'
      dev_user_email = 'dev@jsmbars.co.uk'
      dev_user_password = 'dev_password'

      dev_user.name.update_attributes!(
        first_name: dev_user_first_name,
        surname: dev_user_surname
      )

      dev_user.email_address.update_attributes!(
        email: dev_user_email
      )

      dev_user.update_attributes!(password: dev_user_password)

      puts 'Creating dev staff member'
      dev_staff_member = dev_user.staff_member
      dev_staff_member_master_venue = Venue.first

      dev_staff_member_params = {
        name: dev_user.name,
        email_address: dev_user.email_address,
        gender: StaffMember::MALE_GENDER,
        pin_code: '12345',
        creator: dev_user,
        staff_type: StaffType.manager.first,
        starts_at: 4.years.ago,
        employment_status_a: true,
        employment_status_b: true,
        employment_status_c: true,
        employment_status_d: true,
        employment_status_p45_supplied: true,
        master_venue: dev_staff_member_master_venue,
        staff_member_venues: [],
        pay_rate: PayRate.weekly.first
      }

      if dev_staff_member.present?
        dev_staff_member.update_attributes!(dev_staff_member_params)
      else
        result = CreateStaffMemberFromUser.new(user: dev_user, params: dev_staff_member_params).call
        raise "Dev User Staff member creation failed #{result.staff_member.errors.to_a}" unless result.success?

        dev_staff_member = result.staff_member
      end
    end
  end

  private
  def select_random(range)
    (range).to_a[rand(range.count)]
  end

  def generate_new_pin_code
    5.times.map { select_random('0'..'9') }.join('')
  end

  def generate_new_sia_badge_number
    7.times.map { select_random('0'..'9') }.join('')
  end

  def generate_fake_ni_number
    values = []
    2.times do
      values << select_random('A'..'Z')
    end
    6.times do
      values << select_random('0'..'9')
    end
    values << select_random('A'..'D')
    values.join('')
  end

  def update_name_and_email(male: Random.rand(2) == 1, record:)
    name = record.name
    email_address = record.email_address

    new_first_name = male ?
      FactoryHelper::Name.male_first_name :
      FactoryHelper::Name.female_first_name

    new_surname = FactoryHelper::Name.last_name

    name.update_attributes!(
      first_name: new_first_name,
      surname: new_surname
    )

    new_email = FactoryHelper::Internet.free_email(name.full_name)

    if email_address.present?
      email_address.update_attributes!(email: new_email)
    end
  end
end
