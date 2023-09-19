class NotificationMailer < Mailer	

	def self.new_follower(email:, name:, follower:)
    	PostmarkClient.deliver_with_template(
    		from: from,
    		to: email,
    		template_alias: "new-follower-notification",
    		template_model: {
    			user_name: name,
				follower: follower.name,
    			support_url: "mailto:#{from}",
    			action_url: domain + "/#{follower.handle}", 
				settings_url: domain + "/settings",
    		}
    	)
	rescue StandardError => e
		logger.error e.message
		e.backtrace.each { |line| logger.error line }
		Rollbar.error(e) # log to rollbar
	end

	def self.new_item(email:, name:, item:)
    	PostmarkClient.deliver_with_template(
    		from: from,
    		to: email,
    		template_alias: "new-item-notification",
    		template_model: {
				name: name,
    			item_title: item.title,
				item_image_url: domain + Rails.application.routes.url_helpers.polymorphic_url(item.image, only_path: true),
				item_user_name: item.user.name,
				item_user_handle: item.user.handle,
    			support_url: "mailto:#{from}",
    			action_url: domain + "/#{item.user.handle}/i/#{item.id}", 
				settings_url: domain + "/settings",
    		}
    	)
	rescue StandardError => e
		logger.error e.message
		e.backtrace.each { |line| logger.error line }
		Rollbar.error(e) # log to rollbar
	end

	def self.new_comment(email:, name:, comment:)
		PostmarkClient.deliver_with_template(
			from: from,
			to: email,
			template_alias: "new-comment-notification",
			template_model: {
				name: name,
				commenter_name: comment.user.name,
				item_title: comment.item.title,
				item_image_url: domain + Rails.application.routes.url_helpers.polymorphic_url(comment.item.image, only_path: true),
				action_url: comment.action_url,
				settings_url: domain + "/settings",
				support_url: "mailto:#{from}",
			}
		)

	rescue StandardError => e
		logger.error e.message
		e.backtrace.each { |line| logger.error line }
		Rollbar.error(e) # log to rollbar
	end

	def self.new_conversation_comment(email:, name:, comment:)
		PostmarkClient.deliver_with_template(
			from: from,
			to: email,
			template_alias: "new-conversation-comment-notification",
			template_model: {
				name: name,
				commenter_name: comment.user.name,
				item_title: comment.item.title,
				item_image_url: domain + Rails.application.routes.url_helpers.polymorphic_url(comment.item.image, only_path: true),
				action_url: comment.action_url,
				settings_url: domain + "/settings",
				support_url: "mailto:#{from}",
			}
		)

	rescue StandardError => e
		logger.error e.message
		e.backtrace.each { |line| logger.error line }
		Rollbar.error(e) # log to rollbar
	end
end
