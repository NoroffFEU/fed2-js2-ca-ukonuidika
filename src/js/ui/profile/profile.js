export function renderProfile(data) {
  const profileGrid = document.getElementById("gridProfileContainer");

  let imageUrl;

  if (data.avatar instanceof File) {
    imageUrl = URL.createObjectURL(data.avatar);
  } else {
    imageUrl = data.avatar?.url
      ? data.avatar.url
      : "https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png";
  }

  const profileItems = `
        <div class="flex gap-[10px] bg-white p-5 rounded-[10px]">
          <div class="flex justify-center items-center w-[49px] h-[49px] rounded-[50%] overflow-hidden">
            <img src="${imageUrl}" alt="${
    data.avatar?.alt || "Profile Picture"
  }" class="w-full h-full object-cover">
          </div>
          <div>
            <h2 class="mt-0 mb-[14px] text-24px">${
              data.name || "Anonymous User"
            }</h2>
            <p class="text-[16px] text-[#ababab] mt-0">${
              data.email || "Email not available"
            }</p>
          </div>
        </div>
      `;

  profileGrid.innerHTML = profileItems;

  const navProfilePic = document.querySelector(".profile-pic-container img");
  if (navProfilePic) {
    navProfilePic.src = imageUrl;
  }
}
