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

ActiveRecord::Schema.define(version: 20160113000112) do

  create_table "addresses", force: :cascade do |t|
    t.string   "address_1",  limit: 255
    t.string   "address_2",  limit: 255
    t.string   "address_3",  limit: 255
    t.string   "address_4",  limit: 255
    t.string   "region",     limit: 255
    t.string   "country",    limit: 255
    t.string   "postcode",   limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "backups", force: :cascade do |t|
    t.integer  "size",       limit: 4,   default: 0, null: false
    t.string   "dump",       limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cron_jobs", force: :cascade do |t|
    t.string   "method",      limit: 255, null: false
    t.string   "output",      limit: 255
    t.datetime "started_at",              null: false
    t.datetime "finished_at"
    t.string   "error",       limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "cron_jobs", ["started_at"], name: "index_cron_jobs_on_started_at", using: :btree

  create_table "email_addresses", force: :cascade do |t|
    t.string   "email",      limit: 255, null: false
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "email_addresses", ["email"], name: "index_email_addresses_on_email", using: :btree

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
    t.string   "role",        limit: 255, null: false
    t.integer  "inviter_id",  limit: 4,   null: false
    t.integer  "user_id",     limit: 4
    t.string   "token",       limit: 255, null: false
    t.string   "email",       limit: 255, null: false
    t.integer  "revoker_id",  limit: 4
    t.datetime "revoked_at"
    t.datetime "sent_at"
    t.datetime "accepted_at"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  add_index "invites", ["accepted_at"], name: "index_invites_on_accepted_at", using: :btree
  add_index "invites", ["email"], name: "index_invites_on_email", using: :btree
  add_index "invites", ["inviter_id"], name: "index_invites_on_inviter_id", using: :btree
  add_index "invites", ["role"], name: "index_invites_on_role", using: :btree
  add_index "invites", ["sent_at"], name: "index_invites_on_sent_at", using: :btree
  add_index "invites", ["token"], name: "index_invites_on_token", unique: true, using: :btree

  create_table "names", force: :cascade do |t|
    t.string   "first_name", limit: 255, null: false
    t.string   "surname",    limit: 255, null: false
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "names", ["first_name"], name: "index_names_on_first_name", using: :btree
  add_index "names", ["surname"], name: "index_names_on_surname", using: :btree

  create_table "staff_member_venues", force: :cascade do |t|
    t.integer  "staff_member_id", limit: 4, null: false
    t.integer  "venue_id",        limit: 4, null: false
    t.boolean  "enabled",                   null: false
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "staff_members", force: :cascade do |t|
    t.integer  "address_id",                limit: 4,                    null: false
    t.string   "gender",                    limit: 255,                  null: false
    t.string   "phone_number",              limit: 255,                  null: false
    t.boolean  "enabled",                                 default: true, null: false
    t.datetime "date_of_birth",                                          null: false
    t.string   "national_insurance_number", limit: 255
    t.text     "hours_preference_note",     limit: 65535
    t.text     "day_perference_note",       limit: 65535
    t.datetime "created_at",                                             null: false
    t.datetime "updated_at",                                             null: false
    t.integer  "name_id",                   limit: 4,                    null: false
    t.integer  "email_address_id",          limit: 4,                    null: false
    t.string   "pin_code",                  limit: 255,                  null: false
    t.string   "avatar",                    limit: 255
    t.integer  "staff_type_id",             limit: 4,                    null: false
    t.integer  "creator_id",                limit: 4
  end

  add_index "staff_members", ["creator_id"], name: "index_staff_members_on_creator_id", using: :btree
  add_index "staff_members", ["enabled"], name: "index_staff_members_on_enabled", using: :btree
  add_index "staff_members", ["phone_number"], name: "index_staff_members_on_phone_number", using: :btree
  add_index "staff_members", ["staff_type_id"], name: "index_staff_members_on_staff_type_id", using: :btree

  create_table "staff_types", force: :cascade do |t|
    t.string   "name",       limit: 255, null: false
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.integer  "creator_id", limit: 4
  end

  add_index "staff_types", ["creator_id"], name: "index_staff_types_on_creator_id", using: :btree
  add_index "staff_types", ["name"], name: "index_staff_types_on_name", unique: true, using: :btree

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
  end

  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["enabled"], name: "index_users_on_enabled", using: :btree
  add_index "users", ["invite_id"], name: "index_users_on_invite_id", using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["role"], name: "index_users_on_role", using: :btree
  add_index "users", ["unlock_token"], name: "index_users_on_unlock_token", unique: true, using: :btree

  create_table "venues", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "creator_id", limit: 4
  end

  add_index "venues", ["creator_id"], name: "index_venues_on_creator_id", using: :btree
  add_index "venues", ["name"], name: "index_venues_on_name", using: :btree

  create_table "venues_users", force: :cascade do |t|
    t.integer  "user_id",    limit: 4, null: false
    t.integer  "venue_id",   limit: 4, null: false
    t.boolean  "enabled",              null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "venues_users", ["created_at"], name: "index_venues_users_on_created_at", using: :btree
  add_index "venues_users", ["enabled"], name: "index_venues_users_on_enabled", using: :btree

end
