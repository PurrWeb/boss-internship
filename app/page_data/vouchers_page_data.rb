class VouchersPageData
  def initialize(vouchers:, params:)
    normalized_params = (params || {}).reverse_merge(default_params)
    @vouchers = vouchers
    @page = normalized_params.fetch(:page)
    @status = normalized_params.fetch(:status)
    @start_date = normalized_params.fetch(:start_date)
    @end_date = normalized_params.fetch(:end_date)
    @per_page = normalized_params.fetch(:per_page)
  end

  attr_reader :vouchers, :page, :status, :start_date, :end_date, :per_page

  def get_data
    vouchers_paginated = vouchers.paginate(
      page: page,
      per_page: per_page
    )
    {
      vouchers: ActiveModel::Serializer::CollectionSerializer.new(vouchers_paginated, serializer: VoucherSerializer),
      size: vouchers.size,
      page: page,
      status: status,
      start_date: start_date,
      end_date: end_date,
      per_page: per_page
    }
  end

  private

  def default_params
    {
      page: 1,
      status: 'all',
      created_by: nil,
      start_date: nil,
      end_date: nil,
      per_page: 5,
    }
  end
end
