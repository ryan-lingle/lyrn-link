class Mailer
	private

	def self.domain
		ENV["DOMAIN"]
	end

	def self.from
		"hi@lyrn.link"
	end
end