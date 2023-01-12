class GoogleBooks
	def self.search(term, offset: 0)
		offset = offset.to_i > 0 ? offset.to_i + 1 : offset
		term = term.gsub(' ', '+')
		json = RestClient.get("https://www.googleapis.com/books/v1/volumes?q=#{term}&startIndex=#{offset}&maxResults=30&key=AIzaSyCYbaDcWSJBueVahTqdNl6YppfTvyyOFZw")
		response = JSON.parse(json.body)
		res = response["items"]&.map { |book| reduce_book(book) } || []
		res.reject { |book| book.nil? }
	end

	def self.search_by_uid(uid, offset: 0)
		offset = offset.to_i > 0 ? offset.to_i + 1 : offset
		json = RestClient.get("https://www.googleapis.com/books/v1/volumes?q=isbn:#{uid}&startIndex=#{offset}&maxResults=30&key=AIzaSyCYbaDcWSJBueVahTqdNl6YppfTvyyOFZw")
		response = JSON.parse(json.body)
		res = response["items"]&.map { |book| reduce_book(book) } || []
		res = res.reject { |book| book.nil? }
		if res.first
			res.first[:image_url]
		end
	end

	private

	def self.reduce_book(book)
		if book && book["volumeInfo"] && book["volumeInfo"]["imageLinks"]
			{
				title: book["volumeInfo"]["title"],
				subtitle: book["volumeInfo"]["subtitle"],
				description: book["volumeInfo"]["description"],
				publish_date: book["volumeInfo"]["publishedDate"],
				uid: find_isbn13(book["volumeInfo"]["industryIdentifiers"]),
				image_url: book["volumeInfo"]["imageLinks"]["thumbnail"],
				creator: book["volumeInfo"]["authors"]&.join(' & '),
				categories: book["volumeInfo"]["categories"],
			}
		else
			nil
		end
	end

	def self.find_isbn13(industry_ids=[])
		h = (industry_ids || []).find do |h|
			h["type"] == "ISBN_13"
		end
		h && h["identifier"]
	end
end