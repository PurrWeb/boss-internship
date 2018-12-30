require 'rqrcode'

class PartyEmailMailer < ApplicationMailer
  def new_years_party_invite_mail(staff_member_id:)
    staff_member = StaffMember.enabled.find_by!(id: staff_member_id)
    first_name = staff_member.name.first_name
    raise "No guid set for staff_member ##{staff_member.id}" unless staff_member.id_scanner_guid.present?
    qr_code = RQRCode::QRCode.new(staff_member.id_scanner_guid)
    qr_code_png = qr_code.as_png(
      resize_gte_to: false,
      resize_exactly_to: false,
      fill: 'white',
      color: 'black',
      size: 200,
      file: nil,
    )

    mail(
      to: staff_member.email,
      subject: 'Your Pub Invest Group Awards Night 2019 Invite'
    ) do |format|
      format.html do
        render locals: {
          first_name: first_name,
          qr_code_data_url: qr_code_png.to_data_url,
        }
      end
    end
  end
end
