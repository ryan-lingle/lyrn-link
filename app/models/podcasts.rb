class Podcasts < List
	def singular
		'episode'
	end

	def search(term, offset: 0)
		ListenNotes.search(term, offset: offset)
	end
end