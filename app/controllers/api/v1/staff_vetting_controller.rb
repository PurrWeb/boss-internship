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

        bounced_emails = BouncedEmailAddress.all.map { |be| be['email'] }
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

      def mark_repeat_offender
        result = CreateTimeDodgerReviewActionApiService.new(requester: current_user).call(params)
        if result.success?
          render json: {
            offenderLevel: Api::V1::StaffVettings::OffenderSerializer.new(result.review_action.time_dodger_offence_level)
          }, status: 200
        else
          render json: { errors: result.api_errors }, status: 422
        end
      end

      def repeat_offenders
        authorize! :view, :repeat_offenders

        now = Time.current
        today = RotaShiftDate.to_rota_date(now)
        previous_week = RotaWeek.new(today - 1.week);
        current_tax_year = MondayTaxYear.new(today)

        dodgers_data = TimeDodgerOffence.dodgers.by_week(previous_week)

        offenders = TimeDodgerOffenceLevel
          .where(tax_year_start: current_tax_year.start_date)
          .where('offence_level > ?', 0)

        last_updated_level = TimeDodgerOffenceLevel.order(updated_at: :asc).last

        offenders_history = InRangeQuery.new(
          relation: TimeDodgerOffence.hard_dodgers.where(staff_member_id: offenders.select("staff_member_id")),
          start_value: current_tax_year.start_date,
          end_value: previous_week.start_date,
          start_column_name: "week_start",
          end_column_name: "week_start",
        ).all

        reviews_history = TimeDodgerReviewAction.enabled.where(time_dodger_offence_level_id: offenders.select(:id))
        staff_members = StaffMember.where(id: offenders.select(:staff_member_id))

        render json: {
          offendersHistory: ActiveModel::Serializer::CollectionSerializer.new(
            offenders_history,
            serializer: Api::V1::StaffVettings::OffenderHistorySerializer,
          ),
          reviewsHistory: ActiveModel::Serializer::CollectionSerializer.new(
            reviews_history,
            serializer: Api::V1::StaffVettings::ReviewsHistorySerializer,
          ),
          offenders: ActiveModel::Serializer::CollectionSerializer.new(
            offenders,
            serializer: Api::V1::StaffVettings::OffenderSerializer,
          ),
          staffMembers: ActiveModel::Serializer::CollectionSerializer.new(
            staff_members,
            serializer: Api::V1::StaffVettings::StaffMemberSerializer,
          ),
          lastUpdate: UIRotaDate.format(last_updated_level.updated_at),
          taxYearStartDate: UIRotaDate.format(current_tax_year.start_date),
          taxYearEndDate: UIRotaDate.format(current_tax_year.end_date),
          softDodgersCount: dodgers_data.soft_dodgers.count,
          hardDodgersCount: dodgers_data.hard_dodgers.count,
          previousWeekStartDate: UIRotaDate.format(previous_week.start_date),
        }, status: 200
      end

      def time_dodgers
        authorize! :view, :time_dodgers

        date = date_from_params
        monday_tax_year = MondayTaxYear.new(date)
        week = RotaWeek.new(date);

        dodgers_data = TimeDodgerOffence.dodgers.by_week(week)

        offenders = TimeDodgerOffenceLevel
          .where(tax_year_start: monday_tax_year.start_date)
          .where('offence_level > ?', 0)

        staff_members = StaffMember.on_weekly_pay_rate.where(id: dodgers_data.pluck(:staff_member_id))

        render json: {
          softDodgers: ActiveModel::Serializer::CollectionSerializer.new(
            dodgers_data.soft_dodgers,
            serializer: Api::V1::StaffVettings::TimeDodgerSerializer
          ),
          hardDodgers: ActiveModel::Serializer::CollectionSerializer.new(
            dodgers_data.hard_dodgers,
            serializer: Api::V1::StaffVettings::TimeDodgerSerializer
          ),
          offendersCount: offenders.count,
          markNeededOffendersCount: offenders.mark_needed.count,
          staffMembers: ActiveModel::Serializer::CollectionSerializer.new(
            staff_members,
            serializer: Api::V1::StaffVettings::StaffMemberSerializer
          ),
        }, status: 200
      end

      def staff_with_same_sage_id
        authorize! :view, :duplicated_sage_id

        staff_members_with_duplicated_sage_id = StaffWithSameSageIdQuery.new.all
        render json: {
          staffMembers: ActiveModel::Serializer::CollectionSerializer.new(
            staff_members_with_duplicated_sage_id,
            serializer: Api::V1::StaffVettings::StaffMemberSerializer
          ),
          venues: ActiveModel::Serializer::CollectionSerializer.new(
            Venue.all,
            serializer: Api::V1::StaffVettings::VenueSerializer
          ),
        }, status: 200
      end

      private
      def date_from_params
        UIRotaDate.parse(params.fetch(:date))
      end
    end
  end
end
