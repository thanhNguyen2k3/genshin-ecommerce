import { Dispatch, SetStateAction } from 'react';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    ['video', 'image'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean'], // remove formatting button
];

const modules = {
    toolbar: toolbarOptions,
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
};

type Props = {
    value?: string;
    setValue: Dispatch<SetStateAction<string>>;
};

const StyleReactQuillEditor = styled(ReactQuill)`
    .ql-container {
        .ql-editor {
            height: 200px;
        }
    }
`;

const Editors = ({ value, setValue }: Props) => {
    return (
        <StyleReactQuillEditor
            value={value}
            onChange={setValue}
            placeholder="Mô tả..."
            modules={modules}
            theme="snow"
        />
    );
};

export default Editors;
