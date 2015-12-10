FactoryGirl.define do
  sequence(:seq_number)

  factory :email_address do
    transient do
      sequence_number { generate(:seq_number) }
    end

    email { "fake.email#{sequence_number}@email.com" }
  end
end
