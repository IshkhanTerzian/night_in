import React, { useState, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

import config from "../config.json";
import NavbarComponent from "./NavbarComponent";
import "../styles/ForumPostContentPage.css"; 

function ForumPostContentPage() {

  const navigate = useNavigate();

  // Variable that holds the loged in UserId and UserType
  const { loggedInUserId, loggedInUserType } = useAuth();

  // Variable to grab the forumPostID from the URL
  const { forumpostId } = useParams();

  // Variable to hold the data coming back from the backend
  const [data, setData] = useState(null);

  // Bool variable triggering the comment button
  const [commentVisible, setCommentVisible] = useState(false);

  // Variable that holds the comment textarea
  const [commentText, setCommentText] = useState("");

  // Array that holds the additional posts for the forum
  const [additionalPosts, setAdditionalPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${config.AWS_URL}/forumpostcontentpage/${forumpostId}`)
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching forum post:", error);
      });
  }, [forumpostId]);

  useEffect(() => {
    axios
      .get(`${config.AWS_URL}/userforumpost/${forumpostId}`)
      .then((response) => {
        setAdditionalPosts(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching additional forum posts:", error);
      });
  }, [forumpostId]);

  /**
   * Handles the event to set a new text area to comment on a post
   */
  const handleCommentClick = () => {
    setCommentVisible(!commentVisible);
    if (commentVisible) {
      setCommentText("");
    }
  };

  /**
   * Handles the event of submition of the new comment to be added 
   * to the backend
   */
  const handleSubmitClick = () => {
    if (commentText.trim() !== "") {
      axios
        .post(
          `${config.AWS_URL}/addnewpost`,
          {
            userId: loggedInUserId,
            forumpostId: forumpostId,
            content: commentText,
          }
        )
        .then((response) => {
          setCommentText("");
          setCommentVisible(false);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error adding a new post to the thread:", error);
        });
    }
  };

  /**
   * Handles removal of the entire thread and its contents
   */
  const handleRemoveButtonClick = (threadID) => {
    axios
      .delete(`${config.AWS_URL}/removeaddedpost/${threadID}`)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error(`Error removing post ${threadID}:`, error);
      });
  };

  /**
   * Handles the update of a heading forum post by the authenticated user
   */
  const handleUpdateForMainThread = () => {
    navigate(`/updatemainthreadpost/${forumpostId}`);
  };

  /**
   * Handles the update of a sub-comment post in a forum by an authenticated user
   * @param {number} threadID 
   */
  const handleUpdateThread = (threadID) => {
    navigate(`/updatethreadpost/${threadID}`);
  };

  return (
    <>
      <NavbarComponent />
      <Container className="forum-post-container">
        <div className="forum-post-content">
          {data && data.length > 0 && (
            <div>
              <h2 className="forum-post-title">{data[0].TopicTitle}</h2>
              <p className="forum-post-user">{data[0].UserName}</p>
              <p className="forum-post-text">{data[0].Content}</p>
              {String(loggedInUserId) === String(data[0].UserId) && (
                <button
                  className="btn btn-danger"
                  onClick={handleUpdateForMainThread}
                >
                  Update
                </button>
              )}
            </div>
          )}
        </div>
      </Container>
      {additionalPosts.map((post, index) => (
        <Container
          className="forum-post-container"
          key={`${post.PostId}-${post.CreationDate}`}
        >
          {index > 0 && <hr />}
          <div className="forum-post-content">
            <p className="forum-post-user">{post.UserName}</p>
            <p className="forum-post-text">{post.Content}</p>
            {loggedInUserType === "A" && (
              <>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveButtonClick(post.ThreadID)}
                >
                  Remove
                </button>
              </>
            )}

            {String(loggedInUserId) === String(post.UserID) && (
              <>
                <button
                  className="btn btn-danger"
                  onClick={() => handleUpdateThread(post.ThreadID)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveButtonClick(post.ThreadID)}
                >
                  Remove
                </button>
              </>
            )}
          </div>
        </Container>
      ))}
      <Container className="text-center">
        <Button
          variant="primary"
          style={{ marginTop: "20px" }}
          onClick={commentVisible ? handleSubmitClick : handleCommentClick}
        >
          {commentVisible ? "Submit" : "Comment"}
        </Button>
        {commentVisible && (
          <Form>
            <Form.Group controlId="commentTextArea">
              <Form.Control
                as="textarea"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="comment-textarea"
              />
            </Form.Group>
          </Form>
        )}
      </Container>
    </>
  );
}

export default ForumPostContentPage;
