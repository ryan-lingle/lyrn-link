class People < List
	def singular
		'person'
	end

	def search(term, offset: 0)
		page = (offset.to_i / 20) + 1
		user.search_people(term, page: page)
	end
end