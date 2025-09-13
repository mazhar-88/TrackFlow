
export default function ParticipantList({ participants }) {
  return (
    <div
      className="list-group session-participants flex-grow-1"
      style={{
        maxHeight: "65vh",
        overflowY: "auto",
      }}
    >
      {participants.map((p) => (
        <div
          className="list-group-item d-flex align-items-center gap-3 border-0 border-bottom"
          key={p.userId}
          style={{ padding: "10px 0" }}
        >
          <div
            className="rounded-circle text-white d-inline-flex align-items-center justify-content-center"
            style={{
              width: 44,
              height: 44,
              fontWeight: "600",
              background: "linear-gradient(135deg,#667eea,#764ba2)",
            }}
          >
            {p.name?.charAt(0) || "J"}
          </div>
          <div>
            <div className="fw-semibold">{p.name || "Doe"}</div>
            <small className="text-muted">{p.status || "coming"}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
