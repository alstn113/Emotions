import { produce } from 'immer';
import { create } from 'zustand';

type States = {
  // write form
  title: string;
  slug: string;
  body: string;
  description: string;
  thumbnail: string | null;
  tags: string[];
  editSeries: boolean;
  series: {
    id: string;
    name: string;
  } | null;

  // publish modal
  isPublishScreenOpen: boolean;
};

type Actions = {
  reset: () => void;

  // write form
  changeTitle: (title: string) => void;
  changeSlug: (slug: string) => void;
  changeBody: (body: string) => void;
  changeDescription: (description: string) => void;
  changeThumbnail: (thumbnail: string | null) => void;
  changeTags: (tags: string[]) => void;
  changeEditSeries: (state: boolean) => void;
  changeSeries: (series: { id: string; name: string } | null) => void;

  // publish modal
  openPublishScreen: () => void;
  closePublishScreen: () => void;
};

const initialState: States = {
  // write form
  title: '',
  slug: '',
  body: '',
  description: '',
  thumbnail: null,
  tags: [],
  editSeries: false,
  series: null,

  // publish modal
  isPublishScreenOpen: false,
};

const useWriteStore = create<States & Actions>((set) => ({
  ...initialState,

  reset: () => set(initialState),

  // write form
  changeTitle: (title) =>
    set(
      produce((draft) => {
        draft.title = title;
      }),
    ),
  changeSlug: (slug) =>
    set(
      produce((draft) => {
        draft.slug = slug;
      }),
    ),
  changeBody: (body) =>
    set(
      produce((draft) => {
        draft.body = body;
      }),
    ),
  changeDescription: (description) =>
    set(
      produce((draft) => {
        draft.description = description.slice(0, 200);
      }),
    ),
  changeThumbnail: (thumbnail) =>
    set(
      produce((draft) => {
        draft.thumbnail = thumbnail;
      }),
    ),
  changeTags: (tags) =>
    set(
      produce((draft) => {
        draft.tags = tags;
      }),
    ),
  changeEditSeries: (state) =>
    set(
      produce((draft) => {
        draft.editSeries = state;
      }),
    ),
  changeSeries: (series) =>
    set(
      produce((draft) => {
        draft.series = series;
      }),
    ),

  // publish modal
  openPublishScreen: () =>
    set(
      produce((draft) => {
        draft.isPublishScreenOpen = true;
      }),
    ),
  closePublishScreen: () =>
    set(
      produce((draft) => {
        draft.isPublishScreenOpen = false;
      }),
    ),
}));

export default useWriteStore;
