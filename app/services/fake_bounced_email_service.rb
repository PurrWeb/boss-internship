class FakeBouncedEmailService

  def self.call
    venue = Venue.first
    fake_bounced_email = {
      reason: "550 5.5.0 Requested action not taken: mailbox unavailable. [HE1EUR02FT030.eop-EUR02.prod.protection.outlook.com] ",
      bounced_at: "2017-11-05T23:18:19+00:00",
      error_code: "5.5.0"
    }
    
    staff_members_emails = StaffMember.where(master_venue: venue)
      .joins(:email_address)
      .where.not(email_addresses: {email: nil})
      .enabled
      .order(updated_at: :desc)
      .limit(10)
      .pluck(:email)
    users_emails = User.where(staff_member: nil)
      .joins(:email_address)
      .where.not(email_addresses: {email: nil})
      .enabled
      .limit(10)
      .pluck(:email)

    emails = staff_members_emails + users_emails

    normalised_bounce_data = []
    emails.each do |email|
      normalised_bounce_data << fake_bounced_email.merge(email: email)
    end
    normalised_bounce_data
  end
end
