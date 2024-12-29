import React from "react";

export const Popup: React.FC = () => {
  return (
    <div className="yt-summary-container">
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: 18 }}>YouTube Summary</h2>
        <p style={{ margin: "8px 0", fontSize: 14, lineHeight: 1.5 }}>
          Configure settings and generate summaries directly on YouTube video
          pages.
        </p>
        <div
          style={{
            margin: "16px 0",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          ⭐️ If you find this helpful, please{" "}
          <a
            href="https://github.com/avarayr/youtube-summarizer-oss/stargazers"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ef4444", textDecoration: "none" }}
          >
            star the project
          </a>{" "}
          on GitHub!
        </div>
        <p style={{ margin: "8px 0" }}>
          <a
            href="https://github.com/avarayr/youtube-summarizer-oss"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ef4444", textDecoration: "none" }}
          >
            View on GitHub
          </a>
          {" • "}
          <a
            href="https://github.com/sponsors/avarayr"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ef4444", textDecoration: "none" }}
          >
            Support this project
          </a>
        </p>
        <p style={{ margin: "8px 0", fontSize: 14 }}>
          <small>
            Made with ❤️ by{" "}
            <a
              href="https://github.com/avarayr"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#ef4444", textDecoration: "none" }}
            >
              avarayr
            </a>
          </small>
        </p>
      </div>
    </div>
  );
};
