module Listable
    extend ActiveSupport::Concern
    
    included do
        has_many :lists, -> { order(index: :asc) }, dependent: :destroy, as: :owner
        has_many :items, through: :lists

        def all_list_strings
            %w(books podcasts articles videos people)
        end

        def re_index_lists!
            lists.each_with_index do |list, index|
                list.index = index
                list.save
            end
        end
    
        def update_list_index!(lists)
            lists.each do |list_rams|
                list = List.find(list_rams[:id])
                list.index = list_rams[:index]
                list.save
            end
        end
    
        def list_index(bis=[])
            lists.map { |list| list.to_res(bis) }
        end
    
        def uncreated_lists
            my_list_strings = lists.map do |list|
                list.type.downcase
            end
            all_list_strings.filter do |list_string|
                !my_list_strings.include?(list_string)
            end
        end
    end
end