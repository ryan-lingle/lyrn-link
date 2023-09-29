# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2023_09_29_185253) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "record_type"
    t.uuid "record_id"
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "activities", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.string "type"
    t.string "record_type", null: false
    t.uuid "record_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "metadata"
    t.string "owner_type", null: false
    t.uuid "owner_id", null: false
    t.index ["owner_type", "owner_id"], name: "index_activities_on_owner_type_and_owner_id"
    t.index ["record_type", "record_id"], name: "index_activities_on_record_type_and_record_id"
    t.index ["user_id"], name: "index_activities_on_user_id"
  end

  create_table "affiliate_sign_ups", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "affiliate_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["affiliate_id"], name: "index_affiliate_sign_ups_on_affiliate_id"
    t.index ["user_id"], name: "index_affiliate_sign_ups_on_user_id"
  end

  create_table "ai_models", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.text "history"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_ai_models_on_user_id"
  end

  create_table "bookmarks", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "meta_item_id"
    t.index ["meta_item_id"], name: "index_bookmarks_on_meta_item_id"
    t.index ["user_id"], name: "index_bookmarks_on_user_id"
  end

  create_table "comments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "item_type", null: false
    t.uuid "item_id", null: false
    t.text "text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["item_type", "item_id"], name: "index_comments_on_item_type_and_item_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "group_invites", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "group_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "email"
    t.index ["group_id"], name: "index_group_invites_on_group_id"
  end

  create_table "group_relationships", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "group_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "accepted", default: false
    t.index ["group_id"], name: "index_group_relationships_on_group_id"
    t.index ["user_id"], name: "index_group_relationships_on_user_id"
  end

  create_table "groups", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.boolean "private", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "handle"
    t.uuid "user_id", null: false
    t.string "image_url"
    t.integer "member_count", default: 0
    t.string "secret"
    t.index ["user_id"], name: "index_groups_on_user_id"
  end

  create_table "items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.string "url"
    t.integer "index"
    t.string "image_url"
    t.text "creator"
    t.uuid "list_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "subtitle"
    t.string "url_copy"
    t.string "uid"
    t.text "categories"
    t.date "publish_date"
    t.uuid "meta_item_id"
    t.text "user_notes"
    t.boolean "notes_activity_published", default: false
    t.string "media_type"
    t.index ["list_id"], name: "index_items_on_list_id"
    t.index ["meta_item_id"], name: "index_items_on_meta_item_id"
  end

  create_table "likes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "like_id", null: false
    t.uuid "link_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["like_id"], name: "index_likes_on_like_id"
    t.index ["link_id"], name: "index_likes_on_link_id"
  end

  create_table "lists", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "type"
    t.integer "index"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "user_id"
    t.string "owner_type", null: false
    t.uuid "owner_id", null: false
    t.index ["owner_type", "owner_id"], name: "index_lists_on_owner_type_and_owner_id"
    t.index ["user_id"], name: "index_lists_on_user_id"
  end

  create_table "meta_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.string "url"
    t.string "image_url"
    t.string "creator"
    t.string "subtitle"
    t.string "uid"
    t.string "url_copy"
    t.text "categories"
    t.date "publish_date"
    t.integer "count", default: 1
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "media_type"
    t.uuid "podcast_id"
    t.index ["podcast_id"], name: "index_meta_items_on_podcast_id"
  end

  create_table "oauth_credentials", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "token"
    t.string "secret"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "podcasts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "itunes_id"
    t.text "description"
    t.string "image_url"
    t.string "rss_url"
    t.string "title"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "recommendations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.date "date", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_recommendations_on_user_id"
  end

  create_table "recommended_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "recommendation_id", null: false
    t.uuid "meta_item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["meta_item_id"], name: "index_recommended_items_on_meta_item_id"
    t.index ["recommendation_id"], name: "index_recommended_items_on_recommendation_id"
  end

  create_table "tokens", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "key"
    t.text "metadata"
    t.datetime "expires_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email"
    t.string "handle"
    t.string "password_digest"
    t.boolean "email_confirmed", default: false
    t.string "type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "twitter_token"
    t.string "twitter_secret"
    t.string "twitter_id"
    t.string "name"
    t.string "description"
    t.string "profile_picture_url"
    t.boolean "admin", default: false
    t.string "twitter_handle"
    t.integer "follower_count", default: 0
    t.string "google_picture_url"
    t.string "token"
    t.text "notification_settings", default: "---\n:comment_on_my_item: '1'\n:comment_on_my_converation: '1'\n:follow_post: '1'\n:new_follower: '1'\n"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "activities", "users"
  add_foreign_key "affiliate_sign_ups", "users"
  add_foreign_key "affiliate_sign_ups", "users", column: "affiliate_id"
  add_foreign_key "ai_models", "users"
  add_foreign_key "bookmarks", "meta_items"
  add_foreign_key "bookmarks", "users"
  add_foreign_key "comments", "users"
  add_foreign_key "group_invites", "groups"
  add_foreign_key "group_relationships", "groups"
  add_foreign_key "group_relationships", "users"
  add_foreign_key "groups", "users"
  add_foreign_key "items", "lists"
  add_foreign_key "items", "meta_items"
  add_foreign_key "likes", "users", column: "like_id"
  add_foreign_key "likes", "users", column: "link_id"
  add_foreign_key "meta_items", "podcasts"
  add_foreign_key "recommendations", "users"
  add_foreign_key "recommended_items", "meta_items"
  add_foreign_key "recommended_items", "recommendations"
end
