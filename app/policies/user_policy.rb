class UserPolicy < ApplicationPolicy
	def update?
		# super admin or self
    	user.super_admin? || record.id == user.id
  	end

  	def profile_picture?
  		# super admin or self
  		user.super_admin? || record.id == user.id
  	end

  	def destroy?
  		# super admin, self or account admin and record is not an admin
  		user.super_admin? || record.id == user.id || (user.account_id == record.account_id && !record.admin? && user.admin?)
  	end
end