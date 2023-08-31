import { func } from "prop-types";
import React, { useEffect, useState } from "react";
import Quill from "react-quill";

const CustomButton = () => <span className="fas fa-save" style={{marginBottom: '10px'}} />;

const CustomToolbar = ({ display }) => (
  <div id="toolbar" style={{display: display ? '' : 'none'}}>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
  </div>
);

const Editor = ({ onSave, defaultValue, owner=false }) => {
  const [value, setValue] = useState(defaultValue);
  const [edit, setEdit] = useState(false);

  function saveContent() {
    onSave(value);
    setEdit(false);
  }

  return(
    <div id="editor">
      {
        owner

        ? value || edit

          ?  <div className="text-right" style={{ fontSize: '20px', marginTop: '-30px'}}>
              {
                edit

                ?   <i className="fas fa-save" style={{marginBottom: '10px'}} onClick={saveContent}>
                    </i>

                :   <i className="fas fa-pencil" style={{marginBottom: '10px'}} onClick={() => setEdit(true)} >
                    </i>
                }
              </div>

          : <button className="btn btn-primary" onClick={() => setEdit(true)}>Create Note</button>
          
        :   null
      }
      <CustomToolbar display={edit} />
      <Quill
        theme="snow"
        value={value}
        onChange={setValue}
        readOnly={!edit}
        modules={Editor.modules}
      />
    </div>
  );
};

Editor.modules = {
  toolbar: {
    container: "#toolbar",
  },
}

Editor.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
];


export default Editor;
