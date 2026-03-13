export async function waitForAPI() {
  const url = `${import.meta.env.VITE_API_BASE_URL}/api/status`;

  while (true) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch (err) {}

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}
