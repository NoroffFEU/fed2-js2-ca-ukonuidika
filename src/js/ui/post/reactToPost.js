import { reactPost } from "../../api/post/react";

export async function reactToPost(postId, symbol) {
  try {
    const response = await reactPost(postId, symbol);

    if (!response || !response.ok) {
      throw new Error("Failed to react to post");
    }

    const reactionData = await response.json();

    const count =
      reactionData.data.reactions.length > 0
        ? reactionData.data.reactions[0].count
        : 0;

    return { success: true, count };
  } catch (error) {
    console.error("Error reacting to post:", error);
    return { success: false };
  }
}
