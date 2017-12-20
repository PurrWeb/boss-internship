class AblyService
  def security_app_data_update(updates:, deletes:)
    updates_json = {
      rotaShifts: {},
      staffMembers: {},
      rotaStaffMembers: {},
      holidays: {},
      venues: []
    }

    deletes_json = {
      rotaShifts: {},
      staffMembers: {},
      rotaStaffMembers: {},
      holidays: {},
      venues: []
    }

    updates.each do |key, value|
      case key
      when :shifts
        value.each_value do |shift|
          staff_member = shift.staff_member
          updates_json[:rotaShifts][staff_member.id] ||= []
          updates_json[:rotaStaffMembers][staff_member.id] ||= []
          updates_json[:rotaShifts][staff_member.id] << Api::SecurityApp::V1::RotaShiftSerializer.new(shift)
          updates_json[:rotaStaffMembers][staff_member.id] << Api::SecurityApp::V1::ProfileStaffMemberSerializer.new(staff_member)
        end
      when :staff_members
        value.each_value do |staff_member|
          updates_json[:staffMembers][staff_member.id] = Api::SecurityApp::V1::ProfileStaffMemberSerializer.new(staff_member)
        end
      when :holidays
        value.each_value do |holiday|
          staff_member = holiday.staff_member
          updates_json[:holidays][staff_member.id] = Api::SecurityApp::V1::ProfileStaffMemberSerializer.new(staff_member)
        end
      when :venues
        value.each_value do |venue|
          updates_json[:venues] << Api::SecurityApp::V1::ProfileStaffMemberSerializer.new(staff_member)
        end
      else
        raise "unsupported key #{key} supplied"
      end
    end

    deletes.each do |key, value|
      case key
      when :shifts
        value.each_value do |shift|
          staff_member = shift.staff_member
          deletes_json[:rotaShifts][staff_member.id] = shift.id
        end
      when :staff_members
        value.each_value do |staff_member|
          deletes_json[:staffMembers] << staff_member.id
        end
      else
        raise "unsupported key #{key} supplied"
      end
    end

    security_channel_presence = client.channel(SecurityAppUpdateService.security_presence_channel)
    managers_channel = client.channel(SecurityAppUpdateService.manager_presence_channel)

    security_members = security_channel_presence.presence.get

    message = {
      venues: [],
      profilePage: {
        updates: {
          staffMembers: []
        },
        deletions: []
      },
      shiftsPage: {
        updates: {
          rotaShifts: [],
        },
        deletions: {
          rotaShifts: []
        }
      },
      rotaPage: {
        updates: {
          staffMembers: [],
          rotaShifts: [],
          holidays: []
        },
        deletions: {
          staffMembers: [],
          rotaShifts: [],
          holidays: []
        }
      }
    }

    security_members.items.map(&:client_id).each do |id|
      send_message = false
      if updates_json[:staffMembers][id.to_i].present?
        send_message = true
        message[:profilePage][:updates][:staffMembers] = [updates_json[:staffMembers][id.to_i]].flatten
      end
      if updates_json[:rotaShifts][id.to_i].present?
        send_message = true
        message[:shiftsPage][:updates][:rotaShifts] = [updates_json[:rotaShifts][id.to_i]].flatten
      end
      if deletes_json[:rotaShifts][id.to_i].present?
        send_message = true
        message[:shiftsPage][:deletions][:rotaShifts] = [deletes_json[:rotaShifts][id.to_i]].flatten
      end
      if deletes_json[:staffMembers].include?(id.to_i)
        send_message = true
        message[:profilePage][:deletions][:staffMembers] = [id.to_i]
      end
      if updates_json[:venues].present?
        send_message = true
        message[:venues] = updates_json[:venues]
      end
      if send_message
        security_channel = client.channel(SecurityAppUpdateService.personal_channel(id: id))
        security_channel.publish("data", message)
      end
    end

    message = {
      venues: [],
      profilePage: {
        updates: {
          staffMembers: []
        },
        deletions: []
      },
      shiftsPage: {
        updates: {
          rotaShifts: [],
        },
        deletions: {
          rotaShifts: []
        }
      },
      rotaPage: {
        updates: {
          staffMembers: [],
          rotaShifts: [],
          holidays: []
        },
        deletions: {
          staffMembers: [],
          rotaShifts: [],
          holidays: []
        }
      }
    }

    if updates_json[:rotaShifts].present?
      message[:rotaPage][:updates][:rotaShifts] = updates_json[:rotaShifts].map{|k, v| v}.flatten
    end
    if updates_json[:rotaStaffMembers].present?
      message[:rotaPage][:updates][:staffMembers] = updates_json[:rotaStaffMembers].map{|k, v| v}.flatten
    end
    if updates_json[:venues].present?
      message[:venues] = updates_json[:venues]
    end
    if deletes_json[:staffMembers].present?
      message[:rotaPage][:deletions][:staffMembers] = deletes_json[:staffMembers]
    end
    if deletes_json[:rotaShifts].present?
      message[:rotaPage][:deletions][:rotaShifts] = deletes_json[:rotaShifts].map{|k, v| v}.flatten
    end

    managers_channel.publish("data", message)
  end

  def request_token(staff_member:)
    capability = SecurityAppUpdateService.capability(staff_member: staff_member)

    client.auth.request_token({
      ttl: 5,
      client_id: "#{staff_member.id}",
      capability: capability,
    })
  end

  private
  def client
    @client ||= Ably::Rest.new(key: ENV.fetch("ABLY_API_KEY"))
  end
end