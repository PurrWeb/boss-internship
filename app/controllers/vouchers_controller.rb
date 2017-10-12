class VouchersController < ApplicationController
  before_action :set_new_layout

  def index
    unless index_params_present?
      return redirect_to(vouchers_path(index_redirect_params))
    end
    
    per_page = 10

    vouchers = VouchersIndexQuery.new(
      venue: venue_from_params,
      status: status_from_params,
      start_date: start_date_from_params,
      end_date: end_date_from_params
    ).all

    paginated_vouchers = vouchers.paginate(
      page: page_from_params,
      per_page: per_page
    )

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    
    render locals: {
      vouchers: paginated_vouchers,
      venues: Venue.all,
      current_venue: venue_from_params,
      access_token: access_token.token,
      status: status_from_params,
      start_date: start_date_from_params,
      end_date: end_date_from_params,
      size: vouchers.size,
      per_page: per_page,
      page: page_from_params
    }
  end

  def redeem
    unless redeem_params_present?
      return redirect_to(redeem_vouchers_path(redeem_redirect_params))
    end

    vouchers = venue_from_params.vouchers
    venue_staff_members = StaffMember.where.not(venues: {id: nil}).includes(:name, :master_venue)
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    
    render locals: {
      vouchers: vouchers,
      venue_staff_members: venue_staff_members,
      current_venue: venue_from_params,
      access_token: access_token.token,
      status: status_from_params
    }
  end

  def usages
    unless usages_params_present?
      return redirect_to(usages_voucher_path(usages_redirect_params))
    end

    per_page = 10

    voucher = Voucher.find_by(id: params.fetch(:id))
    usages = VoucherUsagesIndexQuery.new(
      voucher: voucher,
      status: status_from_params,
      start_date: start_date_from_params,
      end_date: end_date_from_params
    ).all
    
    paginated_usages = usages.paginate(
      page: page_from_params,
      per_page: per_page
    )

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    
    render locals: {
      voucher: voucher,
      usages: paginated_usages,
      access_token: access_token.token,
      status: status_from_params,
      size: usages.size,
      page: page_from_params,
      per_page: per_page,
      start_date: start_date_from_params,
      end_date: end_date_from_params
    }
  end

  private
  def index_redirect_params
    venue = venue_from_params || current_venue
    status = status_from_params || "all"
    page = page_from_params || "1"
    {
      venue_id: venue.andand.id,
      status: status,
      page: page
    }
  end
  
  def redeem_redirect_params
    venue = venue_from_params || current_venue
    {
      venue_id: venue.andand.id,
    }
  end

  def usages_redirect_params
    status = status_from_params || "all"
    page = page_from_params || "1"
    {
      status: status,
      page: page
    }
  end

  def venue_params
    params.permit(:venue_id)
  end

  def accessible_venues
    AccessibleVenuesQuery.new(current_user).all
  end

  def venue_from_params
    accessible_venues.find_by(id: params[:venue_id])
  end

  def status_from_params
    if ["all", "active"].include? params[:status]
      params[:status]
    end
  end

  def page_from_params
    params[:page]
  end

  def index_params_present?
    venue_from_params.present? &&
    status_from_params.present? &&
    page_from_params
  end

  def redeem_params_present?
    venue_from_params.present?
  end

  def usages_params_present?
    status_from_params.present? &&
    page_from_params
  end

  def start_date_from_params
    result = nil
    begin
      result = UIRotaDate.parse(params[:start_date])
    rescue; end
    result
  end

  def end_date_from_params
    result = nil
    begin
      result = UIRotaDate.parse(params[:end_date])
    rescue; end
    result
  end
end
