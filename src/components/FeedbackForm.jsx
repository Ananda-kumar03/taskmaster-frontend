import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../components/styles.css'; // Ensure styles are linked

const FeedbackForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/feedback', { name, email, message }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // In a real application, you would send this to your backend API
            // For now, we'll just simulate a successful submission.
            console.log('Feedback submitted:', { name, email, message });
            // Example of a real API call:
            // const response = await axios.post('http://localhost:5000/api/feedback', { name, email, message });
            // if (response.status === 200) {
            //     toast.success('Thank you for your feedback!');
            // }

            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay
            console.log("🟢 Showing toast now!");
            toast.success('✅ Feedback sent!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: true,
      theme: 'colored'
    });
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            
            console.error('Error submitting feedback:', error);
            toast.error('❌ Failed to submit feedback. Please try again.', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                theme: 'colored'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        
        <div className="page-content feedback-form">
            
            {/* <button onClick={() => toast('Hello from Feedback Page!')}>Test Toast</button> */}

            <h2>Send Us Your Feedback</h2>
            <p>We'd love to hear your thoughts, suggestions, or any issues you've encountered.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Your Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Your Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="6"
                        required
                    ></textarea>
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;