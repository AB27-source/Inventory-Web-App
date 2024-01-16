import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [verificationStatus, setVerificationStatus] = useState('');

    useEffect(() => {
        if (token) {
            // Replace with your actual backend URL
            axios.get(`http://localhost:8000/api/v1/auth/email-verify/?token=${token}`)
                .then(response => {
                    setVerificationStatus('Your account has been successfully activated!');
                })
                .catch(error => {
                    const status = searchParams.get('status');
                    if (status === 'token=expired') {
                        setVerificationStatus('The verification link has expired.');
                    } else if (status === 'token=invalid') {
                        setVerificationStatus('The verification link is invalid.');
                    } else if (status === 'user-not-found') {
                        setVerificationStatus('User not found.');
                    } else {
                        setVerificationStatus('Failed to verify the account. The link may be expired or invalid.');
                    }
                });
        }
    }, [token, searchParams]);

    return (
        <div>{verificationStatus}</div>
    );
}

export default VerifyEmail
