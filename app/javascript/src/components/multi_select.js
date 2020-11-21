import React, { useState } from 'react';

const Option = ({ value, uid, onSelect, onUnselect, defaultSelected }) => {

    const [selected, setSelected] = useState(defaultSelected);

    return(
        <div 
            className="select-option" 
            onClick={({ target }) => {
                selected ? onUnselect(target.innerHTML) : onSelect(target.innerHTML);
                setSelected(prev => !prev);
            }}
            data-uid={uid}
            style={{
                background: selected ? '#e1795a' : 'white',
                color: selected ? 'white' : '',
            }}
        >
            {value}
        </div>
    );
}

const MultiSelect = ({ children, _ref_, options, onChange, defaultValue=[] }) => {
    const [uid, __] = useState(Math.floor(Math.random() * 10000));
    const [show, setShow] = useState(false);
    const [value, setValue] = useState((defaultValue || []).join(', '));

    function select(val) {
        setValue(prev => prev + (prev.length == 0 ? '': ', ') + val);
    }

    function unselect(val) {
        setValue(prev => {
            if (prev.length == val.length) {
                return prev.replace(val, '');
            } else if (prev.indexOf(val) == 0) {
                return prev.replace(val + ', ', '');
            } else {
                return prev.replace(', ' + val, '');
            };
        });
    }

    return(
        <div className="select" >
            <input 
                type="text" 
                ref={_ref_} 
                onChange={onChange} 
                value={value} 
                data-uid={uid}
                readOnly={true}
                onFocus={() => {
                    setShow(true);
                    const listener = ({ target }) => {

                        if (parseInt(target.getAttribute('data-uid')) != uid) {
                            setShow(false);
                            document.removeEventListener('click', listener);
                        }
                    };

                    document.addEventListener('click', listener);
                }} 
            />
            <div className="select-options" style={{display: show ? '' : 'none'}} data-uid={uid} >
                {options.map((option, i) =>
                    <Option 
                        value={option} 
                        key={i}
                        onSelect={select}
                        onUnselect={unselect}
                        uid={uid}
                        defaultSelected={value.includes(option)}
                    />
                )}
            </div>
        </div>

    );
};

export default MultiSelect;