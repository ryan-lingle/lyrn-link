module EncodeImageUrl
	def encode_image_url(url)
		if url
			image = open(url)
			"data:#{image.meta['content-type']};base64," + Base64.encode64(image.read)
		end
	end
end