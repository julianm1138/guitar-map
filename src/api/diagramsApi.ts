// src/api/diagramApi.ts
export async function saveDiagram(
  name: string,
  dots: { x: number; y: number }[]
) {
  try {
    const response = await fetch("http://localhost:5000/diagram/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, dots }),
    });
    if (!response.ok) {
      throw new Error("Error saving diagram");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function loadDiagrams() {
  try {
    const response = await fetch("http://localhost:5000/diagram/load", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Error loading diagrams");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
