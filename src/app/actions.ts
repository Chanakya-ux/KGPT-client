"use server";

import type { ChatMessageContent } from '@/lib/types';

const API_URL = "https://kgpt-1.onrender.com/query";

interface LLMResponse {
  answer?: string;
  // The API might return other fields, but we only care about 'answer'.
  // Add error fields if the API specifies them.
}

export async function askQuestionAction(question: string): Promise<{ answer?: string; error?: string }> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      let errorBody = "Failed to fetch from API.";
      try {
        const errorData = await response.json();
        errorBody = errorData.detail || errorData.message || `API Error: ${response.status} ${response.statusText}`;
      } catch (e) {
        // Failed to parse error JSON
        errorBody = `API Error: ${response.status} ${response.statusText}`;
      }
      return { error: errorBody };
    }

    const data: LLMResponse = await response.json();
    
    if (data.answer) {
      return { answer: data.answer };
    } else {
      return { answer: "No answer returned from the LLM." };
    }

  } catch (error) {
    console.error("API call failed:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred while contacting the LLM." };
  }
}
