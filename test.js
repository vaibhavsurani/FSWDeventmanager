const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let testEventId = '';

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Test event data
const testEvent = {
  title: 'Test Event',
  description: 'This is a test event',
  eventType: 'Academic',
  date: new Date().toISOString(),
  time: '10:00 AM',
  venue: 'Main Hall',
  image: 'test.jpg',
  registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  maxParticipants: 100
};

async function runTests() {
  try {
    console.log('Starting API tests...\n');

    // Test 1: Register User
    console.log('Test 1: Register User');
    const registerResponse = await axios.post(`${API_URL}/users/register`, testUser);
    console.log('Register Response:', registerResponse.data);
    authToken = registerResponse.data.token;
    console.log('Registration successful!\n');

    // Test 2: Login User
    console.log('Test 2: Login User');
    const loginResponse = await axios.post(`${API_URL}/users/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('Login Response:', loginResponse.data);
    console.log('Login successful!\n');

    // Test 3: Create Event
    console.log('Test 3: Create Event');
    const createEventResponse = await axios.post(`${API_URL}/events`, testEvent, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('Create Event Response:', createEventResponse.data);
    testEventId = createEventResponse.data._id;
    console.log('Event creation successful!\n');

    // Test 4: Get All Events
    console.log('Test 4: Get All Events');
    const getAllEventsResponse = await axios.get(`${API_URL}/events`);
    console.log('Get All Events Response:', getAllEventsResponse.data);
    console.log('Get all events successful!\n');

    // Test 5: Get Single Event
    console.log('Test 5: Get Single Event');
    const getEventResponse = await axios.get(`${API_URL}/events/${testEventId}`);
    console.log('Get Single Event Response:', getEventResponse.data);
    console.log('Get single event successful!\n');

    // Test 6: Update Event
    console.log('Test 6: Update Event');
    const updateEventResponse = await axios.patch(
      `${API_URL}/events/${testEventId}`,
      { title: 'Updated Test Event' },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('Update Event Response:', updateEventResponse.data);
    console.log('Event update successful!\n');

    // Test 7: Search Events
    console.log('Test 7: Search Events');
    const searchResponse = await axios.get(`${API_URL}/events/search?query=Test`);
    console.log('Search Response:', searchResponse.data);
    console.log('Search successful!\n');

    // Test 8: Delete Event
    console.log('Test 8: Delete Event');
    const deleteResponse = await axios.delete(`${API_URL}/events/${testEventId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('Delete Response:', deleteResponse.data);
    console.log('Event deletion successful!\n');

    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

runTests(); 