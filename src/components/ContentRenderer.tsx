import React from 'react';
import parse, { type DOMNode, type Element } from 'html-react-parser';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ContentRendererProps {
  htmlString: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ htmlString }) => {
  const options = {
    replace: (domNode: DOMNode) => {
      if (domNode.type === 'tag' && domNode.name === 'pre') {
        const codeElement = domNode.children[0] as Element;
        if (codeElement && codeElement.name === 'code' && codeElement.attribs && codeElement.attribs.class === 'c') {
          const firstChild = codeElement.children[0];
          const code = firstChild && firstChild.type === 'text' ? firstChild.data : '';
          return (
            <SyntaxHighlighter language="c" style={dracula}>
              {code}
            </SyntaxHighlighter>
          );
        }
      }
    },
  };

  return <>{parse(htmlString, options)}</>;
};

export default ContentRenderer;
