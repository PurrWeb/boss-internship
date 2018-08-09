module Api
  module V1
    class StaffVettingController < APIController
      before_filter :web_token_authenticate!

      def staff_without_email
        authorize! :view, :staff_without_email_vetting_page

        render json: {
          staffWithoutEmail: ActiveModel::Serializer::CollectionSerializer.new(
            StaffMembersWithoutEmailQuery.new.all.includes([:name, :master_venue]),
            serializer: Api::V1::StaffVettings::StaffMemberSerializer
          )
        }
      end

      def staff_without_ni_number
        authorize! :view, :staff_without_ni_number_vetting_page

        render json: {
          staffWithoutNiNumber: ActiveModel::Serializer::CollectionSerializer.new(
            StaffMembersWithoutNINumberQuery.new.all,
            serializer: Api::V1::StaffVettings::StaffMemberSerializer
          )
        }
      end

      def staff_without_address
        authorize! :view, :staff_without_address_vetting_page

        render json: {
          staffWithoutAddress: ActiveModel::Serializer::CollectionSerializer.new(
            StaffMembersWithoutAddressQuery.new.all.includes([:name, :master_venue]),
            serializer: Api::V1::StaffVettings::StaffMemberSerializer
          )
        }
      end

      def staff_without_photo
        authorize! :view, :staff_without_photo_vetting_page

        render json: {
          staffWithoutPhoto: ActiveModel::Serializer::CollectionSerializer.new(
            StaffMembersWithoutPhotoQuery.new.all.includes([:name, :master_venue]),
            serializer: Api::V1::StaffVettings::StaffMemberSerializer
          )
        }
      end

      def staff_with_expired_sia_badge
        authorize! :view, :staff_with_expired_sia_badge_vetting_page

        render json: {
          staffWithExpiredSiaBadge: ActiveModel::Serializer::CollectionSerializer.new(
            StaffMembersWithExpiringSiaBadgeQuery.new.all.order(:sia_badge_expiry_date).includes(:name),
            serializer: Api::V1::StaffVettings::StaffMemberSerializer
          )
        }
      end

      def staff_with_bounced_email
        authorize! :view, :staff_with_bounced_emails_vetting_page

        bounced_emails = BouncedEmailAddress.all.map {|be| be['email']}
        staff_members_with_bounced_email = StaffMember.enabled.joins(:email_address).where({email_addresses: {email: bounced_emails}})

        render json: {
          staffMembersWithBouncedEmail: ActiveModel::Serializer::CollectionSerializer.new(
            staff_members_with_bounced_email,
            serializer: Api::V1::StaffVettings::StaffMemberSerializer
          )
        }, status: 200
      end

      def staff_on_wrong_payrate
        authorize! :view, :staff_on_wrong_payrate_vetting_page

        staff_wrongly_on_18_to_20_payrate = StaffMemberWronglyOn18To20PayrateQuery.new.
          all.
          includes([:name, :master_venue])
        staff_wrongly_on_21_to_24_payrate = StaffMemberWronglyOn21To24PayrateQuery.new.
          all.
          includes([:name, :master_venue])
        staff_wrongly_on_25_plus_payrate = StaffMemberWronglyOn25PlusPayrateQuery.new.
          all.
          includes([:name, :master_venue])

          render json: {
            staffWronglyOn18To20Payrate: ActiveModel::Serializer::CollectionSerializer.new(
              staff_wrongly_on_18_to_20_payrate,
              serializer: Api::V1::StaffVettings::StaffMemberSerializer
            ),
            staffWronglyOn21To24Payrate: ActiveModel::Serializer::CollectionSerializer.new(
              staff_wrongly_on_21_to_24_payrate,
              serializer: Api::V1::StaffVettings::StaffMemberSerializer
            ),
            staffWronglyOn25PlusPayrate: ActiveModel::Serializer::CollectionSerializer.new(
              staff_wrongly_on_25_plus_payrate,
              serializer: Api::V1::StaffVettings::StaffMemberSerializer
            ),
          }, status: 200
      end

      def staff_dodgers
        date = date_from_params
        week = RotaWeek.new(date);
        accepted_hours = StaffMembersAcceptedHoursByWeekQuery.new(week: week).all
        paid_holidays = StaffMembersPaidHolidaysByWeekQuery.new(week: week).all
        staff_members = StaffMember.where(id: accepted_hours.keys)
        render json: {
          acceptedHours: accepted_hours,
          paidHolidays: paid_holidays,
          staffMembers: ActiveModel::Serializer::CollectionSerializer.new(
            staff_members,
            serializer: Api::V1::StaffVettings::StaffMemberSerializer
          )
        }, status: 200
      end

      private
      def date_from_params
        UIRotaDate.parse(params.fetch(:date))
      end
    end
  end
end
