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
          permitted: role.can?(:manage, :machines),
          path: @path.machines_path
        },
        {
          description: "Machines Refloats",
          permitted: role.can?(:manage, :machines),
          path: @path.machine_refloats_path
        },
        {
          description: "Rota",
          permitted: role.can?(:manage, :rotas),
          path: @path.rotas_path
        },
        {
          description: "Security Rota",
          permitted: role.can?(:manage, :security_rota),
          path: @path.security_rotas_path
        },
        {
          description: "Change Orders",
          permitted: role.can?(:manage, :change_orders),
          path: @path.change_orders_path
        },
        {
          description: "Fruit Orders",
          permitted: role.can?(:manage, :fruit_orders),
          path: @path.fruit_orders_path
        },
        {
          description: "Check Lists",
          permitted: role.can?(:manage, :check_lists),
          path: @path.check_lists_path
        },
        {
          description: "Safe Checks",
          permitted: role.can?(:manage, :safe_checks),
          path: @path.safe_checks_path
        },
        {
          description: "Venue Health Check",
          permitted: role.can?(:manage, :venue_health_checks),
          path: @path.venue_health_check_index_path
        },
        {
          description: "Incident Reports",
          permitted: role.can?(:manage, :incident_reports),
          path: @path.incident_reports_path
        },
        {
          description: "Vouchers",
          permitted: role.can?(:manage, :vouchers),
          path: @path.vouchers_path
        },
        {
          description: "Reedem Vouchers",
          permitted: role.can?(:manage, :vouchers),
          path: @path.redeem_vouchers_path
        },
        {
          description: "Maintenance Tasks",
          permitted: role.can?(:view, :maintenance_tasks),
          path: @path.maintenance_index_path
        },
        {
          description: "Venue Dashboard",
          permitted: role.can?(:view, :venue_dashboard),
          path: @path.venue_dashboard_path
        },
      ]
    }

    staff_members = {
      name: "Staff Members",
      color: "#27ae60",
      items: [
        {
          description: "Hours Confirmation",
          permitted: role.can?(:view, :hours_confirmation_page),
          path: @path.current_hours_confirmation_index_path
        },
        {
          description: "Holidays",
          permitted: role.can?(:view, :holidays),
          path: @path.holidays_path(date: UIRotaDate.format(Time.zone.now.to_date.monday))
        },
        {
          description: "Staff Members List",
          permitted: role.can?(:list, :staff_members),
          path: @path.staff_members_path
        },
        {
          description: "Add Staff Member",
          permitted: role.can?(:create, :staff_members),
          path: @path.new_staff_member_path
        }
      ]
    }

    reports = {
      name: "Reports",
      color: "#9b59b6",
      items: [
        {
          description: "Daily Report",
          permitted: role.can?(:view, :daily_reports),
          path: @path.daily_reports_path
        },
        {
          description: "Weekly Report",
          permitted: role.can?(:view, :weekly_reports),
          path: @path.weekly_reports_path
        },
        {
          description: "Payroll Report",
          permitted: role.can?(:view, :payroll_reports),
          path: @path.payroll_reports_path
        }
      ]
    }

    admin_general = {
      name: "Admin: General",
      color: "#e67e22",
      items: [
        {
          description: "Names",
          permitted: role.can?(:view, :names_page),
          path: @path.names_path
        },
        {
          description: "Venues",
          permitted: role.can?(:manage, :admin),
          path: @path.venues_path
        },
        {
          description: 'API Keys',
          permitted: role.can?(:view, :api_keys_page),
          path: @path.api_keys_path,
        },
        {
          description: "Dashboard Messages",
          permitted: role.can?(:manage, :admin),
          path: @path.message_board_path
        },
      ]
    }

    admin_users = {
      name: "Admin: Users",
      color: "#1abc9c",
      items: [
        {
          description: "Users",
          permitted: role.can?(:view, :users_page),
          path: @path.users_path
        },
        {
          description: "Invites",
          permitted: role.can?(:manage, :user_invites),
          path: @path.invites_path
        }
      ]
    }

    admin_staff_members = {
      name: "Admin: Staff Members",
      color: "#3498db",
      items: [
        {
          description: "Staff Type",
          permitted: role.can?(:view, :staff_types_page),
          path: @path.staff_types_path
        },
        {
          description: "Pay Rates",
          permitted: role.can?(:view, :pay_rates_page),
          path: @path.pay_rates_path
        },
        {
          description: "Staff Vetting",
          permitted: role.can?(:manage, :admin),
          path: @path.staff_vetting_index_path
        },
        {
          description: "Staff Tracking",
          permitted: role.can?(:view, :staff_tracking_page),
          path: @path.staff_tracking_index_path
        }
      ]
    }

    admin_venues = {
      name: "Admin: Venue",
      color: "#f39c12",
      items: [
        {
          description: "Checklist Submissions",
          permitted: role.can?(:manage, :admin),
          path: @path.check_list_submissions_path
        },
        {
          description: "Accessories",
          permitted: role.can?(:view, :accessories_page),
          path: @path.accessories_path
        },
        {
          description: "Accessory Requests",
          permitted: role.can?(:manage, :admin),
          path: @path.accessory_requests_path
        }
      ]
    }

    admin_reports = {
      name: "Admin: Reports",
      color: "#f39c12",
      items: [
        {
          description: "Fruit Order Report",
          permitted: role.can?(:manage, :admin),
          path: @path.fruit_order_reports_path
        },
        {
          description: "Change Order Report",
          permitted: role.can?(:manage, :admin),
          path: @path.change_order_reports_path
        },
        {
          description: "Finance Report",
          permitted: role.can?(:view, :finance_reports),
          path: @path.finance_reports_path
        },
        {
          description: "Yearly Report",
          permitted: role.can?(:view, :yearly_reports),
          path: @path.yearly_reports_path
        }
      ]
    }

    dev_section = {
      name: "Dev",
      color: "#f39c12",
      items: [
        {
          description: "Security App SSE Test",
          permitted: role.can?(:view, :sse_tests),
          path: @path.secruity_app_sse_test_dev_path
        }
      ]
    }

    menu = []

    menu << venue if venue.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << staff_members if staff_members.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << reports if reports.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << admin_general if admin_general.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << admin_users if admin_users.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << admin_staff_members if admin_staff_members.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << admin_venues if admin_venues.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }
    menu << admin_reports if admin_reports.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }

    menu << dev_section if dev_section.fetch(:items).any?{ |item_data| item_data.fetch(:permitted) }

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

    { quick_menu: quick_menu, venues: venues }
  end
end
