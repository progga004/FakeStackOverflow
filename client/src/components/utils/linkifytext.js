export const linkifyText = (text) => {
  const markdownLinkRegex = /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g;

  let parts = [];
  let lastIndex = 0;

  text.replace(markdownLinkRegex, (match, linkText, url, index) => {
    // Add text before the link
    parts.push(text.substring(lastIndex, index));

    // Add the link
    parts.push(
      <a href={url} key={index} target="_blank" rel="noopener noreferrer">
        {linkText}
      </a>
    );

    lastIndex = index + match.length;
  });

  // Add any remaining text after the last link
  parts.push(text.substring(lastIndex));

  return parts;
};
