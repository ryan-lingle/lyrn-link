class People < List
	def singular
		'person'
	end

	def search(term, offset: 0)
		page = (offset.to_i / 20) + 1
		user.search_people(term, page: page)
	end

	def icon
		"fab fa-twitter"
	end

	def find_image(person)
		if person.url_copy
			begin
				res = user.search_people(person.url_copy)
				if res.first
					res.first[:image_url]
				end
			rescue StandardError => e
				puts e
			end
		end
	end
end