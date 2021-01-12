class PasswordConfirmationMailer < Mailer

	def self.send(email:, name:, token:)
    	PostmarkClient.deliver_with_template(
    		from: from,
    		to: email,
    		template_alias: "email-confirmation",
    		template_model: {
    			name: name,
    			support_url: "mailto:#{from}",
    			action_url: domain + "/confirm_email/#{token}", 
    		}
    	)
	end
	
end
