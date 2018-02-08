FactoryGirl.define do
  factory :invite do
    inviter factory: :user

    sequence :email do |n|
      "fake#{n}@email.com"
    end

    role User::ADMIN_ROLE

    trait :admin do
      role User::ADMIN_ROLE
    end

    trait :manager do
      role User::MANAGER_ROLE
    end

    trait :security_manager do
      role 'security_manager'
    end

    trait :accepted do
      after(:create) do |invite|
        FactoryGirl.create(:invite_transition, :accepted, invite: invite)
      end
    end

    trait :revoked do
      after(:create) do |invite|
        FactoryGirl.create(:invite_transition, :revoked, invite: invite)
      end
    end
  end
end
