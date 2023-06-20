import React, { useEffect } from 'react';
import { PageWrapper } from '.';
import { withStuff } from '../hocs';
import { SimpleForm, CheckboxList, Submit, ErrorBox, SuccessBox } from '../components';

const Settings = (props) => {

    function handleSubmit(params) {
        props.api.updateUser(props.state.current_user_id, {
            notification_settings: params
        });
    }

    const error = props.state.error?.update_user;
    const success = props.state.success?.update_user;

    return (
        <PageWrapper {...props} tabs={false} >
            <SuccessBox success={success} />
            <ErrorBox error={error} />
            <SimpleForm onSubmit={handleSubmit}>
                <h2 className="mt-5">Notification Settings</h2>
                <CheckboxList
                    col='12'
                    list={{
                        'comment_on_my_item': 'When a comment is made on an item of mine',
                        'comment_on_my_converation': 'When a comment is made on a conversation I\'m in',
                        'follow_post': 'When someone I follow posts a new item',
                        'new_follower': 'When someone follows me',
                    }}
                    defaultValue={props.state.user.notification_settings}
                />
                <div className='mt-4'>
                    <Submit copy="Save" className="btn btn-primary" type="update_user" />
                </div>
            </SimpleForm>
        </PageWrapper>
    );
};

export default withStuff(Settings, {
    api: true,
    state: true,
    loader: 'user',
    effect: async ({ api }) => {
        await api.getUser();
    }
});
