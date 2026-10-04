import type { ColorPalette } from "../types/palette";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function getPalettes(): Promise<ColorPalette[]> {
  return request<ColorPalette[]>("/palettes");
}

export function getPalette(id: number): Promise<ColorPalette> {
  return request<ColorPalette>(`/palettes/${id}`);
}

export function createPalette(palette: Omit<ColorPalette, "id">): Promise<ColorPalette> {
  return request<ColorPalette>("/palettes", {
    method: "POST",
    body: JSON.stringify(palette),
  });
}

export function updatePalette(
  id: number,
  palette: Omit<ColorPalette, "id">,
): Promise<ColorPalette> {
  return request<ColorPalette>(`/palettes/${id}`, {
    method: "PUT",
    body: JSON.stringify(palette),
  });
}

export function deletePalette(id: number): Promise<void> {
  return request<void>(`/palettes/${id}`, {
    method: "DELETE",
  });
}
