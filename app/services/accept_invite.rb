class AcceptInvite
  Result = Struct.new(:success, :user) do
    def success?
      success
    end
  end

  def initialize(invite:, password:)
    @invite = invite
    @password = password
  end

  def call
    success = false
    user = User.new

    ActiveRecord::Base.transaction do
      venues = Venue.where(id: invite.venue_ids) || []
      existing_email_address = EmailAddress.find_by(email: invite.email)
      if existing_email_address && !existing_email_address.assigned_to_user?
        email_address = existing_email_address
      else
        email_address = EmailAddress.new(email: invite.email)
      end
      success = user.update({
        password: password,
        email_address: email_address,
        name: Name.new({first_name: invite.first_name, surname: invite.surname}),
        role: invite.role,
        invite: invite,
      })
      if success
        venues.each do |venue|
          user.venue_users.create!(venue: venue)
        end
        invite.transition_to!(:accepted)
      end
    end
    Result.new(success, user)
  end

  private

  attr_reader :invite, :password
end
