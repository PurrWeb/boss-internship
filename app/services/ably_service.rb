class AblyService
  def security_app_data_update(updates:, deletes:)

    updates_by_staff_member_id = group_by_staff_member_id(updates)
    deletes_by_staff_member_id = group_by_staff_member_id(deletes)

    security_channel_presence = client.channel(SecurityAppUpdateService.security_presence_channel)
    personal_security_channel_member_ids = security_channel_presence.presence.get.items.map(&:client_id)

    security_staff_members = StaffMember.enabled.security

    # Send messages relating to staff member related data
    ###################################
    security_staff_members.each do |security_staff_member|
      id = security_staff_member.id
      staff_member_listening_on_personal_channel = personal_security_channel_member_ids.include?(id.to_s)

      if staff_member_listening_on_personal_channel
        updates_relating_to_staff_member = extract_staff_member_data(staff_member_id: id, grouped_data: updates_by_staff_member_id)
        deletes_relating_to_staff_member = extract_staff_member_data(staff_member_id: id, grouped_data: deletes_by_staff_member_id)

        updates_exist_for_staff_member = !updates_relating_to_staff_member.empty? || !deletes_relating_to_staff_member.empty?

        if updates_exist_for_staff_member
          send_personal_channel_staff_member_update(
            staff_member_id: id,
            message: personal_channel_staff_member_update_message(
              updates_relating_to_staff_member: updates_relating_to_staff_member,
              deletes_relating_to_staff_member: deletes_relating_to_staff_member,
              venue_updates: updates[:venues] || {},
              venue_deletes: deletes[:venues] || {}
            )
          )
        end
      end
    end
  end

  def request_token(staff_member:)
    capability = SecurityAppUpdateService.capability(staff_member: staff_member)
    client.auth.request_token({
      ttl: 60,
      client_id: "#{staff_member.id}",
      capability: capability,
    })
  end

  def extract_staff_member_data(staff_member_id:, grouped_data:)
    result = {}

    extracted_rota_shifts = (grouped_data[:rota_shifts] || {})[staff_member_id]
    if (extracted_rota_shifts || []).count > 0
      result[:rota_shifts] = extracted_rota_shifts
    end

    extracted_security_venue_shifts = (grouped_data[:security_venue_shifts] || {})[staff_member_id]
    if (extracted_security_venue_shifts || []).count > 0
      result[:security_venue_shifts] = extracted_security_venue_shifts
    end

    extracted_staff_members = (grouped_data[:staff_members] || {})[staff_member_id]
    if (extracted_staff_members || []).count > 0
      result[:staff_members] = extracted_staff_members
    end

    extracted_holidays = (grouped_data[:holidays] || {})[staff_member_id]
    if (extracted_holidays || []).count > 0
      result[:holidays] = extracted_holidays
    end

    result
  end

  def group_by_staff_member_id(ungrouped_entities)
    result = {}

    ungrouped_entities.each do |entity_type, entities|
      case entity_type
      when :shifts
        entities.each_value do |rota_shift|
          staff_member = rota_shift.staff_member
          result[:rota_shifts] ||= {}
          result[:rota_shifts][staff_member.id] ||= []
          result[:rota_shifts][staff_member.id] << rota_shift
        end
      when :security_venue_shifts
        entities.each_value do |security_venue_shift|
          staff_member = security_venue_shift.staff_member
          result[:security_venue_shifts] ||= {}
          result[:security_venue_shifts][staff_member.id] ||= []
          result[:security_venue_shifts][staff_member.id] << security_venue_shift
        end
      when :staff_members
        entities.each_value do |staff_member|
          result[:staff_members] ||= {}
          result[:staff_members][staff_member.id] ||= []
          result[:staff_members][staff_member.id] << staff_member
        end
      when :holidays
        entities.each_value do |holiday|
          staff_member = holiday.staff_member
          result[:holidays] ||= {}
          result[:holidays][staff_member.id] = []
          result[:holidays][staff_member.id] << holiday
        end
      when :venues
        #Entity Not specific to staff member
      else
        raise "unsupported entity type #{entity_type} encountered"
      end
    end

    result
  end

  def personal_channel_staff_member_update_message(
    updates_relating_to_staff_member:,
    deletes_relating_to_staff_member:,
    venue_updates:,
    venue_deletes:
  )
    result = {
      profile_page_json_key => {
        "updates" => {},
        "deletes" => {}
      },
      shifts_page_json_key => {
        "updates" => {},
        "deletes"=> {}
      }
    }

    updates_relating_to_staff_member.each do |key, records|
      case key
      when :rota_shifts
        result[shifts_page_json_key]["updates"]["rotaShifts"] ||= []
        records.each do |rota_shift|
          result[shifts_page_json_key]["updates"]["rotaShifts"] << Api::SecurityApp::V1::RotaShiftSerializer.new(rota_shift)
        end
      when :security_venue_shifts
        result[shifts_page_json_key]["updates"]["securityVenueShifts"] ||= []
        records.each do |security_venue_shift|
          result[shifts_page_json_key]["updates"]["securityVenueShifts"] << Api::SecurityApp::V1::SecurityVenueShiftSerializer.new(security_venue_shift)
        end
      when :staff_members
        result[profile_page_json_key]["updates"]["staffMembers"] ||= []
        records.each do |staff_member|
          result[profile_page_json_key]["updates"]["staffMembers"] << Api::SecurityApp::V1::ProfileStaffMemberSerializer.new(staff_member)
        end
      when :holidays
        # Not used by personal app
      else
        raise "unsupported entity type #{entity_type} encountered"
      end
    end
    venue_updates.each do |venue|
      result[shifts_page_json_key]["updates"]["venues"] ||= []
      result[shifts_page_json_key]["updates"]["venues"] << Api::SecurityApp::V1::VenueSerializer.new(venue)
    end

    deletes_relating_to_staff_member.each do |key, records|
      case key
      when :rota_shifts
        result[shifts_page_json_key]["deletes"]["rotaShifts"] ||= []
        records.each do |rota_shift|
          result[shifts_page_json_key]["deletes"]["rotaShifts"] << rota_shift.id
        end
      when :security_venue_shifts
        result[shifts_page_json_key]["deletes"]["securityVenueShifts"] ||= []
        records.each do |security_venue_shift|
          result[shifts_page_json_key]["deletes"]["securityVenueShifts"] << security_venue_shift.id
        end
      when :staff_members
        result[profile_page_json_key]["deletes"]["staffMembers"] ||= []
        records.each do |staff_member|
          result[profile_page_json_key]["deletes"]["staffMembers"] << staff_member.id
        end
      when :holidays
        # Not used by personal app
      else
        raise "unsupported entity type #{entity_type} encountered"
      end
    end
    venue_updates.each do |venue|
      result[shifts_page_json_key]["deletes"]["venues"] ||= []
      result[shifts_page_json_key]["deletes"]["venues"] << venue.id
    end

    result
  end

  def send_personal_channel_staff_member_update(staff_member_id:, message:)
    channel = client.channel(SecurityAppUpdateService.personal_channel(id: staff_member_id))
    channel.publish("data", message)
  end

  def send_mangager_channel_staff_member_update(messsage:)
    channel = client.channel(SecurityAppUpdateService.manager_channel)
    channel.publish("data", message)
  end

  private
  def profile_page_json_key
    "profilePage"
  end

  def shifts_page_json_key
    "shiftsPage"
  end

  def client
    @client ||= Ably::Rest.new(key: ENV.fetch("ABLY_API_KEY"))
  end
end
