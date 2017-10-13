class PermissionsPageData
  def initialize(user:)
    @role = Ability.new(user)
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
          permitted: true,
          path: @path.machines_path
        },
        {
          description: "Machines Refloats",
          permitted: true,
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
          permitted: user.present? && !user.security_manager?,
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
        }
      ]
    }

    staff_members = {
      name: "Staff Members",
      color: "#27ae60",
      items: [
        {
          description: "Hours Confirmation",
          permitted: user.present? && !user.security_manager?,
          path: @path.current_hours_confirmation_index_path
        },
        {
          description: "Holidays",
          permitted: role.can?(:view, :holidays),
          path: @path.holidays_path(date: UIRotaDate.format(Time.zone.now.to_date.monday))
        },
        {
          description: "Staff Members List",
          permitted: role.can?(:manage, :staff_members),
          path: @path.staff_members_path
        },
        {
          description: "Add Staff Member",
          permitted: role.can?(:manage, :staff_members),
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
          path: @path.names_path
        },
        {
          description: "Venues",
          path: @path.venues_path
        },
        {
          description: 'API Keys',
          path: @path.api_keys_path,
        }
      ]
    }

    admin_users = {
      name: "Admin: Users",
      color: "#1abc9c",
      items: [
        {
          description: "Users",
          path: @path.users_path
        },
        {
          description: "Invites",
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
          path: @path.staff_types_path
        },
        {
          description: "Pay Rates",
          path: @path.pay_rates_path
        },
        {
          description: "Staff Vetting",
          path: @path.staff_vetting_index_path
        },
        {
          description: "Staff Tracking",
          path: @path.staff_tracking_index_path
        }
      ]
    }

    admin_reports = {
      name: "Admin: Reports",
      color: "#f39c12",
      items: [
        {
          description: "Fruit Order Report",
          path: @path.fruit_order_reports_path
        },
        {
          description: "Change Order Report",
          path: @path.change_order_reports_path
        },
        {
          description: "Finance Report",
          path: @path.finance_reports_path
        },
        {
          description: "Yearly Report",
          path: @path.yearly_reports_path
        }
      ]
    }

    menu = [
      venue,
      staff_members,
      reports
    ]

    admin_menu = [
      admin_general,
      admin_users,
      admin_staff_members,
      admin_reports,
    ]


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

    if role.can?(:manage, :admin)
      { quick_menu: (quick_menu + admin_menu), venues: venues }
    else
      { quick_menu: quick_menu, venues: venues }
    end
  end
end
