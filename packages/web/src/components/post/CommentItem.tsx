import { useState } from 'react';
import { Link } from 'react-router-dom';

import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';

import LikeButton from '~/components/base/LikeButton';
import MoreVertMenu from '~/components/post/MoreVertMenu';
import ReplyComment from '~/components/post/ReplyComment';
import SubCommentList from '~/components/post/SubCommentList';
import { Pencil, Trash } from '~/components/vectors';

import { useDeleteComment } from '~/hooks/queries/comment';
import { useGetCommentList } from '~/hooks/queries/post';
import useCommnetLikeManager from '~/hooks/useCommentLikeManager';
import useUser from '~/hooks/useUser';

import { extractError } from '~/lib/error';
import formatDate from '~/lib/formatDate';
import { Comment } from '~/lib/types';

import useModalStore from '~/stores/useModalStore';

import { Avatar } from '../common';

interface Props {
  comment: Comment;
  isSubcomment?: boolean;
}

//TODO:  adjust textarea height
const CommentItem = ({ comment, isSubcomment }: Props) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const [isReplying, setIsReplying] = useState(false);
  const { openModal } = useModalStore();
  const { isLiked, likeCount, toggleLike } = useCommnetLikeManager({
    commentId: comment.id,
    initialIsLiked: comment.isLiked,
    initialLikeCount: comment.likes,
    postId: comment.postId,
  });

  const isDeleted = comment.isDeleted;
  const isMyComment = user?.id === comment.user.id;
  const commentDate = formatDate(comment.createdAt);

  const { mutate } = useDeleteComment({
    onSuccess: async () => {
      await queryClient.refetchQueries(
        useGetCommentList.getKey(comment.postId),
      );
    },
    onError: (e) => {
      const error = extractError(e);
      alert(error.message);
    },
  });

  const handleDelete = () => {
    mutate(comment.id);
  };

  const handleOpenReply = () => {
    setIsReplying(true);
  };
  const handleCloseReply = () => {
    setIsReplying(false);
  };

  const items = [
    {
      icon: <Pencil />,
      name: '수정',
      onClick: () => {
        //TODO: open edit modal
      },
    },
    {
      icon: <Trash />,
      name: '삭제',
      onClick: () =>
        openModal({
          title: '댓글 삭제',
          message: '정말로 댓글을 삭제하시겠습니까?',
          confirmText: '확인',
          cancelText: '취소',
          onConfirm: handleDelete,
        }),
    },
  ];

  // if comment is deleted
  if (isDeleted) {
    return (
      <Container>
        <DeletedText>삭제된 댓글입니다.</DeletedText>
        {!isSubcomment && comment.subcomments && (
          <SubCommentList subcomments={comment.subcomments} />
        )}
      </Container>
    );
  }

  // normal comment
  return (
    <Container>
      <CommentHeader>
        <LeftWrapper>
          <Link to={`/user/${comment.user.username}`}>
            <Avatar
              src={comment.user.profileImage}
              alt={`${comment.user.username}'s profile image`}
              size="lg"
            />
          </Link>
          <UserInfo>
            <Link to={`/user/${comment.user.username}`}>
              <Username>{comment.user.username}</Username>
            </Link>
            <Time>{commentDate}</Time>
          </UserInfo>
        </LeftWrapper>
        {isMyComment && <MoreVertMenu items={items} />}
      </CommentHeader>
      <CommentBody>
        <p>
          {comment.mentionUser && (
            <Link to={`/user/${comment.mentionUser.username}`}>
              <MentionUserInfo>@{comment.mentionUser.username}</MentionUserInfo>
            </Link>
          )}
          {comment.text}
        </p>
      </CommentBody>
      <CommentFooter>
        <LikeWrapper>
          <LikeButton size="sm" isLiked={isLiked} onClick={toggleLike} />
          <LikeCount>
            {likeCount === 0 ? '' : likeCount.toLocaleString()}
          </LikeCount>
        </LikeWrapper>
        <ReplyButton onClick={handleOpenReply}>답글</ReplyButton>
      </CommentFooter>

      {/* if reply button is clicked, show ReplyComment component */}
      {isReplying && (
        <ReplyComment
          isSubcomment={isSubcomment}
          parentComment={comment}
          onClose={handleCloseReply}
        />
      )}

      {/* if subcomments exist, show SubCommentList component */}
      {!isSubcomment && comment.subcomments && (
        <SubCommentList subcomments={comment.subcomments} />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const DeletedText = styled.div`
  color: #999;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CommentBody = styled.div`
  margin-top: 0.3rem;
  margin-bottom: 0.5rem;
  p {
    color: #000;
    line-height: 1.5;
    font-size: 1rem;
    word-break: break-word;
  }
`;

const MentionUserInfo = styled.b`
  color: #4dabf7;
  font-weight: 900;
  font-size: 1rem;
  margin-right: 0.5rem;
`;

const CommentFooter = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 0.5rem;
`;

const LeftWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-left: 0.5rem;
`;

const Username = styled.div`
  font-size: 1rem;
  font-weight: 900;
  line-height: 1.5;
`;

const Time = styled.div`
  font-size: 0.8rem;
  line-height: 1.5;
  color: #999;
`;

const LikeWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

const LikeCount = styled.div`
  margin-left: 8px;
  font-size: 14px;
  line-height: 14px;
  padding: 0;
`;

const ReplyButton = styled.button`
  padding: 0;
  font-size: 0.9rem;
  color: #999;
`;

export default CommentItem;
