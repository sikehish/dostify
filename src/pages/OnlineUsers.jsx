import { useCollection } from "../hooks/useCollection";
import { useAuthContext } from "../hooks/useAuthContext";
import "../styles/OnlineUsers.css";

function Mailto({ email, children }) {
  return (
    <span>
      <a href={`mailto:${email}`}>{children}</a>
    </span>
  );
}

function DateAndTime({ seconds }) {
  const dte = new Date(seconds * 1000);
  const hrs = dte.getHours();
  const min = dte.getMinutes();
  const dateString = dte.toLocaleDateString();
  //   const dateString = dte.toDateString();
  return (
    <span>
      {hrs > 12 ? hrs - 12 : hrs == 0 ? 12 : hrs}:
      {min < 10 && min > 0 ? "0" + min : min} {hrs > 12 ? "PM" : "AM"},{" "}
      {dateString}
    </span>
  );
}

export default function OnlineUsers() {
  const { isPending, error, documents } = useCollection("users");
  const { user: person } = useAuthContext();
  console.log(person.uid, documents);

  return (
    <div className="online-users">
      {isPending && <h2>Loading users...</h2>}
      {error && <div className="code-error">{error}</div>}
      {isPending == false && (
        <>
          {documents?.length <= 1 && <h2>No users yet</h2>}
          {documents?.length > 1 && (
            <>
              <h2>All Users</h2>
              <div className="user-list">
                {documents
                  .filter((doc) => doc.id != person.uid)
                  .map((user) => (
                    <div key={user.id} className="user-list-item">
                      <div>
                        {user.online && <span className="online-user"></span>}
                        <span>
                          <Mailto>
                            <span className="username">{user.name}</span>
                          </Mailto>
                          , {user.age}
                        </span>
                      </div>
                      <div>
                        <p className="user-desc">{user.description}</p>
                        {user.lastActive && (
                          <span className="last-active">
                            Last online:{" "}
                            <DateAndTime seconds={user.lastActive.seconds} />
                          </span>
                        )}
                      </div>
                      <p></p>
                    </div>
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
