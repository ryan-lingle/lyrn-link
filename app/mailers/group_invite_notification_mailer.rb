class GroupInviteNotificationMailer < Mailer

	def self.send(email:, name:, group:)
    	PostmarkClient.deliver_with_template(
    		from: from,
    		to: email,
    		template_alias: "group-invite-notification",
    		template_model: {
    			name: name,
                group: group,
    			support_url: "mailto:#{from}",
    			action_url: domain + "/admin/circle/groups", 
    		}
    	)
	end
	
end
