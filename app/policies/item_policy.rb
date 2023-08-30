class ItemPolicy < ApplicationPolicy

    def update?
        authorize?
    end

    def destroy?
        authorize?
    end

    def authorize?
        if record.created_by_user?
            record.user.id == user.id
        else
            record.group.user_id == user.id
        end

    end
end