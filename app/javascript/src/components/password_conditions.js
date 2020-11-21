import React from 'react';
const numbers = [1,2,3,4,5,6,7,8,9];
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
const caps = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

const conditions = [
    {
        condition: ({ password }) => password.length > 7,
        copy: '8+ Characters',
    },
    {
        condition: ({ password }) => numbers.some((n) => password.includes(n)),
        copy: '1 Number',
    },
    {
        condition: ({ password }) => letters.some((n) => password.includes(n)),
        copy: '1 Letter',
    },
    {
        condition: ({ password }) => caps.some((n) => password.includes(n)),
        copy: '1 Capital Letters',
    },
    {
        condition: ({ password, passwordCopy }) => password.length > 0 && password === passwordCopy,
        copy: 'Passwords Match',
    }
];

const Conditional = ({ condition, copy }) => (
    condition 
        ?   <div
                className="password-condition"
                style={{color: '$green'}}
            >
                <div>[check]</div>
                <span>{copy}</span>
            </div>

        :   <div 
                className="password-condition"
                style={{color: '$red'}}
            >
                <div>[X]</div>
                <span>{copy}</span>
            </div>
);

const PasswordConditions = ({ password, passwordCopy }) => (
    <div>
        {
            conditions.map((condition, i) => 
                <Conditional 
                    key={i}
                    copy={condition.copy} 
                    condition={condition.condition({password, passwordCopy})} 
                />
            )
        }
    </div>
);

function allConditionsPass(password, passwordCopy) {
    return conditions.every(({ condition }) => 
        condition({ password, passwordCopy })
    );
}

PasswordConditions.allConditionsPass = allConditionsPass;

export default PasswordConditions;