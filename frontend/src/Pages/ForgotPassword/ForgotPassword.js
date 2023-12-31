import { Box, Button, Container, Input, InputGroup, Text } from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAPI from '~/Api/UserAPI';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
     const handleSendOTP = () => {
        try {
            const email = document.getElementById('email').value;
            const param = {
                recipient: email,
                msgBody: 'Test send mail Parrot Farm Shop project \n\nThis is a Simple Email \n\nThanks',
                subject: '[11-Twell Parrot Shop] - Reset Password',
                check: 'password',
            };
            const sendOTP = UserAPI.getOTP(param);
            navigate('/forgot-password/otp', { state: { email } }); // Use 'state' to pass data
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Container minHeight={700} maxW="container.xl">
            <Box>
                <Text
                    fontSize="24px"
                    fontWeight="600"
                    borderBottom="1px solid #ccc"
                    width="90%"
                    padding="10px 0"
                    mt={10}
                >
                    Reset Password
                </Text>
            </Box>
            <Box width="40%" marginTop={50}>
                <Text fontSize="16px" fontWeight={500}>
                    Your email
                </Text>

                <InputGroup size="md">
                    <Input
                        id="email"
                        pr="4.5rem"
                        type={'text'}
                        placeholder="Enter your email"
                        required
                        fontSize="16px"
                        padding="4% 2%"
                    />
                </InputGroup>
            </Box>

            <Button
                colorScheme="blue"
                width="40%"
                padding="2%"
                fontSize="16px"
                marginTop={10}
                onClick={() => {
                    handleSendOTP();
                }}
            >
                Send
            </Button>
        </Container>
    );
};

export default ForgotPassword;
