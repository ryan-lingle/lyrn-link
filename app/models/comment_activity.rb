class CommentActivity < Activity
    def html
        "<div><a href='/#{self.owner.handle}' class='text-xl no-underline font-bold'>#{self.owner.name}</a> left a comment on <a href='#{self.record.href}' class='text-xl no-underline font-bold'>#{self.record.title}</a><div class='text-groundwork-gray-dark mt-3'>#{metadata[:comment]}</div></div>"
    end

    def icon
        "fa-solid fa-comment"
    end

    def image_url
        self.record.image_url
    end

    def href
       record.href
    end
end