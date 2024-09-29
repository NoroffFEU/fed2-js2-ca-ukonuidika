import { onUpdatePost } from "../../ui/post/update";
import { authGuard } from "../../utilities/authGuard";

authGuard();

onUpdatePost();
