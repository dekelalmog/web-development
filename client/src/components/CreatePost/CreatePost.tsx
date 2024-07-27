import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import { imageFullPath } from "../../services/utils";
import { uploadFile } from "../../services/file-service";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  createPost: (title: string, imageUrl?: string) => void;
}

const CreatePost: React.FC<Props> = (props: Props) => {
  const [title, setTitle] = useState<string>("");
  const [file, setFile] = useState<File>();

  const closeModal = useCallback(() => props.setShowModal(false), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <div>
      <Modal isOpen={props.showModal} onRequestClose={closeModal}>
        <h2>Hello</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
           {(file) && (
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
          <button type="submit">Create Post</button>
        </form>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default CreatePost;
