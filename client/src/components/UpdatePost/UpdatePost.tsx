import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import { imageFullPath } from "../../services/utils";
import { uploadFile } from "../../services/file-service";
import { Post } from "../../services/interfaces";
import "../CreatePost/CreatePost.css";
import "./UpdatePost.css";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  updatePost: (title: string, imageUrl?: string) => void;
  deletePost: (postId: string) => void;
  post: Post;
}

const UpdatePost: React.FC<Props> = (props: Props) => {
  const [description, setDescription] = useState<string>(
    props.post.description
  );
  const [file, setFile] = useState<File>();

  const closeModal = useCallback(() => props.setShowModal(false), []);

  const handleDelete = async () => {
    props.deletePost(props.post._id!);
    closeModal();
  };

  const handleSubmit = async () => {
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
      <div className="create-post update-post">
      <button className="close-btn" onClick={closeModal} title="close">X</button>
        <h2>Update post</h2>
        <form>
          <input
            type="text"
            placeholder="Write Description"
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
        </form>
        <div className="actions">
          <button className="delete-btn" title="Delete" onClick={handleDelete}>Delete</button>
          <button type="submit" onClick={() => handleSubmit} title="Update">Update</button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdatePost;
