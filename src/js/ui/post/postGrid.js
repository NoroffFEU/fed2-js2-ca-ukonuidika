import { reactToPost } from "./reactToPost";

function checkIfFollowing(authorName) {
  const followingList = JSON.parse(
    localStorage.getItem("followingList") || "[]"
  );
  return followingList.includes(authorName);
}

export function renderPosts(data, handleFollowButtonClick) {
  const gridList = document.getElementById("gridMainPost");
  gridList.innerHTML = "";

  if (data.length === 0) {
    gridList.innerHTML = "<h3>No posts available</h3>";
    return;
  }

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "bg-white p-5 mb-5 cursor-pointer rounded-[20px]";

    const formattedDate = new Date(item.created).toLocaleString();
    const imageUrl = item.author.avatar.url
      ? item.author.avatar.url
      : "https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png";

    const isFollowing = checkIfFollowing(item.author.name);

    div.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex gap-[10px] bg-white p-5 rounded-[10px]">
          <div class="flex justify-center items-center w-[43px] h-[43px] rounded-[50%] overflow-hidden">
            <img src="${imageUrl}" alt="Profile Picture" class="w-full h-full object-cover">
          </div>
          <div>
            <h2 class="mt-0 mb-[2px] text-[16px]">${item.author.name}</h2>
            <p class="text-[16px] text-[#ababab] mt-0">${formattedDate}</p>
          </div>
        </div>
        <button class="mt-5 py-[5px] px-[10px] rounded-[10px] text-[16px] font-bold cursor-pointer bg-[#06113e] text-white" id="followBtn">${
          isFollowing ? "Unfollow" : "Follow"
        }</button>
      </div>
      <p class="mt-0">${item.body}</p>
      <div class="w-full h-[400px]">
        <img src="${
          item.media?.url ||
          "https://media.istockphoto.com/id/1128826884/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment.jpg?s=612x612&w=0&k=20&c=390e76zN_TJ7HZHJpnI7jNl7UBpO3UP7hpR2meE1Qd4="
        }" alt="Image" class="w-full h-full object-contain"/>
      </div>
      <div class="flex justify-between items-center mt-20px">
        <div><i class="fa-regular fa-thumbs-up text-[18px]" id="reaction" data-symbol="👍" ></i> <span>${
          item._count.reactions
        }</span></div>
        <div><i class="fa-solid fa-message text-[18px]" ></i> ${
          item._count.comments
        }</div>
      </div>
    `;

    const followButton = div.querySelector("#followBtn");
    followButton.addEventListener("click", (event) => {
      event.stopPropagation();
      handleFollowButtonClick(followButton, item.author.name).then(() => {
        const newStatus = checkIfFollowing(item.author.name);
        followButton.textContent = newStatus ? "Unfollow" : "Follow";
      });
    });

    const thumbsUpIcon = div.querySelector("#reaction");
    thumbsUpIcon.addEventListener("click", async (event) => {
      event.stopPropagation();
      const postId = item.id;
      const symbol = thumbsUpIcon.getAttribute("data-symbol");
      const reactionCountElement = thumbsUpIcon.nextElementSibling;

      const reactionResult = await reactToPost(postId, symbol);

      if (reactionResult && reactionResult.success) {
        reactionCountElement.textContent = reactionResult.count;
      }
    });

    div.addEventListener("click", () => {
      window.location.href = `./post/?id=${item.id}`;
    });

    gridList.appendChild(div);
  });
}
