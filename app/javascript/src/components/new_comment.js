import React, { useContext } from  'react';
import Context from '../context';
import { Form } from '.';

const NewComment = ({ item_id }) => {
    const { api, state } = useContext(Context);

    async function handleSubmit(params) {
        const res = await api.createComment(item_id, params);

        if (res) {
            const input = document.getElementById('comment-input');
            input.value = '';
        }
    }

    return(
        <Form
            inputs={[
                {
                    id: 'comment-input',
                    key: 'text',
                    type: 'textarea',
                    label: 'Comment',
                    placeholder: 'What do you think?',
                    rows: 3,
                },
            ]}
            type="comments"
            onSubmit={handleSubmit}
            submitCopy='Post Comment'
        />
    )
};

export default NewComment;