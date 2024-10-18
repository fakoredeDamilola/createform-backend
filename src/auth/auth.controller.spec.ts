import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';

const mockAuthService = {
  login: jest.fn(),
  registerLocal: jest.fn(),
  googleLogin: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it("should return the access token from the service's login method", async () => {
      const signInDto: SignInDto = {
        email: 'testuser@test.com',
        password: 'testpass',
      };
      mockAuthService.login.mockResolvedValue({ access_token: 'jwt_token' });
      const result = await authController.login(signInDto);

      expect(authService.login).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual({ access_token: 'jwt_token' });
    });
  });
  describe('create account', () => {
    it('it should create an account when user signs up with email and password', async () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://example.com/profile.jpg',
      };
      mockAuthService.registerLocal.mockResolvedValue(signUpDto);
      const result = await authController.register(signUpDto);

      expect(authService.registerLocal).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(signUpDto);
    });
  });
  describe('googleAuthRedirect', () => {
    it('should call googleLogin when redirected', async () => {
      const req = { user: { id: 1, username: 'googleuser' } };
      mockAuthService.googleLogin.mockResolvedValue({
        access_token: 'google_token',
      });

      const result = await authController.googleAuthRedirect(req);

      expect(authService.googleLogin).toHaveBeenCalledWith(req);
      expect(result).toEqual({ access_token: 'google_token' });
    });
  });
});
