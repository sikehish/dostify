export default function Menu({ joinCode, setJoinCode, setMode }) {
  return (
    <div className="home">
      <div className="create box">
        <button onClick={() => setMode("create")}>Create Call</button>
      </div>

      <div className="answer box">
        <input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Join with code"
        />
        <button onClick={() => setMode("join")}>Answer</button>
      </div>
    </div>
  );
}
