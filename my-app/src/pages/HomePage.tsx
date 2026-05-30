import React from 'react';

export function HomePage() {
  const baseUrl = process.env.REACT_APP_API_BASE_URL ?? 'https://localhost:5001';

  return (
    <div className="page">

      <div className="card">
      <h2 className="page-title">Biblioteca</h2>

        <p className="muted">
          Bem vindo ao sistema de biblioteca.
        </p>
      </div>
    </div>
  );
}