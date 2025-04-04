module EncodeImageUrl
	def encode_image_url(url)
		if url && !url.empty?
			image = URI.open(url)
			"data:#{image.meta['content-type']};base64," + Base64.encode64(image.read)
		end
	rescue Exception => error
		return
	end
end