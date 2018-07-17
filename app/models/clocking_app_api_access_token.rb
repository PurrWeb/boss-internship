class ClockingAppApiAccessToken
  def initialize(token: nil, expires_at: nil, staff_member:, api_key:)
    if token.present?
      @token = token
    else
      @token = SecureRandom.hex
    end

    @api_key = api_key
    @staff_member = staff_member

    if expires_at.present?
      @expires_at = expires_at.utc
    else
      @expires_at = 30.minutes.from_now.utc
    end
  end

  attr_reader :token, :staff_member, :expires_at, :api_key

  def self.token_key(token)
    "api_token:#{token}"
  end

  def token_key(token)
    ClockingAppApiAccessToken.token_key(token)
  end

  def self.find_by_token(token:)
    token_data_raw = redis.get(token_key(token))
    if token_data_raw.present?
      token_data = JSON.parse(token_data_raw).symbolize_keys;
      staff_member_id = token_data[:staff_member_id]
      token = token_data[:token]
      api_key_id = token_data[:api_key_id]
      staff_member = StaffMember.find(staff_member_id)
      api_key = ApiKey.find(api_key_id)

      ClockingAppApiAccessToken.new(token: token, staff_member: staff_member, api_key: api_key)
    end
  end

  def self.find_by_api_key(api_key:)
    token_data_raw = redis.get(api_key_token_list_key(api_key))
    token_data = JSON.parse(token_data_raw)
    return [] unless token_data.present?
    token_data.map do |token|
      ClockingAppApiAccessToken.find_by_token(token: token)
    end
  end

  def self.api_key_token_list_key(api_key)
    "clocking_app_api_key_token_list-api_key:#{api_key.key}"
  end

  def api_key_token_list_key(api_key)
    ClockingAppApiAccessToken.api_key_token_list_key(api_key)
  end

  def json
    {
      token: token,
      staff_member_id: staff_member.id,
      api_key_id: api_key.id
    }.to_json
  end

  def self.revoke!(api_key:)
    tokens = find_by_api_key(api_key: api_key)
    redis.del(api_key_token_list_key(api_key))
    tokens.each do |token|
      redis.del(token_key(token.token))
    end
  end

  def persist!
    keys_raw = redis.get(api_key_token_list_key(api_key))
    keys = keys_raw.present? ? JSON.parse(keys_raw) : []

    redis.multi do
      redis.set(
        token_key(token),
        json,
        ex: expires_at.to_i
      )

      redis.set(
        api_key_token_list_key(api_key),
        (keys + [token]).to_json
      )
    end
    self
  end

  def self.redis
    Redis.current
  end

  def redis
    Redis.current
  end
end
