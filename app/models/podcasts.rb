class Podcasts < List
	def singular
		'episode'
	end

	def search(term, offset: 0)
		ListenNotes.search(term, offset: offset)
	end

	def icon
		"fal fa-podcast"
	end

	def find_image(podcast)
		if podcast.title
			Itunes.find(podcast.uid)
		end
	end
end