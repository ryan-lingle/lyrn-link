class GroupPolicy < ApplicationPolicy
	  def update?
    	record.user_id == user.id
  	end

    def destroy?
      record.user_id == user.id
    end

  	def image?
  		record.user_id == user.id
  	end
end