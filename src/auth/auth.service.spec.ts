import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUser: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  const signUpDto = {
    firstName: 'Damilola',
    lastName: 'Fakorede',
    createdAt: new Date(),
    forms: [],
    password: 'password',
    email: 'test@example.com',
    profilePicture: '',
  };

  describe('login', () => {
    const signInDto = {
      email: 'test@example.com',
      password: 'password',
    };
    it('should return an access token for valid credentials', async () => {
      const mockUser = {
        _id: 'userId',
        email: 'test@gmail.com',
        password: 'password',
      };

      jest.spyOn(userService, 'findUser').mockResolvedValue(mockUser as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockAccessToken');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      const result = await authService.login(signInDto);
      expect(userService.findUser).toHaveBeenCalledWith(signInDto.email);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser._id,
        username: mockUser.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInDto.password,
        mockUser.password,
      );
      expect(result).toEqual({ access_token: 'mockAccessToken' });
    });
    it('should throw unauthorized for a wrong password', async () => {
      const mockUser = {
        _id: 'userId',
        email: 'test@gmail.com',
        password: 'password123',
      };
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      jest.spyOn(userService, 'findUser').mockResolvedValue(mockUser as any);
      await expect(authService.login(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInDto.password,
        mockUser.password,
      );
    });
  });

  describe('findOrCreateGoogleUser', () => {
    it('create user account from google if it does not exist', async () => {
      const user = {
        firstName: 'John',
        lastName: 'Joe',
        email: 'google@google.com',
      };
      jest.spyOn(userService, 'findUser').mockResolvedValue(null);
      jest.spyOn(userService, 'createUser').mockResolvedValue(user as any);
      const result = await authService.findOrCreateGoogleUser(user);

      expect(userService.findUser).toHaveBeenCalledWith(user.email);

      expect(result).toEqual(user);
    });
    it('should return user if user has signed up before', async () => {
      const user = { email: 'google@goole.com' };
      jest.spyOn(userService, 'findUser').mockResolvedValue(user as any);
      const result = await authService.findOrCreateGoogleUser(user);
      expect(userService.findUser).toHaveBeenCalledWith(user.email);
      expect(userService.createUser).not.toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });

  describe('registerLocal', () => {
    it('should create a new user with hashed password', async () => {
      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt, 'hash').mockReturnValue(hashedPassword);
      jest.spyOn(userService, 'createUser').mockReturnValue(signUpDto as any);
      const response = await authService.registerLocal(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
      expect(userService.createUser).toHaveBeenCalledWith({
        ...signUpDto,
        password: hashedPassword,
        createdAt: expect.any(Date),
        forms: [],
      });
      expect(response).toEqual(signUpDto);
    });
    it('should throw an error if password hashing fails', async () => {
      jest.spyOn(bcrypt, 'hash').mockRejectedValue(new Error('Hashing failed'));

      await expect(authService.registerLocal(signUpDto)).rejects.toThrow(
        'Hashing failed',
      );
    });
  });

  describe('validateUser', () => {
    const user = signUpDto;
    it('should validate a user with a email on the database', async () => {
      const { password, ...result } = user;
      jest.spyOn(userService, 'findUser').mockResolvedValue(user as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const response = await authService.validateUser(
        user.email,
        user.password,
      );
      expect(response).toEqual(result);
    });
    it('should fail the validation of a user with incorrect password', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      const response = await authService.validateUser(
        user.email,
        user.password,
      );

      expect(response).toBeNull();
    });
  });
});
