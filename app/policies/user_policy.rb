class UserPolicy < ApplicationPolicy
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