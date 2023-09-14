import React, { useRef, useContext } from 'react';
import { 
    ErrorBox, 
    SuccessBox, 
    Submit, 
    MultiSelect, 
    SearchInput, 
    InfoTooltip,
} from '.';
import Context from '../context';

const Form = ({ inputs=[], className, onSubmit, submitCopy, type, col="6", children }) => {
    const { api, state } = useContext(Context);
    const refs = inputs.reduce((mem, { key }) => {
        mem[key] = useRef();
        return mem;
    }, {});

    function handleSubmit(e) {
        e.preventDefault();

        if (typeof onSubmit == "string")
            onSubmit = api[onSubmit];

        onSubmit(Object.keys(refs).reduce((mem, key) => {
            mem[key] = refs[key].current.value;
            return mem;
        }, {}));
    }

    function buildInputGroup(input) {
        return(
            <div className="input-primary">
                <label>
                    {icon(input.icon)}
                    {input.label}
                    {info(input.info)}
                </label>
                {buildInput(input)}
            </div>
        );
    };

    function buildInput(input) {
        if (input.type === 'search') {
            return <SearchInput {...input} _ref_={refs[input.key]} />;
        } else if (input.type === 'select') {
            if (input.multiple) {
                return(
                    <MultiSelect 
                        _ref_={refs[input.key]} 
                        onChange={input.onChange} 
                        options={input.options}
                        defaultValue={input.defaultValue}
                    />
                );
            } else {
                return(
                    <select 
                        ref={refs[input.key]} 
                        onChange={input.onChange} 
                    >
                        <option></option>
                        {buildOptions(input.options, input.defaultValue)}
                    </select>
                );
            }
        } else if (input.type === 'textarea') {
            return(
                <textarea
                    id={input.id}
                    ref={refs[input.key]} 
                    defaultValue={input.defaultValue}
                    onChange={input.onChange}
                    placeholder={input.placeholder}
                    row={input.rows}
                />
            );
        } else {
            return(
                <input
                    id={input.id}
                    ref={refs[input.key]} 
                    type={input.type} 
                    defaultValue={input.defaultValue}
                    onChange={input.onChange}
                    placeholder={input.placeholder}
                />
            );
        }
    }

    function buildOptions(options, defaultValue) {
        if (Array.isArray(options)) {
            return options.map((option, i) =>
                <option key={i} selected={defaultValue == option}>
                    {option}
                </option>
            )
        } else {
            return Object.keys(options).map((key, i) =>
                <option key={i} value={key} selected={defaultValue == options[key]}>
                    {options[key]}
                </option>
            )
        };
    }

    function icon(i) {
        if (i) return(
            <span>
               <i className={i} />
               &nbsp;&nbsp;
            </span>
        );
    }

    function info(i) {
        if (i) {
            return(
                <InfoTooltip copy={i} pad={true} />
            );
        }
    }

    const loading = state.loading[type];
    const error = state.errors[type];
    const success = state.success[type];

    return(
        <div className={`form ${className}`}>
            <form onSubmit={handleSubmit} >
                <ErrorBox error={error} />
                <SuccessBox success={success} />
                <div className="row">
                    {inputs.map((input, i) =>
                        <div className={`col-md-${col} col-xs-12`} key={i} style={input.style} >
                            {buildInputGroup(input)}
                        </div>
                    )}
                    {children}
                </div>
                <div className={`col-md-12 col-xs-12 text-right`}>
                    <Submit
                        copy={submitCopy}
                        loading={loading}
                        style={{marginTop: '10px'}}
                    />
                </div>
            </form>
        </div>
    );
};

export default Form;