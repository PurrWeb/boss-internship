after ['development:staff_types', 'development:pay_rates'] do
  dev_user_name = Name.create!(
    first_name: 'Dev',
    surname: 'User'
  )

  dev_user_email_address = EmailAddress.create!(
    email: "dev@jsmbars.co.uk"
  )

  dev_user = User.create!(
    name: dev_user_name,
    email_address: dev_user_email_address,
    password: 'dev_password',
    role: DEV_ROLE,
    first: true
  )

  main_venue = Venue.create!(
    name: "Mc Cooleys",
    till_float_cents: 50000,
    safe_float_cents: 30000,
    creator: dev_user
  )

  got_character_name = Faker::Name.name
  first_name = got_character_name.split(' ').first
  surname = got_character_name.split(' ').last
  staff_member_name = Name.create!(
    first_name: first_name,
    surname: surname
  )
  email_address = EmailAddress.create!(email: Faker::Internet.email(first_name))
  StaffMember.create!(
    name: staff_member_name,
    pay_rate: PayRate.first,
    gender: 'male',
    email_address: email_address,
    pin_code: '12345',
    staff_type: StaffType.first,
    creator: dev_user,
    master_venue: main_venue,
    starts_at: 5.months.ago,
    employment_status_a: false,
    employment_status_b: false,
    employment_status_c: false,
    employment_status_d: false,
    employment_status_p45_supplied: false
  )
end
