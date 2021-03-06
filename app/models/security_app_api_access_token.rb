class SecurityAppApiAccessToken
  def initialize(now: Time.current.utc, token: nil, expires_at: nil, staff_member:)
    unless staff_member.verified?
      raise "Staff member with id: #{staff_member.id} not verified yet"
    end

    @now = now

    if token.present?
      @token = token
    else
      @token = SecureRandom.hex
    end
    @staff_member = staff_member

    if expires_at.present?
      @expires_at = expires_at.utc
    else
      @expires_at = (now + 360.seconds).utc
    end
  end

  attr_reader :token, :staff_member, :expires_at, :now

  def self.token_key(token)
    "security_app_api_token:#{token}"
  end

  def token_key(token)
    SecurityAppApiAccessToken.token_key(token)
  end

  def self.issue_new_token!(staff_member:)
    revoke!(staff_member: staff_member)

    new(staff_member: staff_member).persist!
  end

  def self.revoke!(staff_member:)
    tokens = find_by_staff_member(staff_member: staff_member)

    redis.del(staff_member_key_token_list_key(staff_member))
    tokens.each do |token|
      redis.del(token_key(token.token))
    end
  end

  def self.staff_member_key_token_list_key(staff_member)
    "staff_member_key_token_list-staff_member_id:#{staff_member.id}"
  end

  def staff_member_key_token_list_key(staff_member)
    SecurityAppApiAccessToken.staff_member_key_token_list_key(staff_member)
  end

  def self.find_by_token(token:)
    token_data_raw = redis.get(token_key(token))
    if token_data_raw.present?
      token_data = JSON.parse(token_data_raw).symbolize_keys;
      staff_member_id = token_data.fetch(:staff_member_id)
      staff_member = StaffMember.find(staff_member_id)
      token = token_data.fetch(:token)
      expires_at = DateTime.iso8601(token_data.fetch(:expires_at))

      SecurityAppApiAccessToken.new(token: token, staff_member: staff_member, expires_at: expires_at)
    end
  end

  def self.find_by_staff_member(staff_member:)
    token_data_raw = redis.get(staff_member_key_token_list_key(staff_member))
    token_data = JSON.parse(token_data_raw)
    return [] unless token_data.present?
    token_data.map do |token|
      SecurityAppApiAccessToken.find_by_token(token: token)
    end.compact
  end

  def json
    {
      token: token,
      staff_member_id: staff_member.id,
      expires_at: expires_at.utc.iso8601
    }.to_json
  end

  def persist!
    persisted_tokens_keys_raw = redis.get(staff_member_key_token_list_key(staff_member))
    persisted_token_keys = persisted_tokens_keys_raw.present? ? JSON.parse(persisted_tokens_keys_raw) : []

    seconds_to_expiry = (expires_at - now).to_i
    if seconds_to_expiry <= 0
      raise "Can't persist the token, expiration time: #{expires_at} less or equal #{now}"
    end

    redis.multi do
      redis.set(
        token_key(token),
        json,
        ex: seconds_to_expiry
      )

      redis.set(
        staff_member_key_token_list_key(staff_member),
        (persisted_token_keys + [token]).to_json,
        ex: seconds_to_expiry
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
