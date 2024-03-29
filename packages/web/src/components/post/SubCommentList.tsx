import styled from '@emotion/styled';

import CommentItem from '~/components/post/CommentItem';

import { Comment } from '~/lib/types';

interface Props {
  subcomments: Comment[];
}

const SubCommentList = ({ subcomments }: Props) => {
  if (subcomments.length === 0) return null;
  return (
    <Container>
      {subcomments.map((subcomment) => {
        return (
          <CommentItem key={subcomment.id} isSubcomment comment={subcomment} />
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1.5rem;
  padding-top: 1.5rem;
  gap: 1.5rem;
`;

export default SubCommentList;
