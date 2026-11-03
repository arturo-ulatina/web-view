import { useState, type FormEvent } from "react";
import { MAX_AGE, MIN_AGE, type User, type UserInput } from "./types";

interface Props {
  // The user being edited, or null when creating a new one
  user: User | null;
  onSubmit: (input: UserInput) => Promise<void>;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  age?: string;
}

// Same rules the API enforces, so most mistakes are caught before a request
function validate(name: string, age: string): FormErrors {
  const errors: FormErrors = {};
  if (name.trim() === "") errors.name = "Name is required.";

  const parsed = Number(age);
  if (age.trim() === "") {
    errors.age = "Age is required.";
  } else if (!Number.isInteger(parsed) || parsed < MIN_AGE || parsed > MAX_AGE) {
    errors.age = `Age must be a whole number between ${MIN_AGE} and ${MAX_AGE}.`;
  }
  return errors;
}

export function UserForm({ user, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(user?.name ?? "");
  const [lastname, setLastname] = useState(user?.lastname ?? "");
  const [age, setAge] = useState(user ? String(user.age) : "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const found = validate(name, age);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        lastname: lastname.trim() || null,
        age: Number(age),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card user-form" onSubmit={handleSubmit} noValidate>
      <h2>{user ? `Edit user #${user.id}` : "New user"}</h2>

      <label htmlFor="name">Name</label>
      <input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-invalid={Boolean(errors.name)}
        autoFocus
      />
      {errors.name && <small className="error">{errors.name}</small>}

      <label htmlFor="lastname">
        Last name <span className="optional">(optional)</span>
      </label>
      <input
        id="lastname"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />

      <label htmlFor="age">Age</label>
      <input
        id="age"
        type="number"
        min={MIN_AGE}
        max={MAX_AGE}
        value={age}
        onChange={(e) => setAge(e.target.value)}
        aria-invalid={Boolean(errors.age)}
      />
      {errors.age && <small className="error">{errors.age}</small>}

      <div className="actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : user ? "Save changes" : "Create user"}
        </button>
      </div>
    </form>
  );
}
