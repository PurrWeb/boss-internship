class Form < Reform::Form
  # Refom doesn't call #sync on Disposable::Twin model by default
  def sync
    super
    if model.respond_to?(:sync)
      model.public_send(:sync)
    end
  end

  # required to back rails form
  def to_key(*args)
    model.public_send(:to_key, *args)
  end

  # required to back rails form
  def self.validators_on(args)
    []
  end

  # required to back rails form
  def persisted?
    false
  end
end
