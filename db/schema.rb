# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170508202806) do

  create_table "access_tokens", force: :cascade do |t|
    t.string   "token",           limit: 255, null: false
    t.integer  "staff_member_id", limit: 4
    t.integer  "user_id",         limit: 4
    t.datetime "expires_at"
    t.string   "token_type",      limit: 255, null: false
    t.integer  "creator_id",      limit: 4,   null: false
    t.string   "creator_type",    limit: 255, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "api_key_id",      limit: 4
  end

  add_index "access_tokens", ["token"], name: "index_access_tokens_on_token", using: :btree
  add_index "access_tokens", ["user_id"], name: "index_access_tokens_on_user_id", using: :btree

  create_table "addresses", force: :cascade do |t|
    t.string   "county",     limit: 255
    t.string   "country",    limit: 255
    t.string   "postcode",   limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "address",    limit: 65535
  end

  create_table "api_key_transitions", force: :cascade do |t|
    t.string   "to_state",    limit: 255,   null: false
    t.text     "metadata",    limit: 65535
    t.integer  "sort_key",    limit: 4,     null: false
    t.integer  "api_key_id",  limit: 4,     null: false
    t.boolean  "most_recent"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "api_key_transitions", ["api_key_id", "most_recent"], name: "index_api_key_transitions_parent_most_recent", unique: true, using: :btree
  add_index "api_key_transitions", ["api_key_id", "sort_key"], name: "index_api_key_transitions_parent_sort", unique: true, using: :btree

  create_table "api_keys", force: :cascade do |t|
    t.integer  "user_id",    limit: 4,   null: false
    t.string   "key",        limit: 255, null: false
    t.integer  "venue_id",   limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "key_type",   limit: 255, null: false
  end

  create_table "backups", force: :cascade do |t|
    t.integer  "size",       limit: 4,   default: 0, null: false
    t.string   "dump",       limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "change_order_transitions", force: :cascade do |t|
    t.string   "to_state",        limit: 255,   null: false
    t.text     "metadata",        limit: 65535
    t.integer  "sort_key",        limit: 4,     null: false
    t.integer  "change_order_id", limit: 4,     null: false
    t.boolean  "most_recent"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  add_index "change_order_transitions", ["change_order_id", "most_recent"], name: "index_change_order_transitions_parent_most_recent", unique: true, using: :btree
  add_index "change_order_transitions", ["change_order_id", "sort_key"], name: "index_change_order_transitions_parent_sort", unique: true, using: :btree

  create_table "change_orders", force: :cascade do |t|
    t.integer  "venue_id",           limit: 4, null: false
    t.integer  "five_pound_notes",   limit: 4, null: false
    t.integer  "one_pound_coins",    limit: 4, null: false
    t.integer  "fifty_pence_coins",  limit: 4, null: false
    t.integer  "twenty_pence_coins", limit: 4, null: false
    t.integer  "ten_pence_coins",    limit: 4, null: false
    t.integer  "five_pence_coins",   limit: 4, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "clock_in_breaks", force: :cascade do |t|
    t.integer  "clock_in_period_id", limit: 4, null: false
    t.datetime "starts_at",                    null: false
    t.datetime "ends_at",                      null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "clock_in_breaks", ["clock_in_period_id"], name: "index_clock_in_breaks_on_clock_in_period_id", using: :btree

  create_table "clock_in_days", force: :cascade do |t|
    t.date     "date",                        null: false
    t.integer  "staff_member_id", limit: 4,   null: false
    t.integer  "venue_id",        limit: 4,   null: false
    t.integer  "creator_id",      limit: 4,   null: false
    t.string   "creator_type",    limit: 255, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "clock_in_events", force: :cascade do |t|
    t.string   "event_type",         limit: 255, null: false
    t.integer  "creator_id",         limit: 4,   null: false
    t.string   "creator_type",       limit: 255, null: false
    t.datetime "at",                             null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "clock_in_period_id", limit: 4,   null: false
  end

  add_index "clock_in_events", ["at"], name: "index_clock_in_events_on_at", using: :btree
  add_index "clock_in_events", ["clock_in_period_id"], name: "index_clock_in_events_on_clock_in_period_id", using: :btree

  create_table "clock_in_notes", force: :cascade do |t|
    t.integer  "creator_id",      limit: 4,                  null: false
    t.string   "creator_type",    limit: 255,                null: false
    t.string   "note",            limit: 255,                null: false
    t.boolean  "enabled",                     default: true, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "clock_in_day_id", limit: 4,                  null: false
  end

  add_index "clock_in_notes", ["clock_in_day_id"], name: "index_clock_in_notes_on_clock_in_day_id", using: :btree

  create_table "clock_in_periods", force: :cascade do |t|
    t.integer  "creator_id",      limit: 4,   null: false
    t.datetime "starts_at",                   null: false
    t.datetime "ends_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "clock_in_day_id", limit: 4,   null: false
    t.string   "creator_type",    limit: 255, null: false
  end

  add_index "clock_in_periods", ["clock_in_day_id"], name: "index_clock_in_periods_on_clock_in_day_id", using: :btree

  create_table "cron_jobs", force: :cascade do |t|
    t.string   "method",      limit: 255,   null: false
    t.text     "output",      limit: 65535
    t.datetime "started_at",                null: false
    t.datetime "finished_at"
    t.string   "error",       limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "cron_jobs", ["started_at"], name: "index_cron_jobs_on_started_at", using: :btree

  create_table "daily_report_staff_member_listings", force: :cascade do |t|
    t.integer  "daily_report_staff_member_section_id", limit: 4,   null: false
    t.integer  "staff_member_id",                      limit: 4,   null: false
    t.string   "pay_rate_name",                        limit: 255, null: false
    t.integer  "pay_rate_cents",                       limit: 4,   null: false
    t.string   "pay_rate_text_description_short",      limit: 255, null: false
    t.string   "pay_rate_calculation_type",            limit: 255, null: false
    t.boolean  "pay_rate_admin",                                   null: false
    t.integer  "rotaed_cost_cents",                    limit: 4,   null: false
    t.integer  "actual_cost_cents",                    limit: 4,   null: false
    t.float    "rotaed_hours",                         limit: 24,  null: false
    t.float    "worked_hours",                         limit: 24,  null: false
    t.float    "break_hours",                          limit: 24,  null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "daily_report_staff_member_listings", ["daily_report_staff_member_section_id"], name: "daily_report_section_index", using: :btree
  add_index "daily_report_staff_member_listings", ["staff_member_id"], name: "index_daily_report_staff_member_listings_on_staff_member_id", using: :btree

  create_table "daily_report_staff_member_sections", force: :cascade do |t|
    t.integer  "daily_report_id",     limit: 4, null: false
    t.integer  "staff_type_id",       limit: 4, null: false
    t.integer  "overhead_cost_cents", limit: 4, null: false
    t.integer  "rotaed_cost_cents",   limit: 4, null: false
    t.integer  "actual_cost_cents",   limit: 4, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "daily_report_staff_member_sections", ["daily_report_id"], name: "index_daily_report_staff_member_sections_on_daily_report_id", using: :btree
  add_index "daily_report_staff_member_sections", ["staff_type_id"], name: "index_daily_report_staff_member_sections_on_staff_type_id", using: :btree

  create_table "daily_reports", force: :cascade do |t|
    t.integer  "venue_id",                     limit: 4, null: false
    t.date     "date",                                   null: false
    t.integer  "overheads_cents",              limit: 4, null: false
    t.integer  "rotaed_cost_cents",            limit: 4, null: false
    t.integer  "actual_cost_cents",            limit: 4, null: false
    t.datetime "last_calculated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "last_update_requested_at"
    t.datetime "last_update_request_serviced"
  end

  add_index "daily_reports", ["venue_id", "date"], name: "index_daily_reports_on_venue_id_and_date", using: :btree

  create_table "email_addresses", force: :cascade do |t|
    t.string   "email",      limit: 255, null: false
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "email_addresses", ["email"], name: "index_email_addresses_on_email", using: :btree

  create_table "finance_reports", force: :cascade do |t|
    t.integer  "staff_member_id",         limit: 4,   null: false
    t.string   "staff_member_name",       limit: 255, null: false
    t.integer  "venue_id",                limit: 4,   null: false
    t.string   "venue_name",              limit: 255, null: false
    t.date     "week_start",                          null: false
    t.float    "monday_hours_count",      limit: 24,  null: false
    t.float    "tuesday_hours_count",     limit: 24,  null: false
    t.float    "wednesday_hours_count",   limit: 24,  null: false
    t.float    "thursday_hours_count",    limit: 24,  null: false
    t.float    "friday_hours_count",      limit: 24,  null: false
    t.float    "saturday_hours_count",    limit: 24,  null: false
    t.float    "sunday_hours_count",      limit: 24,  null: false
    t.float    "total_hours_count",       limit: 24,  null: false
    t.integer  "total_cents",             limit: 4,   null: false
    t.integer  "holiday_days_count",      limit: 4,   null: false
    t.integer  "owed_hours_minute_count", limit: 4,   null: false
    t.string   "pay_rate_description",    limit: 255, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "finance_reports", ["staff_member_id"], name: "index_finance_reports_on_staff_member_id", using: :btree
  add_index "finance_reports", ["venue_id"], name: "index_finance_reports_on_venue_id", using: :btree
  add_index "finance_reports", ["week_start", "staff_member_id"], name: "index_finance_reports_on_week_start_and_staff_member_id", unique: true, using: :btree
  add_index "finance_reports", ["week_start"], name: "index_finance_reports_on_week_start", using: :btree

  create_table "first_name_groups", force: :cascade do |t|
    t.boolean  "enabled",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "first_name_options", force: :cascade do |t|
    t.integer  "first_name_group_id", limit: 4,   null: false
    t.string   "name",                limit: 255, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "fruit_order_transitions", force: :cascade do |t|
    t.string   "to_state",       limit: 255,   null: false
    t.text     "metadata",       limit: 65535
    t.integer  "sort_key",       limit: 4,     null: false
    t.integer  "fruit_order_id", limit: 4,     null: false
    t.boolean  "most_recent"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
  end

  add_index "fruit_order_transitions", ["fruit_order_id", "most_recent"], name: "index_fruit_order_transitions_parent_most_recent", unique: true, using: :btree
  add_index "fruit_order_transitions", ["fruit_order_id", "sort_key"], name: "index_fruit_order_transitions_parent_sort", unique: true, using: :btree

  create_table "fruit_orders", force: :cascade do |t|
    t.integer  "venue_id",           limit: 4, null: false
    t.integer  "limes",              limit: 4, null: false
    t.integer  "lemons",             limit: 4, null: false
    t.integer  "rasberries",         limit: 4, null: false
    t.integer  "blueberries",        limit: 4, null: false
    t.integer  "blackberries",       limit: 4, null: false
    t.integer  "green_apples",       limit: 4, null: false
    t.integer  "oranges",            limit: 4, null: false
    t.integer  "passion_fruits",     limit: 4, null: false
    t.integer  "lychees",            limit: 4, null: false
    t.integer  "cucumbers",          limit: 4, null: false
    t.integer  "kumkwats",           limit: 4, null: false
    t.integer  "dragon_fruits",      limit: 4, null: false
    t.integer  "watermelon",         limit: 4, null: false
    t.integer  "pink_grapefruit",    limit: 4, null: false
    t.integer  "plums",              limit: 4, null: false
    t.integer  "deskinned_coconuts", limit: 4, null: false
    t.integer  "fresh_mint",         limit: 4, null: false
    t.integer  "fresh_basil",        limit: 4, null: false
    t.integer  "fresh_lavender",     limit: 4, null: false
    t.integer  "rosemary",           limit: 4, null: false
    t.integer  "thyme",              limit: 4, null: false
    t.integer  "red_roses",          limit: 4, null: false
    t.integer  "kaffir_lime_leaves", limit: 4, null: false
    t.integer  "fresh_ginger",       limit: 4, null: false
    t.integer  "bananas",            limit: 4, null: false
    t.integer  "maraschino_cherry",  limit: 4, null: false
    t.integer  "cream",              limit: 4, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "sharon_fruits",      limit: 4, null: false
    t.integer  "figs",               limit: 4, null: false
    t.integer  "blood_oranges",      limit: 4, null: false
    t.integer  "pomegranates",       limit: 4, null: false
    t.integer  "pineapples",         limit: 4, null: false
    t.integer  "strawberries",       limit: 4, null: false
    t.integer  "cranberries",        limit: 4, null: false
    t.integer  "eggs",               limit: 4, null: false
    t.integer  "kiwi_fruits",        limit: 4, null: false
    t.integer  "vanilla_pods",       limit: 4, null: false
    t.integer  "edible_flowers",     limit: 4, null: false
  end

  add_index "fruit_orders", ["venue_id"], name: "index_fruit_orders_on_venue_id", using: :btree

  create_table "holiday_transitions", force: :cascade do |t|
    t.string   "to_state",    limit: 255,   null: false
    t.text     "metadata",    limit: 65535
    t.integer  "sort_key",    limit: 4,     null: false
    t.integer  "holiday_id",  limit: 4,     null: false
    t.boolean  "most_recent"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "holiday_transitions", ["holiday_id", "most_recent"], name: "index_holiday_transitions_parent_most_recent", unique: true, using: :btree
  add_index "holiday_transitions", ["holiday_id", "sort_key"], name: "index_holiday_transitions_parent_sort", unique: true, using: :btree

  create_table "holidays", force: :cascade do |t|
    t.date     "start_date",                                null: false
    t.date     "end_date",                                  null: false
    t.string   "holiday_type",                limit: 255,   null: false
    t.integer  "creator_user_id",             limit: 4,     null: false
    t.integer  "staff_member_id",             limit: 4,     null: false
    t.text     "note",                        limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "parent_holiday_id",           limit: 4
    t.integer  "frozen_by_finance_report_id", limit: 4
  end

  add_index "holidays", ["end_date"], name: "index_holidays_on_end_date", using: :btree
  add_index "holidays", ["holiday_type"], name: "index_holidays_on_holiday_type", using: :btree
  add_index "holidays", ["staff_member_id"], name: "index_holidays_on_staff_member_id", using: :btree
  add_index "holidays", ["start_date"], name: "index_holidays_on_start_date", using: :btree

  create_table "hours_acceptance_breaks", force: :cascade do |t|
    t.integer  "hours_acceptance_period_id", limit: 4,   null: false
    t.datetime "starts_at",                              null: false
    t.datetime "ends_at",                                null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "disabled_at"
    t.integer  "disabled_by_id",             limit: 4
    t.string   "disabled_by_type",           limit: 255
  end

  add_index "hours_acceptance_breaks", ["hours_acceptance_period_id"], name: "index_hours_acceptance_breaks_on_hours_acceptance_period_id", using: :btree

  create_table "hours_acceptance_periods", force: :cascade do |t|
    t.integer  "creator_id",                  limit: 4,                       null: false
    t.string   "creator_type",                limit: 255,                     null: false
    t.string   "reason_note",                 limit: 255
    t.datetime "starts_at",                                                   null: false
    t.datetime "ends_at",                                                     null: false
    t.integer  "clock_in_day_id",             limit: 4
    t.string   "status",                      limit: 255, default: "pending", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "frozen_by_finance_report_id", limit: 4
  end

  add_index "hours_acceptance_periods", ["clock_in_day_id"], name: "index_hours_acceptance_periods_on_clock_in_day_id", using: :btree
  add_index "hours_acceptance_periods", ["status"], name: "index_hours_acceptance_periods_on_status", using: :btree

  create_table "invite_transitions", force: :cascade do |t|
    t.string   "to_state",    limit: 255,   null: false
    t.text     "metadata",    limit: 65535
    t.integer  "sort_key",    limit: 4,     null: false
    t.integer  "invite_id",   limit: 4,     null: false
    t.boolean  "most_recent"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "invite_transitions", ["invite_id", "most_recent"], name: "index_invite_transitions_parent_most_recent", unique: true, using: :btree
  add_index "invite_transitions", ["invite_id", "sort_key"], name: "index_invite_transitions_parent_sort", unique: true, using: :btree

  create_table "invites", force: :cascade do |t|
    t.string   "role",        limit: 255,   null: false
    t.integer  "inviter_id",  limit: 4,     null: false
    t.integer  "user_id",     limit: 4
    t.string   "token",       limit: 255,   null: false
    t.string   "email",       limit: 255,   null: false
    t.integer  "revoker_id",  limit: 4
    t.datetime "revoked_at"
    t.datetime "sent_at"
    t.datetime "accepted_at"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.text     "venue_ids",   limit: 65535
  end

  add_index "invites", ["accepted_at"], name: "index_invites_on_accepted_at", using: :btree
  add_index "invites", ["email"], name: "index_invites_on_email", using: :btree
  add_index "invites", ["inviter_id"], name: "index_invites_on_inviter_id", using: :btree
  add_index "invites", ["role"], name: "index_invites_on_role", using: :btree
  add_index "invites", ["sent_at"], name: "index_invites_on_sent_at", using: :btree
  add_index "invites", ["token"], name: "index_invites_on_token", unique: true, using: :btree

  create_table "legacy_rota_forecasts", force: :cascade do |t|
    t.integer  "rota_id",               limit: 4
    t.integer  "forecasted_take_cents", limit: 4
    t.integer  "total_cents",           limit: 4
    t.integer  "staff_total_cents",     limit: 4
    t.integer  "pr_total_cents",        limit: 4
    t.integer  "kitchen_total_cents",   limit: 4
    t.integer  "security_total_cents",  limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "legacy_rota_forecasts", ["rota_id"], name: "index_legacy_rota_forecasts_on_rota_id", using: :btree

  create_table "names", force: :cascade do |t|
    t.string   "first_name", limit: 255, null: false
    t.string   "surname",    limit: 255, null: false
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "names", ["first_name"], name: "index_names_on_first_name", using: :btree
  add_index "names", ["surname"], name: "index_names_on_surname", using: :btree

  create_table "owed_hours", force: :cascade do |t|
    t.date     "date",                                                     null: false
    t.integer  "minutes",                     limit: 4,                    null: false
    t.integer  "creator_user_id",             limit: 4,                    null: false
    t.integer  "staff_member_id",             limit: 4,                    null: false
    t.text     "note",                        limit: 65535,                null: false
    t.integer  "parent_owed_hour_id",         limit: 4
    t.datetime "disabled_at"
    t.integer  "disabled_by_user_id",         limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "frozen_by_finance_report_id", limit: 4
    t.boolean  "require_times",                             default: true, null: false
    t.datetime "starts_at"
    t.datetime "ends_at"
  end

  add_index "owed_hours", ["date"], name: "index_owed_hours_on_date", using: :btree

  create_table "pay_rates", force: :cascade do |t|
    t.string  "pay_rate_type",    limit: 255,                null: false
    t.string  "name",             limit: 255
    t.integer "cents",            limit: 4,                  null: false
    t.boolean "enabled",                      default: true, null: false
    t.string  "calculation_type", limit: 255,                null: false
  end

  add_index "pay_rates", ["pay_rate_type"], name: "index_pay_rates_on_pay_rate_type", using: :btree

  create_table "pool_loft_table_session_edits", force: :cascade do |t|
    t.string   "guid",                 limit: 255, null: false
    t.integer  "table_session_id",     limit: 4,   null: false
    t.string   "table_session_guid",   limit: 255, null: false
    t.integer  "admin_token_id",       limit: 4,   null: false
    t.string   "admin_token_guid",     limit: 255, null: false
    t.integer  "old_duration_seconds", limit: 4,   null: false
    t.integer  "new_duration_seconds", limit: 4,   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "pool_loft_table_sessions", force: :cascade do |t|
    t.string   "guid",             limit: 255, null: false
    t.integer  "table_id",         limit: 4,   null: false
    t.string   "table_guid",       limit: 255, null: false
    t.string   "table_name",       limit: 255, null: false
    t.string   "table_type",       limit: 255, null: false
    t.boolean  "edited_by_admin",              null: false
    t.datetime "starts_at",                    null: false
    t.integer  "duration_seconds", limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rota_forecasts", force: :cascade do |t|
    t.integer  "rota_id",               limit: 4, null: false
    t.integer  "forecasted_take_cents", limit: 4, null: false
    t.integer  "overhead_total_cents",  limit: 4, null: false
    t.integer  "total_cents",           limit: 4, null: false
    t.integer  "staff_total_cents",     limit: 4, null: false
    t.integer  "pr_total_cents",        limit: 4, null: false
    t.integer  "kitchen_total_cents",   limit: 4, null: false
    t.integer  "security_total_cents",  limit: 4, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "rota_forecasts", ["rota_id"], name: "index_rota_forecasts_on_rota_id", using: :btree

  create_table "rota_shifts", force: :cascade do |t|
    t.integer  "creator_id",          limit: 4
    t.datetime "starts_at",                                      null: false
    t.datetime "ends_at",                                        null: false
    t.integer  "staff_member_id",     limit: 4,                  null: false
    t.integer  "rota_id",             limit: 4,                  null: false
    t.datetime "created_at",                                     null: false
    t.datetime "updated_at",                                     null: false
    t.boolean  "enabled",                         default: true, null: false
    t.datetime "disabled_at"
    t.integer  "disabled_by_user_id", limit: 4
    t.string   "shift_type",          limit: 255,                null: false
  end

  add_index "rota_shifts", ["creator_id"], name: "index_rota_shifts_on_creator_id", using: :btree
  add_index "rota_shifts", ["enabled"], name: "index_rota_shifts_on_enabled", using: :btree
  add_index "rota_shifts", ["ends_at"], name: "index_rota_shifts_on_ends_at", using: :btree
  add_index "rota_shifts", ["rota_id"], name: "index_rota_shifts_on_rota_id", using: :btree
  add_index "rota_shifts", ["staff_member_id"], name: "index_rota_shifts_on_staff_member_id", using: :btree
  add_index "rota_shifts", ["starts_at"], name: "index_rota_shifts_on_starts_at", using: :btree

  create_table "rota_status_transitions", force: :cascade do |t|
    t.string   "to_state",    limit: 255,   null: false
    t.text     "metadata",    limit: 65535
    t.integer  "sort_key",    limit: 4,     null: false
    t.integer  "rota_id",     limit: 4,     null: false
    t.boolean  "most_recent"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "rota_status_transitions", ["rota_id", "most_recent"], name: "index_rota_status_transitions_parent_most_recent", unique: true, using: :btree
  add_index "rota_status_transitions", ["rota_id", "sort_key"], name: "index_rota_status_transitions_parent_sort", unique: true, using: :btree

  create_table "rotas", force: :cascade do |t|
    t.date     "date",                 null: false
    t.integer  "creator_id", limit: 4, null: false
    t.integer  "venue_id",   limit: 4, null: false
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  add_index "rotas", ["creator_id"], name: "index_rotas_on_creator_id", using: :btree
  add_index "rotas", ["date", "venue_id"], name: "index_rotas_on_date_and_venue_id", unique: true, using: :btree
  add_index "rotas", ["venue_id"], name: "index_rotas_on_venue_id", using: :btree

  create_table "safe_check_notes", force: :cascade do |t|
    t.integer  "created_by_user_id",  limit: 4,     null: false
    t.datetime "disabled_at"
    t.integer  "disabled_by_user_id", limit: 4
    t.integer  "safe_check_id",       limit: 4,     null: false
    t.string   "note_left_by_note",   limit: 255,   null: false
    t.text     "note_text",           limit: 65535, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "safe_checks", force: :cascade do |t|
    t.integer  "venue_id",                 limit: 4,   null: false
    t.integer  "creator_user_id",          limit: 4,   null: false
    t.string   "checked_by_note",          limit: 255, null: false
    t.integer  "fifty_pound_note_pounds",  limit: 4,   null: false
    t.integer  "twenty_pound_note_pounds", limit: 4,   null: false
    t.integer  "ten_pound_note_pounds",    limit: 4,   null: false
    t.integer  "five_pound_note_pounds",   limit: 4,   null: false
    t.integer  "two_pound_coins_pounds",   limit: 4,   null: false
    t.integer  "one_pound_coins_pounds",   limit: 4,   null: false
    t.integer  "fifty_pence_coins_cents",  limit: 4,   null: false
    t.integer  "twenty_pence_coins_cents", limit: 4,   null: false
    t.integer  "ten_pence_coins_cents",    limit: 4,   null: false
    t.integer  "five_pence_coins_cents",   limit: 4,   null: false
    t.integer  "coppers_cents",            limit: 4,   null: false
    t.integer  "safe_float_cents",         limit: 4,   null: false
    t.integer  "till_float_cents",         limit: 4,   null: false
    t.integer  "out_to_order_cents",       limit: 4,   null: false
    t.integer  "other_cents",              limit: 4,   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "payouts_cents",            limit: 4,   null: false
  end

  add_index "safe_checks", ["created_at", "venue_id"], name: "index_safe_checks_on_created_at_and_venue_id", using: :btree

  create_table "staff_member_transitions", force: :cascade do |t|
    t.string   "to_state",        limit: 255,   null: false
    t.text     "metadata",        limit: 65535
    t.integer  "sort_key",        limit: 4,     null: false
    t.integer  "staff_member_id", limit: 4,     null: false
    t.boolean  "most_recent"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  add_index "staff_member_transitions", ["staff_member_id", "most_recent"], name: "index_staff_member_transitions_parent_most_recent", unique: true, using: :btree
  add_index "staff_member_transitions", ["staff_member_id", "sort_key"], name: "index_staff_member_transitions_parent_sort", unique: true, using: :btree

  create_table "staff_member_venues", force: :cascade do |t|
    t.integer  "staff_member_id", limit: 4, null: false
    t.integer  "venue_id",        limit: 4, null: false
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "staff_members", force: :cascade do |t|
    t.integer  "address_id",                            limit: 4
    t.string   "gender",                                limit: 255,                   null: false
    t.string   "phone_number",                          limit: 255
    t.datetime "date_of_birth"
    t.string   "national_insurance_number",             limit: 255
    t.text     "hours_preference_note",                 limit: 65535
    t.text     "day_perference_note",                   limit: 65535
    t.datetime "created_at",                                                          null: false
    t.datetime "updated_at",                                                          null: false
    t.integer  "name_id",                               limit: 4,                     null: false
    t.integer  "email_address_id",                      limit: 4
    t.string   "pin_code",                              limit: 255,                   null: false
    t.string   "avatar",                                limit: 255
    t.integer  "staff_type_id",                         limit: 4,                     null: false
    t.integer  "creator_id",                            limit: 4
    t.date     "starts_at",                                                           null: false
    t.boolean  "employment_status_a",                                                 null: false
    t.boolean  "employment_status_b",                                                 null: false
    t.boolean  "employment_status_c",                                                 null: false
    t.boolean  "employment_status_d",                                                 null: false
    t.datetime "shift_change_occured_at"
    t.integer  "pay_rate_id",                           limit: 4,                     null: false
    t.string   "sia_badge_number",                      limit: 255
    t.date     "sia_badge_expiry_date"
    t.boolean  "employment_status_statement_completed",               default: false, null: false
    t.boolean  "employment_status_p45_supplied",                                      null: false
    t.datetime "notified_of_sia_expiry_at"
    t.boolean  "would_rehire",                                        default: true,  null: false
    t.integer  "master_venue_id",                       limit: 4
  end

  add_index "staff_members", ["creator_id"], name: "index_staff_members_on_creator_id", using: :btree
  add_index "staff_members", ["name_id"], name: "index_staff_members_on_name_id", using: :btree
  add_index "staff_members", ["notified_of_sia_expiry_at"], name: "index_staff_members_on_notified_of_sia_expiry_at", using: :btree
  add_index "staff_members", ["phone_number"], name: "index_staff_members_on_phone_number", using: :btree
  add_index "staff_members", ["shift_change_occured_at"], name: "index_staff_members_on_shift_change_occured_at", using: :btree
  add_index "staff_members", ["sia_badge_expiry_date"], name: "index_staff_members_on_sia_badge_expiry_date", using: :btree
  add_index "staff_members", ["staff_type_id"], name: "index_staff_members_on_staff_type_id", using: :btree
  add_index "staff_members", ["would_rehire"], name: "index_staff_members_on_would_rehire", using: :btree

  create_table "staff_tracking_events", force: :cascade do |t|
    t.datetime "at",                          null: false
    t.string   "event_type",      limit: 255, null: false
    t.integer  "staff_member_id", limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "staff_tracking_events", ["at", "event_type"], name: "index_staff_tracking_events_on_at_and_event_type", using: :btree

  create_table "staff_types", force: :cascade do |t|
    t.string   "name",       limit: 255, null: false
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "ui_color",   limit: 255
    t.string   "role",       limit: 255, null: false
  end

  add_index "staff_types", ["name"], name: "index_staff_types_on_name", unique: true, using: :btree

  create_table "user_transitions", force: :cascade do |t|
    t.string   "to_state",    limit: 255,   null: false
    t.text     "metadata",    limit: 65535
    t.integer  "sort_key",    limit: 4,     null: false
    t.integer  "user_id",     limit: 4,     null: false
    t.boolean  "most_recent"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "user_transitions", ["user_id", "most_recent"], name: "index_user_transitions_parent_most_recent", unique: true, using: :btree
  add_index "user_transitions", ["user_id", "sort_key"], name: "index_user_transitions_parent_sort", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "encrypted_password",     limit: 255, default: "",   null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,    null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "role",                   limit: 255,                null: false
    t.boolean  "enabled",                            default: true, null: false
    t.integer  "failed_attempts",        limit: 4,   default: 0
    t.string   "unlock_token",           limit: 255
    t.datetime "locked_at"
    t.string   "confirmation_token",     limit: 255
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email",      limit: 255
    t.integer  "name_id",                limit: 4,                  null: false
    t.integer  "email_address_id",       limit: 4,                  null: false
    t.integer  "invite_id",              limit: 4
    t.boolean  "first"
    t.integer  "staff_member_id",        limit: 4
    t.boolean  "would_rehire",                       default: true, null: false
  end

  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["enabled"], name: "index_users_on_enabled", using: :btree
  add_index "users", ["invite_id"], name: "index_users_on_invite_id", using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["role"], name: "index_users_on_role", using: :btree
  add_index "users", ["staff_member_id"], name: "index_users_on_staff_member_id", using: :btree
  add_index "users", ["unlock_token"], name: "index_users_on_unlock_token", unique: true, using: :btree
  add_index "users", ["would_rehire"], name: "index_users_on_would_rehire", using: :btree

  create_table "venue_reminder_users", force: :cascade do |t|
    t.integer  "venue_id",   limit: 4, null: false
    t.integer  "user_id",    limit: 4, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "venue_users", force: :cascade do |t|
    t.integer  "user_id",    limit: 4, null: false
    t.integer  "venue_id",   limit: 4, null: false
    t.boolean  "enabled",              null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "venue_users", ["created_at"], name: "index_venue_users_on_created_at", using: :btree
  add_index "venue_users", ["enabled"], name: "index_venue_users_on_enabled", using: :btree

  create_table "venues", force: :cascade do |t|
    t.string   "name",               limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "creator_id",         limit: 4
    t.text     "fruit_order_fields", limit: 65535
    t.integer  "till_float_cents",   limit: 4,     null: false
    t.integer  "safe_float_cents",   limit: 4,     null: false
  end

  add_index "venues", ["creator_id"], name: "index_venues_on_creator_id", using: :btree
  add_index "venues", ["name"], name: "index_venues_on_name", using: :btree

  create_table "versions", force: :cascade do |t|
    t.string   "item_type",  limit: 255,        null: false
    t.integer  "item_id",    limit: 4,          null: false
    t.string   "event",      limit: 255,        null: false
    t.string   "whodunnit",  limit: 255
    t.text     "object",     limit: 4294967295
    t.datetime "created_at"
  end

  add_index "versions", ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id", using: :btree

end
