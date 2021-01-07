class PasswordConfirmationMailer < Mailer

	def self.send(email:, name:, token:)
    	PostmarkClient.deliver_with_template(
    		from: from,
    		to: "lingleryan@gmail.com",
    		template_alias: "password-confirmation",
    		template_model: {
    			name: name,
    			support_url: "mailto:#{from}",
    			action_url: domain + "/confirm_password/#{token}", 
    		}
    	)
	end
	
end
