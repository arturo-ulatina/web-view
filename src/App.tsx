import { useEffect, useState } from "react";
import { usersApi } from "./api";
import type { User, UserInput } from "./types";
import { UserForm } from "./UserForm";

// null = form closed, "new" = creating, User = editing that user
type FormState = null | "new" | User;

export function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(null);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      setUsers(await usersApi.list());
    } catch (err) {
      setError(
        `Could not load users. Is the API running on port 8000? (${(err as Error).message})`,
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSubmit(input: UserInput) {
    setError(null);
    try {
      if (form === "new") {
        const created = await usersApi.create(input);
        setUsers((current) => [...current, created]);
      } else if (form) {
        const updated = await usersApi.update(form.id, input);
        setUsers((current) =>
          current.map((u) => (u.id === updated.id ? updated : u)),
        );
      }
      setForm(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleDelete(user: User) {
    const fullName = [user.name, user.lastname].filter(Boolean).join(" ");
    if (!confirm(`Delete ${fullName}? Their payments will be deleted too.`)) {
      return;
    }

    setError(null);
    try {
      await usersApi.remove(user.id);
      setUsers((current) => current.filter((u) => u.id !== user.id));
      if (form !== null && form !== "new" && form.id === user.id) setForm(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main>
      <header>
        <h1>Users</h1>
        <button onClick={() => setForm("new")} disabled={form === "new"}>
          + New user
        </button>
      </header>

      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {form !== null && (
        <UserForm
          // Remount when switching users so the fields reset
          key={form === "new" ? "new" : form.id}
          user={form === "new" ? null : form}
          onSubmit={handleSubmit}
          onCancel={() => setForm(null)}
        />
      )}

      <section className="card">
        {loading ? (
          <p className="empty">Loading users…</p>
        ) : users.length === 0 ? (
          <p className="empty">No users yet. Create the first one.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Last name</th>
                <th>Age</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.lastname ?? <span className="muted">—</span>}</td>
                  <td>{user.age}</td>
                  <td className="row-actions">
                    <button className="secondary" onClick={() => setForm(user)}>
                      Edit
                    </button>
                    <button className="danger" onClick={() => handleDelete(user)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
