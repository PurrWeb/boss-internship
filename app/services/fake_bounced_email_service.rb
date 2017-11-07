class FakeBouncedEmailService

  def self.call
    venue = Venue.first
    fake_bounced_emails_data = [
      {:email=>"",
        :reason=>"550 5.5.0 Requested action not taken: mailbox unavailable. [HE1EUR02FT030.eop-EUR02.prod.protection.outlook.com] ",
        :bounced_at=>"2017-11-05T23:18:19+00:00",
        :error_code=>"5.5.0"},
      {:email=>"",
        :reason=>"550 5.5.0 Requested action not taken: mailbox unavailable. [VE1EUR03FT010.eop-EUR03.prod.protection.outlook.com] ",
        :bounced_at=>"2017-11-05T18:00:53+00:00",
        :error_code=>"5.5.0"},
      {:email=>"",
        :reason=>
        "550 5.1.1 The email account that you tried to reach does not exist. Please try double-checking the recipient's email address for typos or unnecessary spaces. Learn more at  https://support.google.com/mail/?p=NoSuchUser c141si236340qke.19 - gsmtp ",
        :bounced_at=>"2017-11-05T15:43:20+00:00",
        :error_code=>"5.1.1"},
      {:email=>"",
        :reason=>"550 5.5.0 Requested action not taken: mailbox unavailable. [VE1EUR01FT015.eop-EUR01.prod.protection.outlook.com] ",
        :bounced_at=>"2017-11-04T20:33:12+00:00",
        :error_code=>"5.5.0"},
      {:email=>"",
        :reason=>
        "550 5.1.1 The email account that you tried to reach does not exist. Please try double-checking the recipient's email address for typos or unnecessary spaces. Learn more at  https://support.google.com/mail/?p=NoSuchUser 45si3739766qtr.283 - gsmtp ",
        :bounced_at=>"2017-11-03T09:22:47+00:00",
        :error_code=>"5.1.1"},
      {:email=>"",
        :reason=>
        "550 5.1.1 The email account that you tried to reach does not exist. Please try double-checking the recipient's email address for typos or unnecessary spaces. Learn more at  https://support.google.com/mail/?p=NoSuchUser w134si164934qkw.38 - gsmtp ",
        :bounced_at=>"2017-10-30T19:30:14+00:00",
        :error_code=>"5.1.1"},
      {:email=>"",
        :reason=>
        "550 5.1.1 The email account that you tried to reach does not exist. Please try double-checking the recipient's email address for typos or unnecessary spaces. Learn more at  https://support.google.com/mail/?p=NoSuchUser 21si4217096qki.156 - gsmtp ",
        :bounced_at=>"2017-10-30T15:13:43+00:00",
        :error_code=>"5.1.1"},
      {:email=>"",
        :reason=>"550 5.5.0 Requested action not taken: mailbox unavailable. [DB5EUR03FT039.eop-EUR03.prod.protection.outlook.com] ",
        :bounced_at=>"2017-10-30T10:12:03+00:00",
        :error_code=>"5.5.0"},
      {:email=>"",
        :reason=>
        "550 5.1.1 The email account that you tried to reach does not exist. Please try double-checking the recipient's email address for typos or unnecessary spaces. Learn more at  https://support.google.com/mail/?p=NoSuchUser r27si4400892qtc.76 - gsmtp ",
        :bounced_at=>"2017-10-30T02:01:28+00:00",
        :error_code=>"5.1.1"},
      {:email=>"",
        :reason=>"550 5.5.0 Requested action not taken: mailbox unavailable. [VE1EUR03FT006.eop-EUR03.prod.protection.outlook.com] ",
        :bounced_at=>"2017-10-30T02:00:58+00:00",
        :error_code=>"5.5.0"},
      {:email=>"",
        :reason=>"550 5.5.0 Requested action not taken: mailbox unavailable. [DB5EUR01FT029.eop-EUR01.prod.protection.outlook.com] ",
        :bounced_at=>"2017-10-30T01:59:14+00:00",
        :error_code=>"5.5.0"},
      {:email=>"",
        :reason=>
        "550 5.1.1 The email account that you tried to reach does not exist. Please try double-checking the recipient's email address for typos or unnecessary spaces. Learn more at  https://support.google.com/mail/?p=NoSuchUser n26si541982qtf.239 - gsmtp ",
        :bounced_at=>"2017-10-30T01:56:43+00:00",
        :error_code=>"5.1.1"},
      {:email=>"",
        :reason=>"550 5.5.0 Requested action not taken: mailbox unavailable. [AM5EUR02FT040.eop-EUR02.prod.protection.outlook.com] ",
        :bounced_at=>"2017-10-22T22:34:09+00:00",
        :error_code=>"5.5.0"},
      {:email=>"",
        :reason=>"550 5.5.0 Requested action not taken: mailbox unavailable. [AM5EUR02FT056.eop-EUR02.prod.protection.outlook.com] ",
        :bounced_at=>"2017-10-22T21:12:45+00:00",
        :error_code=>"5.5.0"},
      {:email=>"",
        :reason=>"550 5.7.66 Requested action not taken: mailbox unavailable [VE1EUR02FT004.eop-EUR02.prod.protection.outlook.com] ",
        :bounced_at=>"2017-10-16T11:12:17+00:00",
        :error_code=>"5.7.66"
      }
    ]
    
    staff_members = StaffMember.where(master_venue: venue)
      .joins(:email_address)
      .where.not(email_addresses: {email: nil})
      .enabled
      .order(updated_at: :desc)
      .pluck(:email)
    users = User.where(staff_member: nil)
      .joins(:email_address)
      .where.not(email_addresses: {email: nil})
      .enabled
      .pluck(:email)

    normalised_bounce_data = []
    fake_bounced_emails_data.each do |fake_entry|
      staff_member_email = staff_members.shift
      user_email = users.shift
      normalised_bounce_data << fake_entry.merge(email: staff_member_email)
      normalised_bounce_data << fake_entry.merge(email: user_email)
    end
    normalised_bounce_data
  end
end
