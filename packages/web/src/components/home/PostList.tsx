import styled from '@emotion/styled';

import PostListSkeleton from '~/components/home/skeleton/PostListSkeleton';

import { useGetPosts } from '~/hooks/queries/post';
import useIntersectionObserver from '~/hooks/useIntersectionObserver';

import { mediaQuery } from '~/lib/styles';

import PostCard from './PostCard';

const PostList = () => {
  const {
    data: posts,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useGetPosts({
    suspense: true,
  });

  const loadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const targetElement = useIntersectionObserver({ onIntersect: loadMore });

  return (
    <>
      <Container>
        {posts?.pages.map((page) =>
          page.list.map((post) => <PostCard key={post.id} post={post} />),
        )}
      </Container>
      {isFetching && <PostListSkeleton />}
      <InfiniteScrollTarget ref={targetElement} />
    </>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  ${mediaQuery.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${mediaQuery.desktop} {
    grid-template-columns: repeat(3, 1fr);
    margin-left: auto;
    margin-right: auto;
  }
  gap: 24px;
`;

const InfiniteScrollTarget = styled.div`
  visibility: hidden;
  width: 100%;
`;

export default PostList;
