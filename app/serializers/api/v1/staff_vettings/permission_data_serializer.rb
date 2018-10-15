class Api::V1::StaffVettings::PermissionDataSerializer < ActiveModel::Serializer
  attributes \
   :staffWithoutEmail,
   :staffWithoutNiNumber,
   :staffWithoutAddress,
   :staffWithoutPhoto,
   :staffOnWrongPayrate,
   :staffWithExpiredSiaBadge,
   :staffWithBouncedEmails,
   :staffWithWithTimeDodges,
   :duplicatedSageId

  def staffWithoutEmail
    {
      canView: user_ability.can?(:view, :staff_without_email_vetting_page)
    }
  end

  def staffWithoutNiNumber
    {
      canView: user_ability.can?(:view, :staff_without_ni_number_vetting_page)
    }
  end

  def staffWithoutAddress
    {
      canView: user_ability.can?(:view, :staff_without_address_vetting_page)
    }
  end

  def staffWithoutPhoto
    {
      canView: user_ability.can?(:view, :staff_without_photo_vetting_page)
    }
  end

  def staffOnWrongPayrate
    {
      canView: user_ability.can?(:view, :staff_on_wrong_payrate_vetting_page)
    }
  end

  def staffWithExpiredSiaBadge
    {
      canView: user_ability.can?(:view, :staff_with_expired_sia_badge_vetting_page)
    }
  end

  def staffWithBouncedEmails
    {
      canView: user_ability.can?(:view, :staff_with_bounced_emails_vetting_page)
    }
  end

  def staffWithWithTimeDodges
    {
      canView: user_ability.can?(:view, :time_dodgers)
    }
  end

  def duplicatedSageId
    {
      canView: user_ability.can?(:view, :duplicated_sage_id)
    }
  end

  def user_ability
    object
  end
end
