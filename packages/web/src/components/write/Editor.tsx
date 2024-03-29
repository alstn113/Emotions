import { useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';

import { Button } from '~/components/common';

import { mediaQuery } from '~/lib/styles';

import useWriteStore from '~/stores/useWriteStore';

import MarkdownEditor from './MarkdownEditor';
import TagInput from './TagInput';

const Editor = () => {
  const { title, body, changeTitle, changeBody, openPublishScreen } =
    useWriteStore();
  const navigate = useNavigate();

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <EditorHeader>
        <PostTitle
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => changeTitle(e.target.value)}
          maxRows={2}
        />
        <TagInput />
      </EditorHeader>
      <EditorBody>
        <StyledEditor onChangeText={changeBody} defaultValue={body} />
      </EditorBody>
      <EditorFooter>
        <Button shadow color="error" onClick={() => navigate('/')}>
          Exit
        </Button>
        <Button shadow color="success" onClick={openPublishScreen}>
          Publish
        </Button>
      </EditorFooter>
    </Container>
  );
};

const Container = styled(motion.div)`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: #fff;
`;

const EditorHeader = styled.div`
  padding-top: 2rem;
  padding-left: 3rem;
  padding-right: 3rem;
`;

const PostTitle = styled(TextareaAutosize)`
  background: transparent;
  display: block;
  padding: 0;
  font-size: 1.8rem;
  width: 100%;
  resize: none;
  line-height: 1.2;
  outline: none;
  border: none;
  font-weight: bold;
  color: #000;
  &::placeholder {
    color: #999;
  }

  ${mediaQuery.tablet} {
    font-size: 2.5rem;
  }
`;

const EditorBody = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;

  // custom scrollbar
  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    background: #f6d365;
    border-radius: 0.5rem;
  }
  &::-webkit-scrollbar-track {
    background: #fff;
  }
`;

const EditorFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 4rem;
  position: relative;
  bottom: 0;
  width: 100%;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
`;

const StyledEditor = styled(MarkdownEditor)`
  flex: 1;
  display: flex;
  flex-direction: column;
  ${mediaQuery.desktop} {
    flex: initial;
  }
`;

export default Editor;
