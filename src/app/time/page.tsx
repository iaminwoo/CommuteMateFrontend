"use client";

export default function TimePage() {
  const now = new Date();

  return (
    <div className="p-4">
      <h1>현재 Date()</h1>
      <p>toString(): {now.toString()}</p>
      <p>toISOString(): {now.toISOString()}</p>
    </div>
  );
}
