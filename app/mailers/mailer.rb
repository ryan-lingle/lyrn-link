class Mailer
	private

	def self.domain
		ENV["DOMAIN"]
	end

	def self.from
		"from@app.domain"
	end
end