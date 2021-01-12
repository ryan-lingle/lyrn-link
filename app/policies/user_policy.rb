class UserPolicy < ApplicationPolicy
  	def index?
  		user.admin?
  	end

	  def update?
    	record.id == user.id
  	end

  	def profile_picture?
  		record.id == user.id
  	end

  	def destroy?
  		record.id == user.id
  	end
end