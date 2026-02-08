import { registerUser, loginUser, getCurrentUser } from '@/services/auth';
import apiClient from '@/services/api';

jest.mock('@/services/api');

const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('sends POST request with user data', async () => {
      const userData = { email: 'test@example.com', password: 'password123', firstName: 'John' };
      const mockResponse = { data: { id: '1', email: 'test@example.com', firstName: 'John' } };
      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await registerUser(userData);

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse.data);
    });

    it('throws error on registration failure', async () => {
      mockedApi.post.mockRejectedValue({ detail: 'Email already exists' });

      await expect(registerUser({ email: 'test@example.com', password: 'pass' }))
        .rejects.toEqual({ detail: 'Email already exists' });
    });
  });

  describe('loginUser', () => {
    it('sends POST request with credentials', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const mockResponse = { data: { accessToken: 'token123', expiresIn: 3600 } };
      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await loginUser(credentials);

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getCurrentUser', () => {
    it('sends GET request to /auth/me', async () => {
      const mockResponse = { data: { id: '1', email: 'test@example.com' } };
      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await getCurrentUser();

      expect(mockedApi.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockResponse.data);
    });
  });
});
