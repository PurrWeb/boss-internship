class PermissionsPageData
  def initialize(user:)
    @role = UserAbility.new(user)
    @user = user
    @path = Rails.application.routes.url_helpers
  end

  attr_reader :user, :role

  def to_json
    venue = {
      name: "Venue",
      color: "#e74c3c",
      items: [
        {
          description: "Machines",
          permitted: role.can?(:view, :machines_page),
          path: @path.machines_path,
        },
        {
          description: "Machines Refloats",
          permitted: role.can?(:view, :machine_refloats_page),
          path: @path.machine_refloats_path,
        },
        {
          description: "Rota",
          permitted: role.can?(:view, :rotas_page),
          path: @path.rotas_path,
        },
        {
          description: "Change Orders",
          permitted: role.can?(:view, :change_orders_page),
          path: @path.change_orders_path,
        },
        {
          description: "Fruit Orders",
          permitted: role.can?(:view, :fruit_orders_page),
          path: @path.fruit_orders_path,
        },
        {
          description: "Check Lists",
          permitted: role.can?(:view, :check_lists_page),
          path: @path.check_lists_path,
        },
        {
          description: "Safe Checks",
          permitted: role.can?(:view, :safe_checks),
          path: @path.safe_checks_path,
        },
        {
          description: "Venue Health Check",
          permitted: role.can?(:view, :venue_health_checks_page),
          path: @path.venue_health_check_index_path,
        },
        {
          description: "Incident Reports",
          permitted: role.can?(:view, :incident_report_page),
          path: @path.incident_reports_path,
        },
        {
          description: "Vouchers",
          permitted: role.can?(:view, :vouchers_page),
          path: @path.vouchers_path,
        },
        {
          description: "Reedem Vouchers",
          permitted: role.can?(:view, :redeem_vouchers_page),
          path: @path.redeem_vouchers_path,
        },
        {
          description: "Maintenance Tasks",
          permitted: role.can?(:view, :maintenance_tasks),
          path: @path.maintenance_index_path,
        },
        {
          description: "Marketing Tasks",
          permitted: role.can?(:view, :marketing_tasks_page),
          path: @path.marketing_tasks_path,
        },
        {
          description: "Venue Dashboard",
          permitted: role.can?(:view, :venue_dashboard),
          path: @path.venue_dashboard_path,
        },
      ],
    }

    security = {
      name: "Security",
      color: "#ff80e3",
      items: [
        {
          description: "Security Shift Requests",
          permitted: role.can?(:view, :security_shift_requests),
          path: @path.security_shift_requests_path
        },
        {
          description: "Security Rota",
          permitted: role.can?(:view, :security_rota),
          path: @path.security_rotas_path
        },
        {
          description: "Security Rota Requests",
          permitted: role.can?(:view, :security_rota),
          path: @path.requests_security_rota_path(
            UIRotaDate.format(RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date)
          )
        }
      ]
    }

    staff_members = {
      name: "Staff Members",
      color: "#27ae60",
      items: [
        {
          description: "Hours Confirmation",
          permitted: role.can?(:view, :hours_confirmation_page),
          path: @path.current_hours_confirmation_index_path,
        },
        {
          description: "Holidays",
          permitted: role.can?(:view, :holiday_reports_page),
          path: @path.holidays_path(date: UIRotaDate.format(Time.zone.now.to_date.monday)),
        },
        {
          description: "Staff Members List",
          permitted: role.can?(:list, :staff_members),
          path: @path.staff_members_path,
        },
        {
          description: "Add Staff Member",
          permitted: role.can?(:create, :staff_members),
          path: @path.new_staff_member_path,
        },
      ],
    }

    reports = {
      name: "Reports",
      color: "#9b59b6",
      items: [
        {
          description: "Daily Report",
          permitted: role.can?(:view, :daily_reports),
          path: @path.daily_reports_path,
        },
        {
          description: "Weekly Report",
          permitted: role.can?(:view, :weekly_reports),
          path: @path.weekly_reports_path,
        },
        {
          description: "Payroll Report",
          permitted: role.can?(:view, :payroll_reports),
          path: @path.payroll_reports_path,
        },
      ],
    }

    applications = {
      name: "Applications",
      color: "#000000",
      items: [
        {
          description: "Stock",
          permitted: role.can?(:visit, :stock_application),
          path: "https://beta-stock.jsmbars.online/",
        },
        {
          description: "Bookings",
          permitted: role.can?(:visit, :bookings_application),
          path: "https://bookings.jsmbars.online/",
        },
        {
          description: "Cashing Up",
          permitted: role.can?(:visit, :cashing_up_application),
          path: "https://cashup.jsmbars.online/",
        },
      ],
    }

    customers = {
      name: "Customers",
      color: "#e67e22",
      items: [
        {
          description: "WTL Cards",
          permitted: true,
          path: @path.wtl_cards_path,
        },
        {
          description: "WTL Clients",
          permitted: true,
          path: @path.wtl_clients_path,
        },
      ],
    }

    admin_general = {
      name: "Admin: General",
      color: "#e67e22",
      items: [
        {
          description: "Ops Diary",
          permitted: role.can?(:view, :ops_diary),
          path: @path.ops_diaries_path,
        },
        {
          description: "Names",
          permitted: role.can?(:view, :names_page),
          path: @path.names_path,
        },
        {
          description: "Venues",
          permitted: role.can?(:view, :venues_page),
          path: @path.venues_path,
        },
        {
          description: "Payment Uploads",
          permitted: role.can?(:view, :payment_uploads_page),
          path: @path.payment_uploads_path,
        },
        {
          description: "API Keys",
          permitted: role.can?(:view, :api_keys_page),
          path: @path.api_keys_path,
        },
        {
          description: "Id Scanner Keys",
          permitted: role.can?(:view, :id_scanner_keys_page),
          path: @path.id_scanner_keys_path,
        },
        {
          description: "Dashboard Messages",
          permitted: role.can?(:view, :dashboard_messages_page),
          path: @path.message_board_path,
        },
      ],
    }

    admin_users = {
      name: "Admin: Users",
      color: "#1abc9c",
      items: [
        {
          description: "Users",
          permitted: role.can?(:view, :users_page),
          path: @path.users_path,
        },
        {
          description: "Invites",
          permitted: role.can?(:manage, :user_invites),
          path: @path.invites_path,
        },
      ],
    }

    admin_staff_members = {
      name: "Admin: Staff Members",
      color: "#3498db",
      items: [
        {
          description: "Staff Type",
          permitted: role.can?(:view, :staff_types_page),
          path: @path.staff_types_path,
        },
        {
          description: "Pay Rates",
          permitted: role.can?(:view, :pay_rates_page),
          path: @path.pay_rates_path,
        },
        {
          description: "Holiday Requests",
          permitted: role.can?(:view, :holiday_requests_page),
          path: @path.holiday_requests_path,
        },
        {
          description: "Security Shift Review",
          permitted: role.can?(:view, :security_shift_request_reviews),
          path: @path.security_shift_request_reviews_path,
        },
        {
          description: "Staff Vetting",
          permitted: role.can?(:view, :staff_vetting_page),
          path: @path.staff_vetting_index_path,
        },
        {
          description: "Staff Tracking",
          permitted: role.can?(:view, :staff_tracking_page),
          path: @path.staff_tracking_index_path,
        },
      ],
    }

    admin_venues = {
      name: "Admin: Venue",
      color: "#f39c12",
      items: [
        {
          description: "Checklist Submissions",
          permitted: role.can?(:view, :check_list_submissions_page),
          path: @path.check_list_submissions_path,
        },
        {
          description: "Accessories",
          permitted: role.can?(:view, :accessories_page),
          path: @path.accessories_path,
        },
        {
          description: "Accessory Requests",
          permitted: role.can?(:view, :accessory_requests_page),
          path: @path.accessory_requests_path,
        },
        {
          description: "Security Venues",
          permitted: role.can?(:view, :security_venues),
          path: @path.security_venues_path,
        },
      ],
    }

    admin_reports = {
      name: "Admin: Reports",
      color: "#f39c12",
      items: [
        {
          description: "Fruit Order Report",
          permitted: role.can?(:view, :fruit_order_reports),
          path: @path.fruit_order_reports_path,
        },
        {
          description: "Change Order Report",
          permitted: role.can?(:view, :change_order_reports),
          path: @path.change_order_reports_path,
        },
        {
          description: "Finance Report",
          permitted: role.can?(:view, :finance_reports),
          path: @path.finance_reports_path,
        },
        {
          description: "Yearly Report",
          permitted: role.can?(:view, :yearly_reports),
          path: @path.yearly_reports_path,
        },
      ],
    }

    admin_wtl = {
      name: "Admin: WTL",
      color: "#e67e22",
      items: [
        {
          description: "WTL Cards",
          permitted: true,
          path: @path.wtl_cards_path,
        },
        {
          description: "WTL Clients",
          permitted: true,
          path: @path.wtl_clients_path,
        },
      ],
    }

    dev_section = {
      name: "Dev",
      color: "#f39c12",
      items: [
        {
          description: "Security App SSE Test",
          permitted: role.can?(:view, :sse_tests),
          path: @path.secruity_app_sse_test_dev_path,
        },
      ],
    }

    menu = []

    menu << venue if venue.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << security if security.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << staff_members if staff_members.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << reports if reports.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << applications if applications.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << admin_general if admin_general.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << admin_users if admin_users.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << admin_staff_members if admin_staff_members.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << admin_venues if admin_venues.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << admin_reports if admin_reports.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << admin_wtl if admin_wtl.fetch(:items).any? { |item_data| item_data.fetch(:permitted) }

    menu << dev_section if dev_section.fetch(:items).any? { |item_data| item_data.fetch(:permitted) }

    quick_menu = menu.map do |parent_item|
      parent_item[:items] = parent_item[:items].map do |child_item|
        child_item if child_item[:permitted]
      end.compact
      parent_item
    end

    venues = ActiveModel::Serializer::CollectionSerializer.new(
      AccessibleVenuesQuery.new(user).all,
      serializer: Api::V1::VenueSerializer,
    )

    {quick_menu: quick_menu, venues: venues}
  end
end
