import { useQuery } from '@tanstack/react-query';

import type { UseQueryOptionsOf } from '~/hooks/queries/types';

import { UserAPI } from '~/lib/api';

const useGetMe = (options: UseQueryOptionsOf<typeof UserAPI.getMe> = {}) => {
  return useQuery(getKey(), fetcher(), options);
};

const getKey = () => ['useGetMe'];
const fetcher = () => () => UserAPI.getMe();

useGetMe.getKey = getKey;
useGetMe.fetcher = fetcher;

export default useGetMe;
