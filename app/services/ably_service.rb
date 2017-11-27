class AblyService
  def initialize(serializer: nil)
    @serializer = serializer
  end

  def security_app_data_update(updates:, deletes:)
    potential_staff_members_updates = []
    updates_json = {}
    updates.each do |key, value|
      case key
      when :shifts
        value.each_value do |shift|
          staff_member = shift.staff_member
          updates_json[staff_member.id] ||= {}
          updates_json[staff_member.id][:shifts] ||= []
          updates_json[staff_member.id][:shifts] << serialize(shift)
        end
      when :staff_members
        value.each_value do |staff_member|
          updates_json[staff_member.id] ||= {}
          updates_json[staff_member.id][:staff_members] ||= []
          updates_json[staff_member.id][:staff_members] << serialize(staff_member)
        end
      else
        raise "unsupported key #{key} supplied"
      end
    end

    deletes_json = {}
    deletes.each do |key, value|
      case key
      when :shifts
        value.each_value do |shift|
          staff_member = shift.staff_member
          deletes_json[staff_member.id] ||= {}
          deletes_json[staff_member.id][:shifts] ||= []
          deletes_json[staff_member.id][:shifts] << shift.id #<< Serivaliser::JSON::Thing.new(value)
        end
      else
        raise "unsupported key #{key} supplied"
      end
    end
    channel_presence = client.channel("security-app-presence")
    members = channel_presence.presence.get

    staff_members_ids = members.items.map(&:client_id)
    staff_members_ids.each do |id|
      if updates_json[id.to_i].present? || deletes_json[id.to_i].present?
        client_channel = client.channel("security-app-#{id}")
        client_channel.publish("message", {
          updates: updates_json[id.to_i],
          deletes: deletes_json[id.to_i]
        })
      end
    end
  end

  def client
    AblyService.client
  end

  def self.client
    @@client ||= Ably::Rest.new(key: ENV["ABLY_API_KEY"])
  end

  private
  def serialize(item)
    @serializer.present? ? @serializer.new(item) : item
  end
end
