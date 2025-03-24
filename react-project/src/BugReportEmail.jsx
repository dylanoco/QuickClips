import React from "react";
import ReactDOMServer from "react-dom/server";

const BugReportEmail = ({ description }) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h2 style={{ color: "#4A90E2" }}>Bug Report Confirmation</h2>
      <p>Hi,</p>
      <p>We've received your bug report and will look into it shortly.</p>
      <p><strong>Issue Details:</strong> {description}</p>
      <p>Thank you for your feedback!</p>
      <p>- The QuickClips Team</p>
    </div>
  );
};

export const getBugReportEmailHTML = (description) => {
  return ReactDOMServer.renderToStaticMarkup(<BugReportEmail description={description} />);
};
