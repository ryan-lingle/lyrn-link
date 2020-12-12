class RootController < ApplicationController
	skip_before_action :authenticate_request
	def index; end

	def root
		redirect_to 'https://www.lyrn.link'
	end
end
