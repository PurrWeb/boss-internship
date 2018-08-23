class AnonymiseDatabase
  def call
    ActiveRecord::Base.transaction do
      processed_user_ids = []
      existing_names = []

      bounced_emails_list = [
        "bounced1@jsmbars.co.uk",
        "bounced2@jsmbars.co.uk",
        "bounced3@jsmbars.co.uk",
        "bounced4@jsmbars.co.uk",
        "bounced5@jsmbars.co.uk",
        "bounced6@jsmbars.co.uk"
      ]

      bounced_emails_data = bounced_emails_list.map do |email|
        {
          email: email,
          reason: "550 5.5.0 Requested action not taken: mailbox unavailable. [HE1EUR02FT030.eop-EUR02.prod.protection.outlook.com] ",
          bounced_at: "2017-11-05T23:18:19+00:00",
          error_code: "5.5.0",
          updated_at: Time.new
        }
      end

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

        update_name_and_email(male: male, record: staff_member, existing_names: existing_names)

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
          new_site_id = FactoryHelper::Code.isbn

          if !used_venue_names.include?(new_venue_name)
            used_venue_names << new_venue_name
            venue.update_attributes!(
              name: new_venue_name,
              change_order_site_id: new_site_id
            )
            success = true
          end
        end
      end

      puts "Anonymising Users"
      User.find_each do |user|
        next if processed_user_ids.include?(user.id)

        update_name_and_email(record: user, existing_names: existing_names)

        new_password = Faker::Lorem.characters(10)

        user.update_attributes!(
          password: new_password
        )
      end

      puts "Anonymising API Keys"
      ApiKey.find_each do |api_key|
        api_key.update_attribute(:key, SecureRandom.hex)
      end

      puts "Anonymising Invites"
      Invite.find_each do |invite|
        new_email = FactoryHelper::Internet.free_email(FactoryHelper::Internet.password)

        invite.update_attributes!(
          email: new_email,
          token: SecureRandom.hex
        )
      end

      puts "Setting up Users"
      manager_staff_type = StaffType.manager.first
      non_manager_staff_type = StaffType.pr.first
      main_venue = Venue.first
      other_venue = Venue.last

      bounced_emails_user_data = [
        {
          first_name: 'Bounced 4',
          surname: 'Manager',
          email: bounced_emails_list[3],
          password: 'manager_password',
          staff_type: manager_staff_type,
          role: User::MANAGER_ROLE,
          venues: [main_venue]
        },
        {
          first_name: 'Bounced 5',
          surname: 'Manager',
          email: bounced_emails_list[4],
          password: 'manager_password',
          staff_type: manager_staff_type,
          role: User::MANAGER_ROLE,
          venues: [main_venue]
        },
        {
          first_name: 'Bounced 6',
          surname: 'Manager',
          email: bounced_emails_list[5],
          password: 'manager_password',
          staff_type: manager_staff_type,
          role: User::MANAGER_ROLE,
          venues: [main_venue]
        },
      ]

      user_data = [
        {
          first_name: 'Dev',
          surname: 'User',
          email: 'dev@jsmbars.co.uk',
          password: 'dev_password',
          staff_type: manager_staff_type,
          role: User::DEV_ROLE,
          venues: [main_venue],
        },
        {
          first_name: 'An',
          surname: 'Admin',
          email: 'admin@jsmbars.co.uk',
          password: 'admin_password',
          staff_type: manager_staff_type,
          role: User::ADMIN_ROLE,
          venues: [main_venue]
        },
        {
          first_name: 'A',
          surname: 'Manager',
          email: 'manager@jsmbars.co.uk',
          password: 'manager_password',
          staff_type: manager_staff_type,
          role: User::MANAGER_ROLE,
          venues: [main_venue]
        },
        {
          first_name: 'Ops',
          surname: 'Manager',
          email: 'ops_manager@jsmbars.co.uk',
          password: 'ops_manager_password',
          staff_type: manager_staff_type,
          role: User::OPS_MANAGER_ROLE,
          venues: [main_venue]
        },
        {
          first_name: 'Other',
          surname: 'Manager',
          email: 'other_manager@jsmbars.co.uk',
          password: 'other_manager_password',
          staff_type: manager_staff_type,
          role: User::MANAGER_ROLE,
          venues: [other_venue]
        }
      ] + bounced_emails_user_data

      user_data.each_with_index do |user_datum, index|
        user = User.new(
          role: user_datum.fetch(:role),
          invite: Invite.first
        )

        name = Name.create!(
          first_name: user_datum.fetch(:first_name),
          surname: user_datum.fetch(:surname)
        )
        user.name = name

        email_address = EmailAddress.create!(
          email: user_datum.fetch(:email)
        )
        user.email_address = email_address

        user.update_attributes!(password: user_datum.fetch(:password))
        #Assigning again because user must have id to create join
        user.update_attributes!(venues: user_datum.fetch(:venues))

        puts "Creating staff member with email #{user_datum.fetch(:email)}"
        staff_member = user.staff_member

        staff_member_params = {
          name: user.name,
          email_address: user.email_address,
          gender: StaffMember::MALE_GENDER,
          pin_code: '12345',
          creator: user,
          staff_type: user_datum.fetch(:staff_type),
          starts_at: 4.years.ago,
          employment_status_a: true,
          employment_status_b: true,
          employment_status_c: true,
          employment_status_d: true,
          employment_status_p45_supplied: true,
          master_venue: user.venues.first,
          staff_member_venues: [],
          pay_rate: PayRate.named.first
        }

        if staff_member.present?
          staff_member.update_attributes!(staff_member_params)
        else
          result = CreateStaffMemberFromUser.new(requester: user, user: user, params: staff_member_params).call
          raise "Staff member creation failed #{result.staff_member.errors.to_a}" unless result.success?

          staff_member = result.staff_member
        end
      end

      puts "Setting up Staff Members"
      staff_member_bounced_email_data = [
        {
          first_name: 'Bounced Email1',
          surname: 'StaffMember',
          email: bounced_emails_list[0],
          master_venue: main_venue
        },
        {
          first_name: 'Bounced Email2',
          surname: 'StaffMember',
          email: bounced_emails_list[1],
          master_venue: main_venue
        },
        {
          first_name: 'Bounced Email3',
          surname: 'StaffMember',
          email: bounced_emails_list[2],
          master_venue: main_venue
        },
      ]
      staff_member_data = [
        {
          first_name: 'Venue',
          surname: 'StaffMember',
          email: 'venue_staff_member@jsmbars.co.uk',
          master_venue: main_venue
        },
        {
          first_name: 'NonVenue',
          surname: 'StaffMember',
          email: 'non_venue_staff_member@jsmbars.co.uk',
          master_venue: Venue.last
        },
      ] + staff_member_bounced_email_data

      staff_member_data.each do |staff_member_datum|
        staff_member_name = Name.create!(
          first_name: staff_member_datum.fetch(:first_name),
          surname: staff_member_datum.fetch(:surname)
        )

        staff_member_email_address = EmailAddress.create!(
          email: staff_member_datum.fetch(:email)
        )

        StaffMember.create!(
          name: staff_member_name,
          email_address: staff_member_email_address,
          gender: StaffMember::MALE_GENDER,
          pin_code: '12345',
          creator: User.first,
          staff_type: non_manager_staff_type,
          starts_at: 4.years.ago,
          employment_status_a: true,
          employment_status_b: true,
          employment_status_c: true,
          employment_status_d: true,
          employment_status_p45_supplied: true,
          master_venue: staff_member_datum.fetch(:master_venue),
          staff_member_venues: [],
          pay_rate: PayRate.named.first
        )
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

  def update_name_and_email(male: Random.rand(2) == 1, existing_names:, record:)
    name = record.name
    email_address = record.email_address

      new_first_name = male ?
        FactoryHelper::Name.male_first_name :
        FactoryHelper::Name.female_first_name

    unique_name_found = false
    index = 1
    while !unique_name_found do
      new_surname = FactoryHelper::Name.last_name + "#{index > 1 ? index : ''}"
      unique_name_found = existing_names.include?([new_first_name, new_surname].join(' '))
    end

    name.update_attributes!(
      first_name: new_first_name,
      surname: new_surname
    )

    new_email = FactoryHelper::Internet.free_email(name.full_name)

    if email_address.present?
      email_address.update_attributes!(email: new_email)
    end

    existing_names << [new_first_name, new_surname].join(' ')
  end
end
