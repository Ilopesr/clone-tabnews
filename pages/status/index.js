import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  const { data } = useSWR("/api/v1/status", fetchAPI);
  const url =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e1e1e",
        color: "#00ff00",
        borderRadius: "10px",
        border: "1px solid #333",
        width: "80%",
        maxWidth: "800px",
        margin: "50px auto",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
        fontFamily: "Menlo, Monaco, 'Courier New', monospace",
        overflow: "hidden",
      }}
    >
      <nav
        style={{
          backgroundColor: "#2d2d2d",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #333",
        }}
      >
        <span
          style={{
            backgroundColor: "#ff5f56",
            width: "12px",
            height: "12px",
            display: "inline-block",
            borderRadius: "50%",
            marginRight: "8px",
            border: "1px solid #e33e41",
          }}
        ></span>
        <span
          style={{
            backgroundColor: "#ffbd2e",
            width: "12px",
            height: "12px",
            display: "inline-block",
            borderRadius: "50%",
            marginRight: "8px",
            border: "1px solid #e09e3e",
          }}
        ></span>
        <span
          style={{
            backgroundColor: "#27c93f",
            width: "12px",
            height: "12px",
            display: "inline-block",
            borderRadius: "50%",
            marginRight: "8px",
            border: "1px solid #1aab29",
          }}
        ></span>
      </nav>
      <div
        style={{
          padding: "20px",
        }}
      >
        <p
          style={{
            color: "#00ff00",
            marginBottom: "10px",
          }}
        >
          $ curl -X GET {url}/api/v1/status
        </p>
        <pre
          style={{
            backgroundColor: "#1e1e1e",
            color: "#00ff00",
            padding: "10px",
            borderRadius: "5px",
            overflowX: "auto",
          }}
        >
          {data ? JSON.stringify(data, null, 2) : "Loading..."}
        </pre>
        <UpdatedAt />
      </div>
    </div>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 5000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    const updatedAt = new Date(data.updated_at);
    updatedAtText = updatedAt.toLocaleString("pt-BR");
  }

  return <div>$ Última atualização: {updatedAtText}</div>;
}
