import { useEffect, useState } from "react";
import { ninjaApi } from "./ninja-api";
import { Cat } from "./cat";

export function NinjaHome() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cat, setCat] = useState<Cat | null>(null);

  async function loadNinja() {
    setLoading(true);
    setError(null);
    try {
      const data = await ninjaApi.getCat();
      setCat(data[0]);
    } catch (error) {
      setError(`System was not able to charge Ninja API data, error: ${error}`);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadNinja();
  }, []);

  return (
    <main>
      <header>
        <h1>Ninja</h1>
      </header>

      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      <section className="card">
        {loading ? (
          <p className="empty">Loading ninja API</p>
        ) : (
          <form className="card user-form" noValidate>
            <label htmlFor="name">Name</label>
            <input id="name" value={cat?.name} autoFocus />

            <label htmlFor="origin">Origin</label>
            <input id="origin" value={cat?.origin} autoFocus />
          </form>
        )}
      </section>
    </main>
  );
}
