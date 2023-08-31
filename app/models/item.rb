class Item < ApplicationRecord
	include EncodeImageUrl
	include ActiveStorageSupport::SupportForBase64
	has_one_base64_attached :image
	belongs_to :list
	belongs_to :meta_item, required: false
	has_many :comments, dependent: :destroy, as: :item
	has_many :comment_users, -> { distinct }, through: :comments, source: :user
	has_many :activities, dependent: :destroy, as: :record
	before_create :add_index
	before_create :upload_image
	after_create :create_or_update_meta_item
	after_create :send_notification_email, if: :created_by_user?
	after_create :create_activity
	after_update :create_notes_activity

	def title_clean
		whitelist = "0123456789abcdefghijklmnopqrstuvwxyz ".split("")
		clean = (self.title || '').split('').filter do |l|
			whitelist.include?(l.downcase)
		end
		clean.join('')
	end

	def add_index
		self.index = list.items.count
	end

	def upload_image
		if self.image_url
			data = encode_image_url(self.image_url)
			if data
				self.image.attach(data: data)
			else
				self.image_url = nil
			end
		end
	end

	def to_index_res(bookmarks=[])
		{
			owner_type: owner.owner_type,
			trueItem: true,
			id: self.id,
			meta_item_id: self.meta_item_id,
			title: self.title,
			subtitle: self.subtitle,
			description: self.description,
			image_url: self.image.attached? ? self.image.service_url : '',
			url: self.url,
			url_copy: self.url_copy, 
			internal_href: href,
			index: self.index,
			creator: self.creator,
			bookmarked: bookmarks.include?(self.meta_item_id),
			button: 'bookmark',
		}
	end

	def to_show_res(bookmarks=[])
		{
			owner_type: owner.owner_type,
			id: self.id,
			meta_item_id: self.meta_item_id,
			title: self.title,
			subtitle: self.subtitle,
			description: self.description,
			image_url: self.image.attached? ? self.image.service_url : '',
			url: self.url,
			url_copy: self.url_copy,
			internal_href: href, 
			index: self.index,
			creator: self.creator,
			bookmarked: bookmarks.include?(self.meta_item_id),
			button: 'bookmark',
			owner_id: created_by_user? ? owner.id : owner.user_id,
			user_name: owner.name,
			user_notes: user_notes,
			comments: comment_index,
		}
	end

	def comment_index
		comments.map do |comment|
			comment.to_res
		end
	end

	def href
		"#{ENV['DOMAIN']}/#{created_by_group? ? 'g/' : ''}#{owner.handle}/i/#{id}"
	end


	def create_or_update_meta_item
		meta_item = MetaItem.find_by(title: self.title)

		if meta_item
			meta_item.count += 1
			unless meta_item.image.attached?
				meta_item.image_url = self.image_url
				meta_item.upload_image
			end
			meta_item.save
		else
			meta_item = MetaItem.create!(
				uid: self.uid,
				title: self.title,
				subtitle: self.subtitle,
				description: self.description,
				image_url: self.image_url,
				url: self.url,
				url_copy: self.url_copy,
				creator: self.creator,
				categories: self.categories,
				publish_date: self.publish_date,
			)
		end

		self.meta_item = meta_item
		self.save!
	end
	
	def send_notification_email
		# todo: support group member notifications on  featured item posts
		user.followers.each do |follower|
			if follower.subscribed?('follow_post')
				NotificationMailer.new_item(
					email: follower.email,
					name: follower.handle,
					item: self,
				)
			end
		end
	end

	def create_activity
		ItemPostActivity.create!(
			owner: owner,
			record: self,
		)
	end

	def create_notes_activity
		if !notes_activity_published && user_notes.present?
			NotesActivity.create!(
				owner: owner,
				record: self,
				metadata: { notes: user_notes }
			)
		end
	end

	def owner
		list.owner
	end

	def created_by_user?
		owner.is_a? User
	end

	def owner_user
		created_by_user? ? owner : owner.user
	end

	def user
		created_by_user? ? owner : nil
	end

	def group
		created_by_group? ? owner : nil
	end

	def created_by_group?
		owner.is_a? Group
	end
end
