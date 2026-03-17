"use client";

import { apiRequest } from "./api";

export interface PlaceSearchResult {
  name: string;
  roadAddress: string;
  address: string;
  link: string;
}

export async function searchPlaces(query: string): Promise<PlaceSearchResult[]> {
  const normalized = query.trim();

  if (normalized.length < 2) {
    return [];
  }

  const searchParams = new URLSearchParams({ query: normalized });

  return apiRequest<PlaceSearchResult[]>(`/places/search?${searchParams.toString()}`, {
    method: "GET",
    auth: true,
  });
}
