import React from 'react';

const AboutPage = (): JSX.Element => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">About Our Polling App</h1>
      <p className="text-lg mb-4">
        Welcome to our polling application! We aim to provide a simple and efficient way for users to create and share polls.
        Whether you're gathering opinions, making decisions, or just having fun, our app makes it easy to get feedback from your audience.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
      <p className="text-lg mb-4">
        Our mission is to empower individuals and communities to make informed decisions through accessible and intuitive polling tools.
        We believe in the power of collective intelligence and strive to facilitate open communication and feedback.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Key Features</h2>
      <ul className="list-disc list-inside mb-4">
        <li className="text-lg">User Registration and Authentication</li>
        <li className="text-lg">Easy Poll Creation with Multiple Options</li>
        <li className="text-lg">Share Polls via Unique Links and QR Codes</li>
        <li className="text-lg">Real-time Voting and Results</li>
        <li className="text-lg">Secure and Scalable Backend (Powered by Supabase)</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
      <p className="text-lg">
        If you have any questions, feedback, or suggestions, please don't hesitate to reach out to us at support@pollingapp.com.
      </p>
    </div>
  );
};

export default AboutPage;