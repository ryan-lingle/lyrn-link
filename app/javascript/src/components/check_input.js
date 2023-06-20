import React, { useState, useEffect } from "react";

const CheckInput = ({
  _ref_,
  name,
  copy,
  children,
  defaultValue = false,
  forceCheck = false,
  controlled = false,
  onClick,
  checkedIcon = "fa-solid fa-check-square",
  uncheckedIcon = "text-white fa-solid fa-square",
  checkChild = false,
  checkStyle,
  onChange,
  style,
}) => {
  const [checked, setChecked] = useState(defaultValue);

  if (forceCheck || controlled)
    useEffect(() => {
      setChecked(defaultValue);
    }, [defaultValue]);

  function buildOnClick(v) {
    return () => {
      if (!controlled) {
        setChecked(v);
        onChange && onChange(v);
      }
    };
  }

  return (
    <div className="flex items-start text-xl" onClick={onClick} style={style}>
      {!!children && checkChild ? (
        children(checked, setChecked)
      ) : checked ? (
        <i
          className={`${checkedIcon} primary check-input mr-2 mt-2`}
          onClick={buildOnClick(false)}
          style={checkStyle}
        />
      ) : (
        <i
          className={`${uncheckedIcon} check-input mr-2 mt-2`}
          onClick={buildOnClick(true)}
          style={checkStyle}
        />
      )}
      {(!checkChild && children) || copy}
      <input type="hidden" name={name} ref={_ref_} value={checked ? 1 : 0} />
    </div>
  );
};

export default CheckInput;
