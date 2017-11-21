import React, { Component } from 'react';
import unfetch from 'isomorphic-unfetch';
import { Box, Paragraph, Anchor, Markdown } from 'grommet';
import { WidthCappedContainer } from '../components';

const MARKDOWN_SOURCE = 'https://raw.githubusercontent.com/wiki/notatestuser/chainline-webapp/Web-App-User-Guide.md';
const GITHUB_SOURCE_HREF = 'https://github.com/notatestuser/chainline-webapp/wiki/Web-App-User-Guide';

class GuidePage extends Component {
  state = { markdown: '&nbsp;', loading: true }

  async componentWillMount() {
    try {
      const res = await unfetch(MARKDOWN_SOURCE);
      const text = await res.text();
      this.setState({ markdown: text, loading: false });
    } catch (err) {
      this.setState({ markdown: `An error occurred: ${err.message || err}`, loading: false });
    }
  }

  render() {
    const { markdown, loading } = this.state;
    return (
      <Box background='white' direction='row' pad={loading ? 'large' : 'medium'}>
        <WidthCappedContainer size='large'>
          <Markdown
            content={markdown}
            components={{
              p: { component: Paragraph, props: { size: 'full' } },
              a: { component: Anchor },
            }}
          />
          <Paragraph>
            <hr />
            <Anchor href={GITHUB_SOURCE_HREF} target='_blank'>
              Original page on GitHub
            </Anchor>
          </Paragraph>
        </WidthCappedContainer>
      </Box>);
  }
}

export default GuidePage;
