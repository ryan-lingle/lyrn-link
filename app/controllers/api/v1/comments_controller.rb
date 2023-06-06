class  Api::V1::CommentsController < ApplicationController
    def create
        item = Item.find_by(id: params[:id]) || MetaItem.find(params[:id])
        comment = Comment.new(comment_params)
        comment.item = item
        comment.save!
        render json: {
            comment: comment.to_res
        }
    end

    def destroy
        Comment.find(params[:id]).destroy

        render json: {
            success: true
        }
    end

    private

    def comment_params
        params.require(:comment).permit(:item_id, :text, :item_type).tap do |rams|
            rams[:user_id] = current_user.id
        end
    end
end