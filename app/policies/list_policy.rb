class ListPolicy < ApplicationPolicy
    

    def create?
        if record.owner_type == 'User'
            record.owner.id == user.id
        else
            record.owner.user.id == user.id
        end
    end

    def update?
        record.user.id == user.id
    end

    def destroy?
        if record.owner_type == 'User'
            record.owner.id == user.id
        else
            record.owner.user.id == user.id
        end
    end
end