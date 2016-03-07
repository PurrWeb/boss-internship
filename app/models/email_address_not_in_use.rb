class EmailAddressNotInUse
  def find(email)
    email_addresses = EmailAddress.
      where(email: email)
    email_addresses.detect(&:unassigned?)
  end
end
