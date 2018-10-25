class Api::V1::ClockInClockOutSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :staff_members,
    :clock_in_days,
    :clock_in_notes,
    :staff_types,
    :rota_shifts,
    :venues,
    :rotas,
    :page_data

  def staff_members
    staff_members = instance_options.fetch(:scope).fetch(:staff_members)

    ActiveModel::Serializer::CollectionSerializer.new(
      staff_members,
      serializer: Api::V1::ClockingWebApp::StaffMemberSerializer,
      scope: {
        staff_with_holidays_ids: instance_options.fetch(:scope).fetch(:staff_with_holidays_ids),
      },
    )
  end

  def clock_in_days
    clock_in_days = instance_options.fetch(:scope).fetch(:clock_in_days)

    ActiveModel::Serializer::CollectionSerializer.new(
      clock_in_days,
      serializer: Api::V1::ClockInDaySerializer,
    )
  end

  def clock_in_notes
    clock_in_notes = instance_options.fetch(:scope).fetch(:clock_in_notes)

    ActiveModel::Serializer::CollectionSerializer.new(
      clock_in_notes,
      serializer: Api::V1::ClockInNoteSerializer,
    )
  end

  def staff_types
    staff_types = instance_options.fetch(:scope).fetch(:staff_types)

    ActiveModel::Serializer::CollectionSerializer.new(
      staff_types,
      serializer: Api::V1::StaffTypeSerializer,
    )
  end

  def rota_shifts
    rota_shifts = instance_options.fetch(:scope).fetch(:rota_shifts)

    ActiveModel::Serializer::CollectionSerializer.new(
      rota_shifts,
      serializer: Api::V1::RotaShiftSerializer,
    )
  end

  def venues
    venues = instance_options.fetch(:scope).fetch(:venues)

    ActiveModel::Serializer::CollectionSerializer.new(
      venues,
      serializer: Api::V1::VenueSerializer,
    )
  end

  def rotas
    rotas = instance_options.fetch(:scope).fetch(:rotas)

    ActiveModel::Serializer::CollectionSerializer.new(
      rotas,
      serializer: Api::V1::RotaSerializer,
    )
  end

  def page_data
    rota_date = instance_options.fetch(:scope).fetch(:rota_date)

    {
      rota_date: rota_date.iso8601,
      rota_venue_id: object.id,
    }
  end
end
