class EmailAddressInUseQuery
  def all
    user_email_addresses = EmailAddress.
      joins(:users).
      merge(User.enabled)

    staff_member_email_addresses = EmailAddress.
      joins(:staff_members).
      merge(StaffMember.enabled)

    email_address_ids = (user_email_addresses.pluck(:id) + staff_member_email_addresses.pluck(:id)).uniq

    EmailAddress.where(id: email_address_ids)
  end
end
