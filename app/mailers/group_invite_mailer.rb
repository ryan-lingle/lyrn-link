class GroupInviteMailer < Mailer

	def self.send(email:, group:, token:)
    	PostmarkClient.deliver_with_template(
    		from: from,
    		to: email,
    		template_alias: "group-invite",
    		template_model: {
    			group: group,
    			support_url: "mailto:#{from}",
    			action_url: domain + "/signup?token=#{token}", 
    		}
    	)
	end
	
end
