require 'rails_helper'

describe UpdateBouncedEmailsJob do
  let(:invalid_data) { [{email: "", bounced_at: "", error_code: ""}] }
  let(:job) {UpdateBouncedEmailsJob.new}
  let(:service) {lambda {invalid_data}}
  specify 'invalid data should raise an error ' do
    expect { job.perform(env: "production", service: service) }.to raise_error(RuntimeError, "API returned Invalid bounced data supplied #{invalid_data}")
  end
end
