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
    <div class="flex gap-[10px] bg-white p-5 rounded-[10px]">
      <div class="flex justify-center items-center w-[25px] h-[25px] rounded-[50%] overflow-hidden mt-[10px]">
        <img src="${comment.author.avatar.url}" alt="${comment.author.avatar.alt}" class="w-full h-full object-cover">
      </div>
      <div>
        <div class="bg-[f4f4f4] p-[10px] rounded-[20px]">
          <h2 class="m-0 text-[16px]">${comment.author.name}</h2>
          <p>${comment.body}</p>
          <p>${commentDate}</p>
          <textarea class="w-full resize-none border border-gray-400 p-[10px]" id="replyInput-${comment.id}" placeholder="Reply to this comment..." rows="2"></textarea>
          <button class="text-[14px] font-bold text-center p-[10px] bg-[#06113e] text-white border-0 rounded-[5px] my-[15px] replyButton" data-comment-id="${comment.id}">Reply</button>
        </div>
      </div>
    </div>
    `;

    commentsSection.innerHTML += commentHtml;

    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach((reply) => {
        const replyDate = new Date(reply.created).toLocaleString();
        const replyHtml = `
        <div class="flex gap-[10px] bg-white p-5 rounded-[10px]">
          <div class="flex justify-center items-center w-[25px] h-[25px] rounded-[50%] overflow-hidden mt-[10px]">
            <img src="${reply.author.avatar.url}" alt="${reply.author.avatar.alt}" class="w-full h-full object-cover">
          </div>
          <div>
            <div class="bg-[#f5f5f5] p-[5px] rounded-[5px]">
              <h2 class="font-bold">${reply.author.name}</h2>
              <p class="mt-[5px]">${reply.body}</p>
              <p>${replyDate}</p>
            </div>
          </div>
        </div>
        `;
        commentsSection.innerHTML += `<div class="ml-[40px] border-l-[2px] border-[#ddd] pl-[10px]">${replyHtml}</div>`;
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
