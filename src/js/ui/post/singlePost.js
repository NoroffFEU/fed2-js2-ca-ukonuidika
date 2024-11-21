import { readPost } from "../../api/post/read";
import { handleFollowButtonClick } from "../../api/profile/follow";
import { onDeletePost } from "./delete";
import { onGenerateComments, onSubmitComment } from "./postComment";
import { setupReactionListener } from "./postReaction";

async function checkIfFollowing(authorName) {
  const followingList = JSON.parse(
    localStorage.getItem("followingList") || "[]"
  );
  return followingList.includes(authorName);
}

export async function renderPost(postId) {
  const postDetail = document.getElementById("blogMainPost");

  try {
    const post = await readPost(postId);
    const { id, title, body, media, author, _count, comments } = post;

    const imageUrl =
      media?.url ||
      "https://media.istockphoto.com/id/1128826884/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment.jpg?s=612x612&w=0&k=20&c=390e76zN_TJ7HZHJpnI7jNl7UBpO3UP7hpR2meE1Qd4=";
    const date = new Date(post.created).toLocaleString();
    const reactions = post._count.reactions;
    const currentUserName = localStorage.getItem("username");

    const isPostOwner = currentUserName === author.name;
    const editDeleteButtons = isPostOwner
      ? `
     <a href="/post/edit/?id=${id}">
       <button class="mt-5 py-[5px] px-[10px] rounded-[10px] text-[16px] font-bold cursor-pointer bg-[#06113e] text-white">
         <i class="fa-solid fa-pen"></i>
       </button>
     </a>
     <button class="mt-5 py-[5px] px-[10px] rounded-[10px] text-[16px] font-bold cursor-pointer bg-[#06113e] text-white md:mb-0 mb-5" id="delete-post">
       <i class="fa-solid fa-trash-can"></i>
     </button>
   `
      : "";

    const isFollowing = await checkIfFollowing(author.name);

    postDetail.innerHTML = `
      <div class="bg-white p-5 rounded-[10px] my-[20px] mx-auto md:w-[60%] w-full ">
        <h1 class="text-center text-2xl font-bold">${title}</h1>
        <div class="flex justify-between flex-wrap">
          <div class="flex gap-[10px] bg-white p-5 rounded-[10px]">
            <div class="flex justify-center items-center w-[43px] h-[43px] rounded-[50%] overflow-hidden">
              <img src="https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png" alt="Profile Picture" class="w-full h-full object-cover">
            </div>
            <div>
              <h2 class="mt-0 mb-[2px] text-[16px]">${author.name}</h2>
              <p class="text-[16px] text-[#ababab] mt-0">${date}</p>
            </div>
          </div>
          <div >
              <button class="mb-5 md:mb-0 mt-5 py-[5px] px-[10px] rounded-[10px] text-[16px] font-bold cursor-pointer bg-[#06113e] text-white" id="followBtn">${
                isFollowing ? "Unfollow" : "Follow"
              }</button>
              ${editDeleteButtons}
            </div>
        </div>
        <p class="md:mt-0 mt-[16px]">${body}</p>
        <div class="w-full md:h-[400px] h-full">
          <img src="${imageUrl}" alt="Post Image" class="w-full h-full object-contain"/>
        </div>
        <div class="flex justify-between items-center mt-5">
          <div><i class="fa-regular fa-thumbs-up text-[16px] cursor-pointer" id="reaction" data-symbol="👍"></i> <span>${reactions}</span></div>
          <div><i class="fa-solid fa-message text-[16px]"></i> ${
            _count.comments
          }</div>
        </div>
        <div class="mt-5">
          <h4>All comments</h4>
          <div id="commentsSection"></div> 
          
          <form id="addCommentSection" class="mt-5">
            <textarea id="newComment" class=" border border-gray-400 first-letter:md:ml-[60px] p-[10px] resize-none w-[200px] ml-0" placeholder="Add a comment..." rows="3" required></textarea>
            <button id="submitComment" class="flex justify-center md:ml-[60px] ml-0 text-[14px] font-bold text-center py-[5px] px-[7px] bg-[#06113e] text-white border-0 rounded-[5px]">Submit</button>
          </form>
        </div>
      </div>
    `;

    if (isPostOwner) {
      document
        .getElementById("delete-post")
        .addEventListener("click", (event) => {
          onDeletePost(id);
        });
    }

    const followBtn = document.getElementById("followBtn");
    followBtn.addEventListener("click", async (e) => {
      await handleFollowButtonClick(followBtn, author.name);
      const newStatus = await checkIfFollowing(author.name);
      followBtn.textContent = newStatus ? "Unfollow" : "Follow";
    });

    document.getElementById("submitComment").addEventListener("click", (e) =>
      onSubmitComment(postId, e).then((res) => {
        if (res.data) {
          renderPost(postId);
        }
      })
    );

    setupReactionListener(id);
    onGenerateComments(comments);
  } catch (error) {
    console.error(error);
  }
}
