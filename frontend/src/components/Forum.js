import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Container, Button } from "react-bootstrap";
import axios from "axios";

import config from "../config.json";
import NavbarComponent from "./NavbarComponent";
import "../styles/Forum.css";

function Forum() {
  const navigate = useNavigate();

  // Variables that are imported from the useAuth object
  const { loggedInUserId, loggedInUserType } = useAuth();

  // Array that holds the forum posts to be rendered
  const [forumPosts, setForumPosts] = useState([]);

  // Array that holds the counting of each threads to be rendered
  const [replyCounts, setReplyCounts] = useState({});

  // Variable that controls the sorting functionality
  const [sortingMethod, setSortingMethod] = useState("top");

  useEffect(() => {
    axios
      .get(`${config.AWS_URL}/forum`)
      .then((response) => {
        const sortedForumPosts = sortForumPostsByCreationDate(response.data.data);
        setForumPosts(sortedForumPosts);
      })
      .catch((error) => {
        console.error("Error fetching forum posts:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${config.AWS_URL}/forum/replyCounts`)
      .then((response) => {
        setReplyCounts(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching reply counts:", error);
      });
  }, []);

  /**
   * Handles the click event for creating a new forum post
   */
  const handleCreateForumPostClick = () => {
    navigate("/creatingforumpostpage");
  };

  /**
   * Handles the click event for navigating to a forum post by its title
   * @param {number} forumpostId - The ID of the forum post to navigate to
   */
  const handleTitleClick = (forumpostId) => {
    navigate(`/forumpostcontentpage/${forumpostId}`);
  };

  /**
   * Formats the time since the creation of a forum post
   * @param {string} creationDate - The creation date of the forum post
   * @returns {string} - The formatted time since creation
   */
  function formatTimeSinceCreation(creationDate) {
    const currentDate = new Date();
    const postDate = new Date(creationDate);
    const timeDifference = currentDate - postDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  }

  /**
   * Handles the click event for removing a forum post
   * @param {number} forumPostID - The ID of the forum post to remove
   */
  const handleRemoveButtonClick = (forumPostID) => {
    axios
      .delete(`${config.AWS_URL}/removeforumpost/${forumPostID}`)
      .then((response) => {
        const updatedForumPosts = forumPosts.filter(
          (post) => post.ForumPostID !== forumPostID
        );
        setForumPosts(updatedForumPosts);
      })
      .catch((error) => {
        console.error(`Error removing forum post ${forumPostID}:`, error);
      });
  };

  /**
   * Sorts forum posts by reply count in descending order
   * @param {Array} posts - An array of forum posts
   * @param {Object} replyCounts - An object mapping post IDs to their reply counts
   * @returns {Array} - The sorted array of forum posts
   */
  function sortForumPostsByReplyCount(posts, replyCounts) {
    return posts.slice().sort((postA, postB) => {
      return (
        (replyCounts[postB.ForumPostID] || 0) -
        (replyCounts[postA.ForumPostID] || 0)
      );
    });
  }

  /**
   * Sorts forum posts by creation date in descending order
   * @param {Array} posts - An array of forum posts
   * @returns {Array} - The sorted array of forum posts
   */
  function sortForumPostsByCreationDate(posts) {
    return posts.slice().sort((postA, postB) => {
      return new Date(postB.CreationDate) - new Date(postA.CreationDate);
    });
  }

  /**
   * Handles sorting forum posts by the latest creation date
   */
  const handleSortByLatest = () => {
    if (sortingMethod !== "latest") {
      const sortedForumPosts = sortForumPostsByCreationDate(forumPosts);
      setForumPosts(sortedForumPosts);
      setSortingMethod("latest");
    }
  };

  /**
   * Handles sorting forum posts by the top reply count
   */
  const handleSortByTop = () => {
    if (sortingMethod !== "top") {
      const sortedForumPosts = sortForumPostsByReplyCount(
        forumPosts,
        replyCounts
      );
      setForumPosts(sortedForumPosts);
      setSortingMethod("top");
    }
  };

  return (
    <>
      <NavbarComponent />
      <Container className="mt-4 text-center">
        <h1 className="forum-title">Welcome to the Night-In Community Forum</h1>
        <h2 className="forum-subtitle">
          Share Cocktail Recipes & Review Others' Recipes!
        </h2>
      </Container>

      <Container className="mt-4 text-center">
        <Button
          className="btn btn-primary create-button"
          onClick={handleCreateForumPostClick}
        >
          Create Forum Post
        </Button>
      </Container>
      <Container className="text-center">
        <div className="btn-group" role="group" aria-label="Forum Sorting">
          <button
            type="button"
            className={`btn btn-secondary ${
              sortingMethod === "top" ? "active" : ""
            }`}
            onClick={handleSortByTop}
          >
            Top Posts
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${
              sortingMethod === "latest" ? "active" : ""
            }`}
            onClick={handleSortByLatest}
          >
            Latest Posts
          </button>
        </div>
      </Container>
      <Container className="mt-4">
        <table className="table">
          <thead>
            <tr>
              <th className="col-4">Topic</th>
              <th className="col-4 text-center">Replies</th>
              <th className="col-4 text-right">Activity</th>
            </tr>
          </thead>
          <tbody>
            {forumPosts.map((post) => (
              <tr key={`${post.id}-${post.CreationDate}`}>
                <td className="col-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleTitleClick(post.ForumPostID);
                    }}
                  >
                    <h5>{post.TopicTitle}</h5>
                  </button>
                  <p>{post.Description}</p>
                </td>
                <td className="col-4 text-center">
                  <h5>{replyCounts[post.ForumPostID] || 0}</h5>
                </td>
                <td className="col-4 text-right">
                  <h5>{formatTimeSinceCreation(post.CreationDate)}</h5>
                </td>
                <td className="col-2 text-right">
                  {loggedInUserType === "A" ||
                  String(loggedInUserId) === String(post.UserId) ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveButtonClick(post.ForumPostID)}
                    >
                      Remove
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
    </>
  );
}

export default Forum;
