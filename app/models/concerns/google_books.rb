class GoogleBooks
	def self.search(term, offset: 0)
		offset = offset.to_i > 0 ? offset.to_i + 1 : offset
		term = term.gsub(' ', '+')
		response = Unirest.get("https://www.googleapis.com/books/v1/volumes?q=#{term}&startIndex=#{offset}&maxResults=30&key=AIzaSyCYbaDcWSJBueVahTqdNl6YppfTvyyOFZw")
		res = response.body["items"]&.map { |book| reduce_book(book) } || []
		res.reject { |book| book.nil? }
	end

	private

	def self.reduce_book(book)
		if book && book["volumeInfo"] && book["volumeInfo"]["imageLinks"]
			{
				title: book["volumeInfo"]["title"],
				# isbn13: book["volumeInfo"]["industryIdentifiers"]["isbn13"],
				image: book["volumeInfo"]["imageLinks"]["thumbnail"],
				authors: book["volumeInfo"]["authors"],
			}
		else
			nil
		end
	end
end