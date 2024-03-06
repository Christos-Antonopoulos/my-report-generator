import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichTextEditor = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Editor
        //apiKey={process.env.REACT_APP_TinyMCE_API_KEY} // Replace with your TinyMCE API key
        apiKey="v80gza1cxuxhl9n62pe3h13i3uaaknn95go95fti01901ep0"
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 500,
          width: 1000,
          menubar: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
            "wordcount",
            "save",
          ],
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </div>
  );
};

export default RichTextEditor;
