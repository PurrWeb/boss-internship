class BooleanEnvVariable
  TRUTHY_VALUES = [true, "true", "t", "yes", "y"].freeze
  FALSEY_VALUES = [false, "false", "f", "n", "no"].freeze

  def initialize(key, default: nil)
    @key = key
    if default.present?
      @raw_value = ENV.fetch(key, default)
    else
      @raw_value = ENV.fetch(key).to_s.downcase
    end
  end

  attr_reader :raw_value, :key

  def value
    return true if TRUTHY_VALUES.include?(raw_value.to_s)
    return false if FALSEY_VALUES.include?(raw_value.to_s)
    raise "Invalid non boolean value: #{raw_value} supplied for ENV var: #{key}"
  end

  def to_s
    value.to_s
  end
end
