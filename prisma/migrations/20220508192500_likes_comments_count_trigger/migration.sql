-- This function increments the likes or dislikes counts in Post and PostComment tables
CREATE OR REPLACE FUNCTION incrementLikes() RETURNS TRIGGER AS $$
  DECLARE
    id VARCHAR(30);
    reactionType VARCHAR(30) := 'likesCount';
  begin
    IF TG_ARGV[1] = 'postId' THEN
      id := NEW."postId";
      IF TG_TABLE_NAME = 'PostComment' THEN
        reactionType := 'commentsCount';
      END IF;
    ELSEIF TG_ARGV[1] = 'commentId' THEN
      id:= NEW."commentId";
      IF NEW."type" = 'dislike' THEN
        reactionType := 'dislikesCount';
      END IF;
    ELSE
      RAISE EXCEPTION 'Invalid entity id in comment increment %', TG_ARGV[1];
    END IF;

    EXECUTE FORMAT('UPDATE %I SET %I = %I + 1 WHERE "id" = %L', TG_ARGV[0], reactionType, reactionType, id);
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

-- This function decrements the likes or dislikes counts in Post and PostComment tables
CREATE OR REPLACE FUNCTION decrementLikes() RETURNS TRIGGER AS $$
  DECLARE
    id VARCHAR(30);
    reactionType VARCHAR(30) := 'likesCount';
  begin
    IF TG_ARGV[1] = 'postId' THEN
      id := OLD."postId";
      IF TG_TABLE_NAME = 'PostComment' THEN
        reactionType := 'commentsCount';
      END IF;
    ELSEIF TG_ARGV[1] = 'commentId' THEN
      id:= OLD."commentId";
      IF OLD."type" = 'dislike' THEN
        reactionType := 'dislikesCount';
      END IF;
    ELSE
      RAISE EXCEPTION 'Invalid entity id in comment decrement %', TG_ARGV[1];
    END IF;

    EXECUTE FORMAT('UPDATE %I SET %I = %I - 1 WHERE "id" = %L', TG_ARGV[0], reactionType, reactionType, id);
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

-- Defining the triggers

-- Increment likes on new like create
DROP TRIGGER IF EXISTS "post_likes_increment" on "PostLikes";
CREATE TRIGGER "post_likes_increment" AFTER INSERT ON "PostLikes" FOR EACH ROW EXECUTE FUNCTION incrementLikes('Post', 'postId');

-- Decrement likes on like delete
DROP TRIGGER IF EXISTS "post_likes_decrement" on "PostLikes";
CREATE TRIGGER "post_likes_decrement" AFTER DELETE ON "PostLikes" FOR EACH ROW EXECUTE FUNCTION decrementLikes('Post', 'postId');

-- Increment likes/dislikes on new like/dislike create
DROP TRIGGER IF EXISTS "comment_likes_increment" on "CommentReactions";
CREATE TRIGGER "comment_likes_increment" AFTER INSERT ON "CommentReactions" FOR EACH ROW EXECUTE FUNCTION incrementLikes('PostComment', 'commentId');

-- Decrement likes/dislikes on like/dislike delete
DROP TRIGGER IF EXISTS "comment_likes_decrement" on "CommentReactions";
CREATE TRIGGER "comment_likes_decrement" AFTER DELETE ON "CommentReactions" FOR EACH ROW EXECUTE FUNCTION decrementLikes('PostComment', 'commentId');

-- Increment comments on new comment create
DROP TRIGGER IF EXISTS "post_comments_increment" on "PostComment";
CREATE TRIGGER "post_comments_increment" AFTER INSERT ON "PostComment" FOR EACH ROW EXECUTE FUNCTION incrementLikes('Post', 'postId');

-- Decrement comments on comment delete
DROP TRIGGER IF EXISTS "post_comments_decrement" on "PostComment";
CREATE TRIGGER "post_comments_decrement" AFTER DELETE ON "PostComment" FOR EACH ROW EXECUTE FUNCTION decrementLikes('Post', 'postId');
