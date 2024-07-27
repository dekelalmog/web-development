import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import { imageFullPath } from "../../services/utils";
import { uploadFile } from "../../services/file-service";
import { Post } from "../../services/interfaces";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  updatePost: (title: string, imageUrl?: string) => void;
  deletePost: (postId: string) => void;
  post: Post;
}

const UpdatePost: React.FC<Props> = (props: Props) => {
  const [description, setDescription] = useState<string>(props.post.description);
  const [file, setFile] = useState<File>();

  const closeModal = useCallback(() => props.setShowModal(false), []);

  const handleDelete = async () => {
    props.deletePost(props.post._id!);
    closeModal();
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description) {
      return;
    }

    if (file) {
      try {
        const imageUrl = await uploadFile(file);
        const imageRoute = imageFullPath(imageUrl);
        props.updatePost(description, imageRoute);
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    } else {
      props.updatePost(description);
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
      <Modal ariaHideApp={false} isOpen={props.showModal} onRequestClose={closeModal}>
        <h2>Hello</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          />
          {(file || props.post.imageUrl) && (
            <img
              src={file ? URL.createObjectURL(file) : props.post.imageUrl}
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
          <button type="submit">Update Post</button>
        </form>
        <button onClick={closeModal}>Close</button>
        <button onClick={handleDelete}>Delete</button>
      </Modal>
    </div>
  );
};

export default UpdatePost;
