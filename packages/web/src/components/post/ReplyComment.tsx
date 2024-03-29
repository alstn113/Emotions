import { useState } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '~/components/common';

import { useCreateComment } from '~/hooks/queries/comment';
import { useGetCommentList } from '~/hooks/queries/post';
import useOpenLoginDialog from '~/hooks/useOpenLoginDialog';
import useUser from '~/hooks/useUser';

import { extractError } from '~/lib/error';
import { Comment } from '~/lib/types';

interface Props {
  parentComment: Comment;
  isSubcomment?: boolean;
  onClose: () => void;
}

const ReplyComment = ({ parentComment, onClose, isSubcomment }: Props) => {
  const [text, setText] = useState('');
  const queryClient = useQueryClient();
  const user = useUser();
  const ableToMention = isSubcomment && user?.id !== parentComment.user.id;
  const openLoginDialog = useOpenLoginDialog();

  const { mutate } = useCreateComment({
    onSuccess: async () => {
      await queryClient.refetchQueries(
        useGetCommentList.getKey(parentComment.postId),
      );
      return;
    },
    onError: (e) => {
      const error = extractError(e);
      alert(error.message);
    },
  });

  const handleSubmit = () => {
    if (!text) return;
    mutate({
      postId: parentComment.postId,
      text,
      parentCommentId: parentComment.id,
      mentionUserId: ableToMention ? parentComment.user.id : undefined,
    });
    onClose();
  };
  const handleCommentInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!user) {
      openLoginDialog('subcomment');
      e.target.blur();
      return;
    }
  };

  return (
    <Container>
      {ableToMention ? (
        <MentionCommentWrapper>
          <LeftAddon>@{parentComment.user.username}</LeftAddon>
          <Input
            type="text"
            placeholder="Write Comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={handleCommentInputFocus}
            mention
          />
        </MentionCommentWrapper>
      ) : (
        <Input
          type="text"
          placeholder="Write Comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={handleCommentInputFocus}
        />
      )}

      <ButtonsWrapper>
        <Button shadow color="success" size="sm" onClick={handleSubmit}>
          Confirm
        </Button>
        <Button shadow color="error" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </ButtonsWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 1.5rem;
  padding-left: 1.5rem;
`;

const Input = styled.input<{ mention?: boolean }>`
  width: 100%;
  padding: 0 16px;
  border: 1px solid #cccccc;
  height: 40px;
  border-radius: 8px;
  &:focus {
    border: 1px solid #2c2c2c;
  }

  ${({ mention }) =>
    mention &&
    css`
      border-radius: 0 8px 8px 0;
    `}
`;

const MentionCommentWrapper = styled.div`
  width: 100%;
  display: flex;
  height: 40px;
`;

const LeftAddon = styled.div`
  display: flex;
  align-items: center;
  background: #cccccc;
  border: 1px solid #cccccc;
  border-right: none;
  font-size: 12px;
  color: #7d7d7d;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  padding: 0 8px;
  height: 40px;

  // 줄바꿈 안하게
  white-space: nowrap;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  gap: 1rem;
  margin-top: 1rem;
`;

export default ReplyComment;
