import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import { imageFullPath } from "../../services/utils";
import { uploadFile } from "../../services/file-service";
import "./CreatePost.css";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  createPost: (title: string, imageUrl?: string) => void;
}

const CreatePost: React.FC<Props> = (props: Props) => {
  const [title, setTitle] = useState<string>("");
  const [file, setFile] = useState<File>();

  const closeModal = useCallback(() => props.setShowModal(false), []);

  const handleSubmit = async () => {
    if (!title) {
      return;
    }

    if (file) {
      try {
        const imageUrl = await uploadFile(file);
        const imageRoute = imageFullPath(imageUrl);
        props.createPost(title, imageRoute);
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    } else {
      props.createPost(title);
    }

    closeModal();
  };

  const handleChangePicture = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFile(event.target.files?.[0]);
  };

  return (
    <Modal
      isOpen={props.showModal}
      ariaHideApp={false}
      onRequestClose={closeModal}
      style={{
        content: {
          width: "300px",
          height: "400px",
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
        },
      }}
    >
      <div className="create-post">
        <h2>Create Post</h2>
        <form>
          <input
            type="text"
            placeholder="Write Description"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Selected Image"
              style={{ width: "100px", height: "100px" }}
            />
          )}
          <input
            type="file"
            id="profile-picture-input"
            accept="image/*"
            onChange={handleChangePicture}
          />
        </form>
        <div className="actions">
          <button type="submit" onClick={handleSubmit}>
            Create Post
          </button>
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default CreatePost;
