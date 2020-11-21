export function userParams(user={}) {
    return [
        {
            label: 'Email',
            placeholder: 'your@email.com',
            type: 'email',
            key: 'email',
            defaultValue: user.email,
        },
        {
            label: 'Username',
            placeholder: 'jack',
            type: 'text',
            key: 'username',
            defaultValue: user.username,
        },
    ]
};

