import { handleFollowButtonClick } from "../api/profile/follow";
import { renderPosts } from "../ui/post/postGrid";
import { scrollToTop } from "./scroll";

export function updatePaginationControls(
  meta,
  currentPage,
  limit,
  readProfiles
) {
  const paginationControls = document.getElementById("paginationControls");

  paginationControls.innerHTML = "";

  if (!meta.isFirstPage) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        readProfiles(limit, currentPage).then((response) => {
          renderPosts(response.data, handleFollowButtonClick);
          scrollToTop();
          updatePaginationControls(
            response.meta,
            currentPage,
            limit,
            readProfiles
          );
        });
      }
    });
    paginationControls.appendChild(prevButton);
  }

  if (!meta.isLastPage) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => {
      currentPage++;
      readProfiles(limit, currentPage).then((response) => {
        renderPosts(response.data, handleFollowButtonClick);
        scrollToTop();
        updatePaginationControls(
          response.meta,
          currentPage,
          limit,
          readProfiles
        );
      });
    });
    paginationControls.appendChild(nextButton);
  }
}
