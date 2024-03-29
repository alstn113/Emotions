import { useMemo } from 'react';

import styled from '@emotion/styled';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';

import { mediaQuery } from '~/lib/styles';

import useWriteStore from '~/stores/useWriteStore';

import '~/lib/styles/github-markdown.css';
import '../../../node_modules/highlight.js/styles/github.css';

const Preview = () => {
  const { title, body } = useWriteStore();

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
    }).render(body);
  }, [body]);

  return (
    <Container>
      <ContentsWrapper>
        <Title>{title}</Title>
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </ContentsWrapper>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  flex-direction: column;
  flex: 1;
  background-color: #f8f9fa;
  display: none;
  width: 50%;
  ${mediaQuery.tablet} {
    display: flex;
  }
`;

const ContentsWrapper = styled.div`
  width: 100%;
  padding: 4rem;
  overflow-y: scroll;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  font-size: 2.5em;
  line-height: 1.2;
  font-weight: 800;
  margin-bottom: 3rem;
`;

export default Preview;
