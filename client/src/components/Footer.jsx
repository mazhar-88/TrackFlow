import React from 'react';

export default function Footer(){
  return (
    <footer className="bg-white text-center py-2 mt-auto shadow-sm">
      <div className="container">
        <small className="text-muted">© {new Date().getFullYear()} TrackFlow — MVP</small>
      </div>
    </footer>
  );
}
