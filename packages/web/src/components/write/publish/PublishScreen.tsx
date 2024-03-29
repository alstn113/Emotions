import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';

import { mediaQuery } from '~/lib/styles';

import useWriteStore from '~/stores/useWriteStore';

import PublishPreview from './PublishPreview';
import PublishSettings from './PublishSettings';

const PublishScreen = () => {
  const { isPublishScreenOpen } = useWriteStore();
  return (
    <AnimatePresence initial={false}>
      {isPublishScreenOpen && (
        <Container
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ stiffness: 500, damping: 100, type: 'spring' }}
        >
          <Contents>
            <PublishPreview />
            <Separator />
            <PublishSettings />
          </Contents>
        </Container>
      )}
    </AnimatePresence>
  );
};

const Container = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(to right bottom, #f6d365, #ffc9ba);

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 80%;
  padding: 1rem;

  ${mediaQuery.tablet} {
    flex-direction: row;
    max-width: 800px;
    width: 100%;
    height: 500px;
  }
`;

const Separator = styled.div`
  display: none;
  width: 2px;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
  margin: 0 2rem;
  ${mediaQuery.tablet} {
    display: flex;
  }
`;

export default PublishScreen;
