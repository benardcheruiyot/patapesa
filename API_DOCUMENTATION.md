# PataPesa App - API Documentation

## Overview
PataPesa is a mobile payment application that integrates with M-Pesa STK Push for account activation and transaction processing.

## Technical Specifications

### Platform
- **Frontend**: React Native 0.80.2
- **Backend**: Node.js with Express
- **Database**: AsyncStorage (local)
- **Payment Gateway**: M-Pesa Daraja API

### System Architecture
```
[Mobile App] → [Backend API] → [M-Pesa Daraja API] → [User Phone]
```

## API Endpoints

### 1. Connectivity Test
```
GET /ping
Response: { status: 'success', message: 'Backend is reachable!' }
```

### 2. Configuration Check
```
GET /test-config
Response: { configured: true, shortCode: '5892851', mode: 'production' }
```

### 3. STK Push Payment
```
POST /stkpush
Content-Type: application/json

Request Body:
{
  "amount": 100,
  "phoneNumber": "254XXXXXXXXX",
  "accountReference": "Activation",
  "transactionDesc": "Account Activation Fee"
}

Response (Success):
{
  "MerchantRequestID": "xxxx-xxxx-xxxx",
  "CheckoutRequestID": "ws_CO_xxxxxx",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted for processing",
  "CustomerMessage": "Success. Request accepted for processing"
}
```

### 4. M-Pesa Callback (Required for Production)
```
POST /mpesa/callback
Content-Type: application/json

Safaricom sends callback with payment result
```

## Security Features

### Authentication
- User registration with referral system
- Secure password handling
- Session management with AsyncStorage

### API Security
- CORS headers configured
- Request logging and monitoring
- Input validation
- Error handling

### Network Security
- Smart network discovery
- Multiple IP fallback
- HTTP cleartext for development (HTTPS required for production)

## Payment Flow

1. **User Registration**: User creates account
2. **Payment Request**: User initiates account activation
3. **STK Push**: Backend sends STK Push to user's phone
4. **User Confirmation**: User enters M-Pesa PIN on phone
5. **Callback**: Safaricom sends payment result to callback URL
6. **Account Activation**: Backend activates user account

## Error Handling

### Network Errors
- Multiple backend URL attempts
- Automatic retry mechanism
- User-friendly error messages

### Payment Errors
- Invalid phone number validation
- Insufficient funds handling
- Transaction timeout management

## Integration Requirements

### Development Environment
- Node.js 16+
- React Native development setup
- Android SDK for testing

### Production Requirements
- HTTPS-enabled server
- Public domain for callback URL
- SSL certificate
- Production M-Pesa credentials

## Testing Strategy

### Sandbox Testing
- Use test credentials
- Test phone numbers
- No real money transactions

### Production Testing
- Small amount transactions (1 KES)
- Real phone numbers
- Live money transactions

## Compliance

### Data Protection
- User data stored locally only
- No sensitive data transmitted unnecessarily
- Secure credential handling

### M-Pesa Compliance
- Proper error handling
- Transaction logging
- Callback URL implementation
- User consent for payments

## Performance

### Response Times
- Connectivity test: <1 second
- STK Push request: 2-5 seconds
- User sees prompt on phone: 5-10 seconds

### Scalability
- Stateless backend design
- Efficient database queries
- Optimized network requests

## Support Information

### Current Status
- ✅ Fully functional in sandbox
- ✅ Network connectivity resolved
- ✅ Ready for production deployment

### Known Limitations
- Requires production M-Pesa credentials for real transactions
- Callback URL needs public domain for production
- HTTPS required for production deployment
