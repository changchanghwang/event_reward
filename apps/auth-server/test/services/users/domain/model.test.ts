import { v7 } from 'uuid';
import { PasswordHashService } from '@services/users/domain/services';
import { User } from '@services/users/domain/model';
import { userOf } from '@test';

jest.mock('@services/users/domain/services');
jest.mock('uuid');

describe('User model test', () => {
  const passwordHashService = jest.mocked(new PasswordHashService());

  describe('from', () => {
    beforeEach(() => {
      const mockedUuid = v7 as jest.Mock<string>;
      mockedUuid.mockReturnValue('test-id');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('새로운 유저를 생성한다.', async () => {
      passwordHashService.hash.mockResolvedValue('test-hashed-password');

      const user = await User.from({
        username: 'test-username',
        email: 'test-email',
        password: 'test-password',
        passwordHashService,
      });

      expect(user).toEqual({
        id: 'test-id',
        username: 'test-username',
        email: 'test-email',
        password: 'test-hashed-password',
        role: 'USER',
      });
    });
  });

  describe('validatePassword', () => {
    test('password가 일치한다면 에러를 던지지 않는다.', async () => {
      passwordHashService.compare.mockResolvedValue(true);
      const user = userOf({
        password: 'hashed-password',
      });

      expect(
        await user.validatePassword('test-password', passwordHashService),
      ).toBeUndefined();
    });

    test('password가 일치하지 않으면 에러를 던진다.', async () => {
      passwordHashService.compare.mockResolvedValue(false);
      const user = userOf({
        password: 'hashed-password',
      });

      expect.assertions(2);
      try {
        await user.validatePassword('test-password', passwordHashService);
      } catch (e) {
        expect(e.message).toBe('Invalid password.');
        expect(e.getResponse().errorMessage).toBe(
          '이메일 또는 비밀번호가 일치하지 않습니다.',
        );
      }
    });
  });
});
