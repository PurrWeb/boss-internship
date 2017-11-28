module Api::SecurityApp::V1::ProfileStaffMemberSerializer < ActiveModel::Serializer
        attributes \
          :id,
          :firstName,
          :surname,
          :email,
          :avatarImageUrl,
          :phoneNumber,
          :niNumber,
          :siaBageExpiryDate,
          :siaBadgeNumber,
          :address

        def firstName
          object.name.first_name
        end

        def surname
          object.name.surname
        end

        def email
          object.email
        end

        def avatarImageUrl
          object.avatar_url
        end

        def phoneNumber
          object.phone_number
        end

        def niNumber
          object.national_insurance_number
        end

        def siaBageExpiryDate
          UIRotaDate.format(object.sia_badge_expiry_date)
        end

        def siaBadgeNumber
          object.sia_badge_number
        end

        def address
          object.address
        end
      end
    end
  end
end
