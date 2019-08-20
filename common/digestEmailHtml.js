const createPostOutput = ({
  UserID, DateCreated, Content, Tags
}) => (
  `
  <div style="background-color: whitesmoke; border: 1px solid black;">
    <div>
      <div>${UserID}</div>
      <div>${DateCreated}</div>
    </div>
    <hr>
    <div>
      ${Content}
    </div>
    <div>
      ${Tags.join(' ')}
    </div>
  </div>
  `
);

const createDigestSection = result => (
  `
  <h3>New posts matching your digests for <i>${result.searchTerms.join(', ')}</i>:</h3>
  ${result.posts.map(post => createPostOutput(post))}
  `
);

export default results => (
  `
  <html>
    <head>
      <title>Your digest</title>
    </head>
    <body>
      ${results.map(result => createDigestSection(result))}
    </body>
  </html>
  `
);
