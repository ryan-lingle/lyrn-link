class Books < List
	def singular
		'book'
	end

	def search(term, offset: 0)
		GoogleBooks.search(term, offset: offset)
	end

	def icon
		"fas fa-book-open"
	end

	def find_image(book)
		if book.uid
			GoogleBooks.search_by_uid(book.uid)
		end
	end
end