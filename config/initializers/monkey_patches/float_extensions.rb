class Float
  def to_int_if_whole
    to_i == self ? to_i : self
  end
end
