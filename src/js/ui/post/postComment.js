import { submitComment as apiSubmitComment } from "../../api/post/comment";
import { replyToComment } from "../../api/post/reply";
import { renderPost } from "../../ui/post/singlePost";

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const postId = getQueryParameter("id");

export async function onSubmitComment(postId, event) {
  event.preventDefault();
  const commentBody = document.getElementById("newComment").value.trim();

  if (!commentBody) {
    alert("Please enter a comment");
    return;
  }

  try {
    const result = await apiSubmitComment(postId, commentBody);

    if (result) {
      alert("Comment added successfully!");
      document.getElementById("newComment").value = "";

      return result;
    }
  } catch (error) {
    console.error("Error submitting comment:", error);
    alert(`Failed to submit comment: ${error.message}`);
  }
}

export function onGenerateComments(comments) {
  const commentsSection = document.getElementById("commentsSection");
  commentsSection.innerHTML = "";

  const commentMap = new Map();

  comments.forEach((comment) => {
    if (comment.replyToId) {
      const parentComment = commentMap.get(comment.replyToId);
      if (parentComment) {
        parentComment.replies = parentComment.replies || [];
        parentComment.replies.push(comment);
      }
    } else {
      commentMap.set(comment.id, comment);
    }
  });

  commentMap.forEach((comment) => {
    const commentDate = new Date(comment.created).toLocaleString();
    const commentHtml = `
    <div class="blogProfile">
      <div class="profile-pic-container-blog">
        <img src="${comment.author.avatar.url}" alt="${comment.author.avatar.alt}" class="profile-pic">
      </div>
      <div>
        <div class="commentSec">
          <h2 class="commentProfileName">${comment.author.name}</h2>
          <p class="comment">${comment.body}</p>
          <p>${commentDate}</p>
          <textarea class="replyInput" id="replyInput-${comment.id}" placeholder="Reply to this comment..." rows="2"></textarea>
          <button class="replyButton" data-comment-id="${comment.id}">Reply</button>
        </div>
      </div>
    </div>
    `;

    commentsSection.innerHTML += commentHtml;

    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach((reply) => {
        const replyDate = new Date(reply.created).toLocaleString();
        const replyHtml = `
        <div class="blogProfile reply">
          <div class="profile-pic-container-blog">
            <img src="${reply.author.avatar.url}" alt="${reply.author.avatar.alt}" class="profile-pic">
          </div>
          <div>
            <div class="replySec">
              <h2 class="replyProfileName">${reply.author.name}</h2>
              <p class="replyComment">${reply.body}</p>
              <p>${replyDate}</p>
            </div>
          </div>
        </div>
        `;
        commentsSection.innerHTML += `<div class="replyContainer">${replyHtml}</div>`;
      });
    }
    const replyButtons = document.querySelectorAll(".replyButton");
    replyButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const commentId = event.target.dataset.commentId;
        const replyBody = document
          .getElementById(`replyInput-${commentId}`)
          .value.trim();
        if (replyBody) {
          console.log(postId, commentId, replyBody);
          replyToComment(postId, commentId, replyBody).then((res) => {
            if (res.data) {
              renderPost(postId);
            }
          });
        } else {
          alert("Please enter a reply.");
        }
      });
    });
  });
}
