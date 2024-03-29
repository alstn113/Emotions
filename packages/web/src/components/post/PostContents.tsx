import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styled from '@emotion/styled';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';

import LikeButton from '~/components/base/LikeButton';
import { Button } from '~/components/common';

import { useDeletePost, useGetPostBySlug } from '~/hooks/queries/post';
import usePostLikeManager from '~/hooks/usePostLikeManager';
import useUser from '~/hooks/useUser';

import { extractError } from '~/lib/error';
import formatDate from '~/lib/formatDate';
import { mediaQuery } from '~/lib/styles';
import '~/lib/styles/github-markdown.css';
import 'highlight.js/styles/github.css';
import { SinglePostReponse } from '~/lib/types';

import useBottomSheetStore from '~/stores/useBottomSheetStore';
import useModalStore from '~/stores/useModalStore';

import CommentList from './CommentList';
import PostSeriesViewer from './PostSeriesViewer';
import BaseLayout from '../layouts/BaseLayout';
import { MenuDots, Pencil, Trash } from '../vectors';

interface Props {
  username: string;
  slug: string;
}

const PostContents = ({ username, slug }: Props) => {
  const navigate = useNavigate();
  const { data } = useGetPostBySlug(username, slug, { suspense: true });
  const post = data as SinglePostReponse; // suspense

  const user = useUser();
  const isMyPost = user?.id === post?.user.id;
  const postDate = formatDate(post?.createdAt);
  const { openModal } = useModalStore();
  const { openBottomSheet } = useBottomSheetStore();
  const { isLiked, likeCount, toggleLike } = usePostLikeManager({
    initialIsLiked: post?.isLiked,
    initialLikeCount: post?.postStats.likes,
    postId: post?.id,
  });

  const html = useMemo(() => {
    return MarkdownIt({
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return (
              '<pre class="hljs"><code>' +
              hljs.highlight(str, { language: lang, ignoreIllegals: true })
                .value +
              '</code></pre>'
            );
          } catch (__) {
            // ignores
          }
        }

        return '<pre class="hljs"><code>' + '</code></pre>';
      },
    }).render(post?.body);
  }, [post?.body]);

  const { mutate: deletePost } = useDeletePost();

  const handleDeletePost = () => {
    openModal({
      title: '게시글 삭제',
      message: '정말로 게시글을 삭제하시겠습니까?',
      confirmText: '확인',
      cancelText: '취소',
      onConfirm: () => {
        deletePost(post?.id, {
          onSuccess: () => {
            navigate('/');
          },
          onError: (e) => {
            const error = extractError(e);
            alert(error.message);
          },
        });
      },
    });
  };

  const handleDelete = async () => {
    deletePost(post?.id, {
      onSuccess: () => {
        navigate('/');
      },
      onError: (e) => {
        const error = extractError(e);
        alert(error.message);
      },
    });
  };

  const onClickMore = () => {
    openBottomSheet([
      {
        icon: <Pencil />,
        name: '수정',
        onClick: () => {
          //TODO: 수정
        },
      },
      {
        icon: <Trash />,
        name: '삭제',
        onClick: () =>
          openModal({
            title: '포스트 삭제',
            message: '정말로 포스트을 삭제하시겠습니까?',
            confirmText: '확인',
            cancelText: '취소',
            onConfirm: handleDelete,
          }),
      },
    ]);
  };

  return (
    <BaseLayout
      headerRight={
        isMyPost && (
          <MoreButton onClick={onClickMore}>
            <MenuDots />
          </MoreButton>
        )
      }
    >
      <Container>
        <Title>{post?.title}</Title>
        <TagList>
          {post?.tags.map((tag) => {
            return <div key={tag}>{tag}</div>;
          })}
        </TagList>
        {post?.series && <PostSeriesViewer post={post} series={post?.series} />}
        {post?.thumbnail && <Thumbnail src={post?.thumbnail} />}
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <Group>
          <Link to={`/user/${post?.user.username}`}>
            <Author>
              by <b>{post?.user.username}</b> · {postDate}
            </Author>
          </Link>
          {isMyPost ? (
            <ButtonsWrapper>
              <Button shadow color="warning" size="sm">
                수정
              </Button>
              <Button shadow color="error" size="sm" onClick={handleDeletePost}>
                삭제
              </Button>
            </ButtonsWrapper>
          ) : (
            <></>
          )}
        </Group>
        <LikeButtonWrapper>
          <LikeButton size="md" isLiked={isLiked} onClick={toggleLike} />
          <span>좋아요 {likeCount.toLocaleString()}개</span>
        </LikeButtonWrapper>
        <CommentList postId={post?.id} />
      </Container>
    </BaseLayout>
  );
};

const Title = styled.div`
  font-size: 2rem;
  line-height: 1.5;
  font-weight: 900;
`;

const TagList = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    border-radius: 0.8rem;
    background: linear-gradient(to right bottom, #f6d365, #ffc9ba);
    color: #000;
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.8rem;
  margin-bottom: 1rem;
`;

const Author = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: #999;

  b {
    font-weight: 900;
    color: #cc6600;
  }
`;
const Group = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;
const ButtonsWrapper = styled.div`
  display: none;
  gap: 0.5rem;

  ${mediaQuery.mobile} {
    display: flex;
  }
`;

const LikeButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  span {
    color: #999;
    font-size: 0.8rem;
  }
  margin-bottom: 1rem;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  gap: 1rem;
  ${mediaQuery.tablet} {
    width: 736px;
    margin: 0 auto;
  }
`;

const MoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #fff;
  svg {
    width: 24px;
    height: 24px;
  }
`;

export default PostContents;
