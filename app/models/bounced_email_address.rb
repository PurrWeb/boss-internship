class BouncedEmailAddress
  def self.clear
    begin
      bounced_data = redis.get(
        bounce_list_key
      )
      if bounced_data.present?
        JSON.parse(bounced_data)["keys"].each do |email|
          redis.del(bounce_record_key(email: email))
        end
        redis.del(bounce_list_key)
      end
    rescue Exception => e
      raise e.message
    end
  end

  def self.update(bounce_data:)
    if bounce_data_valid?(bounce_data:bounce_data)
      begin
        redis.multi do
          redis.set(
            bounce_list_key,
            emails_list(bounce_data: bounce_data)
          )
          
          bounce_data.each do |bounce_entry|
            redis.set(
              bounce_record_key(email: bounce_entry.fetch(:email)),
              bounce_record_json(bounce_entry: bounce_entry)
            )
          end
        end
      rescue Exception => e
        raise e.message
      end
    end
    nil
  end

  def self.find_by_email(email:)
    bounce_record_json = JSON.parse(redis.get(bounce_record_key(email: email.downcase)))
    bounce_record_json.merge("updated_at" => update_time) if bounce_record_json.present?
  end

  def self.update_time
    JSON.parse(redis.get(bounce_list_key))["update_time"]
  end

  def self.all
    bounced_data = redis.get(
      bounce_list_key
    )
    return [] unless bounced_data.present?

    bounced_data_json = JSON.parse(bounced_data)
    bounced_data_json["keys"].map do |email|
      JSON.parse(redis.get(bounce_record_key(email: email)))
        .merge("updated_at" => update_time)
    end
  end

  def self.bounce_data_valid?(bounce_data:)
    unless bounce_data.is_a?(Array)
      return false;
    end
    bounce_data.each do |bounce_entry|
      unless entry_valid?(entry: bounce_entry)
        return false
      end
    end
    true
  end

  def self.redis
    Redis.current
  end

  private
  def self.emails_list(bounce_data:)
    keys = bounce_data.map do |bounce_entry|
      bounce_entry[:email]
    end
    {
      update_time: Time.now.iso8601,
      keys: keys
    }.to_json
  end

  def self.bounce_record_json(bounce_entry:)
    {
      email: bounce_entry.fetch(:email),
      reason: bounce_entry.fetch(:reason),
      bounced_at: bounce_entry.fetch(:bounced_at),
      error_code: bounce_entry.fetch(:error_code),
    }.to_json
  end

  def self.bounce_list_key
    "boss:bounced_emails:bounce_list"
  end

  def self.bounce_record_key(email:)
    "boss:bounced_emails:bounce_data:#{email}"
  end

  def self.entry_valid?(entry:)
    entry.key?(:email) &&
    entry.key?(:reason) &&
    entry.key?(:bounced_at) &&
    entry.key?(:error_code)
  end
end
