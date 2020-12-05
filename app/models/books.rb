class Books < List
	def singular
		'book'
	end

	def search(term, offset: 0)
		GoogleBooks.search(term, offset: offset)
	end

	def icon
		"fal fa-book-open"
	end
end