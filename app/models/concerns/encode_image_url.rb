module EncodeImageUrl
	def encode_image_url(url)
		image = open(url)
		Base64.encode64(image.read)
	end
end